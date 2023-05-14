import { useEffect, useState } from "react";
import { supabase } from "../lib/api";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const Authenticate = () => {
  const [session, setSession] = useState<Session | null>();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      navigate("/sets");
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <>
      {!session ? (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      ) : (
        <button onClick={signOut}>Sign Out</button>
      )}
    </>
  );
};

export default Authenticate;
