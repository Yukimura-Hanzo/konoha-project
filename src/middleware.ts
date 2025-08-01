//* Re-exporting auth function as middleware from auth module
export { auth as middleware } from "@/auth";
// import { auth } from "@/auth";

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
