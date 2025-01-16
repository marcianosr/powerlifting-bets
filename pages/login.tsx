import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AuthButton } from "../components/AuthButton";
import { Layout } from "../components/Layout";

const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/leaderboards");
    }
  }, [session]);

  const handleSignIn = async () => {
    await signIn("google");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return {
    session,
    status,
    handleSignIn,
    handleSignOut,
  };
};

const Login = () => {
  const { session, status, handleSignIn, handleSignOut } = useAuth();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <AuthButton
        isSignIn={!session}
        onAction={!session ? handleSignIn : handleSignOut}
      />
    </Layout>
  );
};

export default Login;
