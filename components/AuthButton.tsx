import { Button } from "primereact/button";

interface AuthButtonProps {
  isSignIn: boolean;
  onAction: () => Promise<void>;
}

export const AuthButton = ({ isSignIn, onAction }: AuthButtonProps) => {
  return (
    <Button
      onClick={onAction}
      className={`${isSignIn ? "mb-4" : ""} px-6 py-3`}
      severity={isSignIn ? "info" : "danger"}
      raised
    >
      <i className={`pi ${isSignIn ? "pi-google" : "pi-sign-out"} mr-2`} />
      {isSignIn ? "Sign in with Google" : "Sign out"}
    </Button>
  );
};
