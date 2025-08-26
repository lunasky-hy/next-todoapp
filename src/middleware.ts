import { auth } from "@/app/lib/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
}

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/auth/signin") {
    return Response.redirect(new URL("/auth/signin", req.url));
  }
});