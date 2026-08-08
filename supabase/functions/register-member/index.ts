import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const userId = typeof body?.userId === "string" ? body.userId : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
    const position = typeof body?.position === "string" ? body.position.trim() : null;
    const referredBy = typeof body?.referredBy === "string" ? body.referredBy : null;
    const epin = typeof body?.epin === "string" ? body.epin.trim().toUpperCase() : "";

    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (
      !uuidRe.test(userId) ||
      !email || email.length > 255 ||
      !fullName || fullName.length > 200 ||
      (position && position.length > 50) ||
      (referredBy && !uuidRe.test(referredBy)) ||
      !epin || epin.length < 4 || epin.length > 32 || !/^[A-Z0-9-]+$/.test(epin)
    ) {
      return json({ error: "Requête invalide" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // The caller must own the account they claim: verify it exists and matches the email.
    const { data: userRes, error: userErr } = await supabase.auth.admin.getUserById(userId);
    if (userErr || !userRes?.user || userRes.user.email?.toLowerCase() !== email.toLowerCase()) {
      return json({ error: "Compte introuvable" }, 403);
    }

    // A profile must not already exist for this account.
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) {
      return json({ error: "Profil déjà créé" }, 409);
    }

    // Atomically consume the e-pin.
    const { data: pin, error: pinErr } = await supabase
      .from("e_pins")
      .update({ is_used: true, used_at: new Date().toISOString(), used_by: userId })
      .eq("code", epin)
      .eq("is_used", false)
      .select("id, expires_at")
      .maybeSingle();

    if (pinErr) {
      console.error("register-member epin error", pinErr.message);
      return json({ error: "Erreur lors de la vérification du code" }, 500);
    }
    if (!pin || (pin.expires_at && new Date(pin.expires_at) <= new Date())) {
      return json({ error: "Le code e-pin n'est plus valide" }, 400);
    }

    const { error: profileErr } = await supabase.from("profiles").insert({
      user_id: userId,
      full_name: fullName,
      email,
      position,
      referred_by: referredBy,
      epin_used: epin,
    });

    if (profileErr) {
      console.error("register-member profile error", profileErr.message);
      return json({ error: "Erreur lors de la création du profil" }, 500);
    }

    return json({ success: true });
  } catch (_e) {
    return json({ error: "Erreur serveur" }, 500);
  }
});
