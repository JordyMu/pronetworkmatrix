import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Admin access required");

    const body = await req.json();
    const { requestId, action, epinCode } = body;
    if (!requestId) throw new Error("requestId is required");

    // Get the join request
    const { data: request, error: reqError } = await supabase
      .from("join_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (reqError || !request) throw new Error("Request not found");

    // ACTION: generate - just generate the e-pin and return it for preview
    if (action === "generate") {
      if (request.status !== "pending") throw new Error("Request already processed");

      const { data: epinData, error: epinError } = await supabase.rpc("generate_epins", { count: 1 });
      if (epinError || !epinData?.length) throw new Error("Failed to generate e-pin");

      return new Response(
        JSON.stringify({ success: true, epinCode: epinData[0].code }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION: send - send the e-pin via email
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
    if (!epinCode) throw new Error("epinCode is required for send action");

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ProNetwork <onboarding@resend.dev>",
        to: [request.email],
        subject: "Votre E-PIN ProNetwork",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #d4af37; text-align: center;">Bienvenue chez ProNetwork!</h1>
            <p>Bonjour <strong>${request.full_name}</strong>,</p>
            <p>Votre demande d'adhésion a été <strong>approuvée</strong>! Voici votre E-PIN pour vous inscrire :</p>
            <div style="background: #1a1a2e; color: #d4af37; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${epinCode}</span>
            </div>
            <p>Utilisez ce code lors de votre inscription sur notre plateforme.</p>
            <p style="color: #888; font-size: 12px;">Ce code est à usage unique. Ne le partagez avec personne.</p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const emailError = await emailRes.text();
      console.error("Resend error:", emailError);
      throw new Error(`Failed to send email: ${emailError}`);
    }

    await supabase
      .from("join_requests")
      .update({ status: "approved", admin_notes: `E-PIN: ${epinCode} envoyé par email` })
      .eq("id", requestId);

    return new Response(
      JSON.stringify({ success: true, message: "E-PIN envoyé par email" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
