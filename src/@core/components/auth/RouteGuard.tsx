import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'
import { usePermissions } from 'src/hooks/usePermissions'

interface RouteGuardProps {
  children: ReactNode
  requireAuth?: boolean
  guestOnly?: boolean
  requiredPermission?: {
    action: string
    subject: string
  }
}

const RouteGuard = (props: RouteGuardProps) => {
  const { children, requireAuth = true, guestOnly = false, requiredPermission } = props

  const { user, loading: authLoading } = useAuth()
  const { permissions, canAccessRoute, hasPermission } = usePermissions()
  const router = useRouter()

  // Redirect authenticated users from guest-only pages
  useEffect(() => {
    if (user && guestOnly) {
      const homeRoute = getHomeRoute(user.role_id?.toString())
      router.replace(homeRoute)
    }
  }, [user, guestOnly, router])

  // Redirect to home if user is on root and authenticated
  useEffect(() => {
    if (user && user.role_id && router.route === '/') {
      const homeRoute = getHomeRoute(user?.role_id?.toString())
      router.replace(homeRoute)
    }
  }, [user, router])

  // Show loading while auth or permissions are loading
  if (authLoading) {
    return <Spinner />
  }

  // Guest-only pages (login, register, etc.)
  if (guestOnly) {
    if (user) {
      return <Spinner /> // Will redirect in useEffect
    }
    return <>{children}</>
  }

  // Public pages that don't require auth
  if (!requireAuth) {
    return <>{children}</>
  }

  // Auth required but user not logged in
  if (!user) {
    router.replace({
      pathname: '/login',
      query: { returnUrl: router.asPath }
    })
    return <Spinner />
  }

  // Check specific permission if provided
  if (requiredPermission) {
    const hasRequiredPermission = hasPermission(requiredPermission.action, requiredPermission.subject)

    if (!hasRequiredPermission) {
      return (
        <BlankLayout>
          <NotAuthorized />
        </BlankLayout>
      )
    }
  }

  // Check route-based permissions
  const canAccess = canAccessRoute(router.route)

  if (!canAccess) {
    return (
      <BlankLayout>
        <NotAuthorized />
      </BlankLayout>
    )
  }

  return <>{children}</>
}

export default RouteGuard
