import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/lib/logger";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position: string | null;
  referred_by: string | null;
  epin_used: string | null;
  created_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
        }
        if (isMounted) setProfile(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Listener for ONGOING auth changes (does NOT control loading)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        // Fire and forget - don't await, don't set loading
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // INITIAL load (controls loading state)
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Fetch profile BEFORE setting loading false
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return {
    user,
    profile,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
};
