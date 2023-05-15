import { useAuth } from "../hooks/Auth";

const Authenticate = () => {
  const { session, signOut, signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {!session ? (
        <button onClick={handleSignIn}>Sign In</button>
      ) : (
        <button onClick={handleSignOut}>Sign Out</button>
      )}
    </>
  );
};

export default Authenticate;
