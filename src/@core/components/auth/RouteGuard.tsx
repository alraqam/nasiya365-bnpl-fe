import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { usePermissions } from 'src/hooks/usePermissions'
import useHomeRoute from 'src/layouts/components/acl/useHomeRoute'

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
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const { user, loading: authLoading } = useAuth()
  const { permissions, canAccessRoute, hasPermission } = usePermissions()
  const homeRoute = useHomeRoute()
  const router = useRouter()

  // Mark initial load as complete when router is ready and auth is loaded
  useEffect(() => {
    if (router.isReady && !authLoading) {
      setIsInitialLoad(false)
    }
  }, [router.isReady, authLoading])

  // Redirect authenticated users from guest-only pages
  useEffect(() => {
    if (!isInitialLoad && user && guestOnly && permissions.length) {
      router.replace(homeRoute)
    }
  }, [user, guestOnly, homeRoute, isInitialLoad, router])

  // Redirect to home if user is on root and authenticated
  useEffect(() => {
    if (!isInitialLoad && user && router.asPath === '/') {
      router.replace(homeRoute)
    }
  }, [user, router.asPath, router, homeRoute, isInitialLoad])

  // Show loading during initial load or auth loading
  if (isInitialLoad || authLoading) {
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
