import { Session, User } from "@supabase/supabase-js";
import { useContext, useState, useEffect, createContext } from "react";
import { supabase } from "../lib/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<{
  session: Session | null | undefined;
  user: User | null | undefined;
  signOut: () => void;
  signInWithGoogle: () => Promise<void>;
}>({
  session: null,
  user: null,
  signOut: () => {},
  signInWithGoogle: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user);
      setLoading(false);
      navigate("/sets");
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
      }
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   if (session?.user) {
  //     navigate("/sets");
  //   } else {
  //     navigate("/");
  //   }
  // }, [session?.user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
  };

  const value = {
    session,
    user,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
