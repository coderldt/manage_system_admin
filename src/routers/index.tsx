import { useEffect, useState } from 'react'
import { useRoutes } from 'react-router-dom'
import NormalLayout from '@/layout/normal'
import React from 'react'
import BlankLayout from '@/layout/blank'
import ErrorLayout from '@/layout/error'
import { useAppState } from '@/hooks'
import type { Permission as PermissionType } from '@/types/info'

import Home from '@/views/home'
import Login from '@/views/login'

const User = React.lazy(() => import('@/views/sys/user'))
const Config = React.lazy(() => import('@/views/sys/config'))
const Permission = React.lazy(() => import('@/views/sys/permission'))
const Role = React.lazy(() => import('@/views/sys/role'))

const Notice = React.lazy(() => import('@/views/pixel/notice'))
const PageConfig = React.lazy(() => import('@/views/pixel/pageConfig'))

const NoFind = React.lazy(() => import('@/views/error/404'))
const NoPermission = React.lazy(() => import('@/views/error/402'))
// const Banding = React.lazy(() => import('@/views/banding'))

const Routes = () => {
  const info = useAppState((state) => state.info.info)
  const [permission, setPermission] = useState<PermissionType[]>([])

  useEffect(() => {
    const getPermission = info && info.permission || []
    setPermission(getPermission)
  }, [info])

  const checkUserRole = (path: string) => {
    return permission.find(permission => permission.path === path)
  }

  const requireRole = (component: JSX.Element, path: string) => {
    return checkUserRole(path) ? component : <NoPermission />
  }

  return useRoutes([
    {
      path: '',
      element: <NormalLayout />,
      children: [
        {
          path: '',
          element: requireRole(<Home />, '/')
        },
        {
          path: "system",
          children: [
            {
              path: 'user',
              element: <User />
            },
            {
              path: 'menu',
              element: <Permission />
            },
            {
              path: 'role',
              element: <Role />
            },
            {
              path: 'config',
              element: <Config />
            },
          ]
        },
        {
          path: "pixel",
          children: [
            {
              path: 'notice',
              element: <Notice />
            },
            {
              path: 'pageConfig',
              element: <PageConfig />
            },
          ]
        },
      ]
    },
    {
      path: '',
      element: <BlankLayout />,
    },
    {
      path: '',
      element: <ErrorLayout />,
      children: [
        {
          path: '404',
          element: <NoFind />
        },
        {
          path: '402',
          element: <NoPermission />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    // {
    //   path: '/banding',
    //   element: <Banding />
    // }
  ])
}


export default Routes
