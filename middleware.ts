import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Make all routes public - authentication is optional and only triggered by Sign In button
const isPublicRoute = createRouteMatcher(['/(.*)']);

export default clerkMiddleware(async (auth, request) => {
  // No route protection - all routes are public
  // Authentication only happens when user clicks Sign In/Register button
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
