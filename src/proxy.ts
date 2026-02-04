import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for
    // - API routes
    // - _next (static files, images, etc.)
    // - vercel internals
    // - all rooted files (favicon.ico, etc.)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
