//? SHADCN
import { Button } from "@/components/ui/button";
//? ICONS
import { AiFillGithub } from "react-icons/ai";
import { LogOut } from "lucide-react";
//? Auth.ts CONFIGURATION
import { signIn, signOut } from "@/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/dashboard" });
      }}
      className="w-full"
    >
      <Button
        type="submit"
        size="sm"
        className="w-full py-4"
      >
        <AiFillGithub /> Sign-in with GitHub
      </Button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button
        type="submit"
      >
        <LogOut /> Sign Out
      </Button>
    </form>
  );
}
