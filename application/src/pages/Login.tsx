import { useEffect, useState } from "react";
import { supabase } from "../lib/api";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [session, setSession] = useState<Session | null>();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  if (session) navigate("/home");

  return (
    <>
      {!session ? (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      ) : null}
    </>
  );
};

export default Login;
