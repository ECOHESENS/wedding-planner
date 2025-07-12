import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en', 'ar'],
  defaultLocale: 'fr',
  pathnames: {
    '/': '/',
    '/dashboard': '/dashboard',
    '/auth/signin': '/auth/signin',
    '/auth/signup': '/auth/signup'
  }
})

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing)