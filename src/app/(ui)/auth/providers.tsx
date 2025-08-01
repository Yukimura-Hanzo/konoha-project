"use client";

//? REACT
import React, { ReactNode} from "react";
//? AUTH
import { SessionProvider } from "next-auth/react";

export function Provider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
