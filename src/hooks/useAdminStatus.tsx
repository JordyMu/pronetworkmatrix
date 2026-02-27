import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStatus = (userId?: string) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!userId) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      setIsCheckingAdmin(true);

      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });

      if (error) {
        const { data: fallbackData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();

        setIsAdmin(!!fallbackData);
        setIsCheckingAdmin(false);
        return;
      }

      setIsAdmin(!!data);
      setIsCheckingAdmin(false);
    };

    checkAdmin();
  }, [userId]);

  return { isAdmin, isCheckingAdmin };
};
