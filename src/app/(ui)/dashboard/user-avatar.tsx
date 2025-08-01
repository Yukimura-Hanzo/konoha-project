//? AUTH
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { SignIn } from "../auth/auth-components";
import type { Session } from "next-auth";
//? SHADCN
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default async function UserAvatar() {

  //* Await result of auth function, which retrieves current session
  const session: Session | null = await auth();

  //* Fallback img
  const fallbackUserImg = "images/avatars/shadcn.png";

  // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
  //? Filter out sensitive data before passing to client.
  if (session?.user) {
    session.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  //? If there is no session or user then return to sign-in
  if (!session?.user) return <SignIn />;

  //* Create a delay for testing (emulate loading)
  await new Promise((res) => setTimeout(res, 4000));

  //? Check console for Object data from GitHub API
  // console.log(JSON.stringify(session, null, 2));

  return (
    <SessionProvider session={session}>
      <div className="rounded-2xl m-3">
        <div className="flex align-center">
          {/* Avatar icon */}
          <div className="py-3 pl-0 pr-4">
          <Avatar>
            <AvatarImage src={session.user.image || fallbackUserImg} alt="@Github Avatar" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          </div>
          {/* Profile welcome msg */}
          <div>
            <h2 className="text-xl font-semibold">
              Good Morning&#x1F596;, {session.user.name?.slice(0, 4).toUpperCase()}
            </h2>
            <p className="text-sm text-gray-500 pb-0">
              Welcome back to your dashboard.
            </p>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
