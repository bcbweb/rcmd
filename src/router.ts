import { html } from 'lit'
if (!(globalThis as any).URLPattern) {
  await import('urlpattern-polyfill')
}
import { isLoggedIn } from './utils/general.js'
import { Router } from '@thepassle/app-tools/router.js'
import { lazy } from '@thepassle/app-tools/router/plugins/lazy.js'
// @ts-ignore
import { title } from '@thepassle/app-tools/router/plugins/title.js'
import './pages/home/index.js'

const baseURL: string = (import.meta as any).env.BASE_URL

export const router = new Router({
  fallback: '/404',
  routes: [
    {
      path: `/404`,
      title: 'Not found',
      plugins: [lazy(() => import('./pages/not-found/index.js'))],
      render: () => html`<page-not-found></page-not-found>`,
    },
    {
      path: baseURL,
      title: 'Home',
      render: () => html`<page-home></page-home>`,
    },
    {
      path: `${baseURL}explore`,
      title: 'Explore',
      plugins: [lazy(() => import('./pages/explore/index.js'))],
      render: () => html`<page-explore></page-explore>`,
    },
    {
      path: `${baseURL}login`,
      title: 'Login',
      plugins: [
        lazy(() => import('./pages/login/index.js')),
        {
          shouldNavigate: () => ({
            condition: () => !isLoggedIn(),
            redirect: '/profile',
          }),
        },
      ],
      render: () => html`<page-login></page-login>`,
    },
    {
      path: `${baseURL}register`,
      title: 'Register',
      plugins: [
        lazy(() => import('./pages/register/index.js')),
        {
          shouldNavigate: () => ({
            condition: () => !isLoggedIn(),
            redirect: '/profile',
          }),
        },
      ],
      render: () => html`<page-register></page-register>`,
    },
    {
      path: `${baseURL}profile`,
      title: 'Profile - Manage blocks',
      plugins: [
        lazy(() => {
          import('./layouts/profile.js')
          import('./views/profile/blocks.js')
        }),
        {
          shouldNavigate: () => ({
            condition: () => isLoggedIn(),
            redirect: '/',
          }),
        },
      ],
      redirect: '/login',
      render: () =>
        html`
          <layout-profile page="blocks">
            <view-profile-blocks></view-profile-blocks>
          </layout-profile>
        `,
    },
    {
      path: `${baseURL}profile/links`,
      title: 'Profile - Manage links',
      plugins: [
        lazy(() => {
          import('./layouts/profile.js')
          import('./views/profile/links.js')
        }),
        {
          shouldNavigate: () => ({
            condition: () => isLoggedIn(),
            redirect: '/',
          }),
        },
      ],
      redirect: '/login',
      render: () =>
        html`
          <layout-profile page="links">
            <view-profile-links></view-profile-links>
          </layout-profile>
        `,
    },
    {
      path: `${baseURL}profile/rcmds`,
      title: 'Profile - Manage RCMDs',
      plugins: [
        lazy(() => {
          import('./layouts/profile.js')
          import('./views/profile/rcmds.js')
        }),
        {
          shouldNavigate: () => ({
            condition: () => isLoggedIn(),
            redirect: '/',
          }),
        },
      ],
      redirect: '/login',
      render: () => html`
        <layout-profile page="rcmds">
          <view-profile-rcmds></view-profile-rcmds>
        </layout-profile>
      `,
    },
    {
      path: `${baseURL}profile/info`,
      title: 'Add profile',
      plugins: [
        lazy(() => {
          import('./layouts/profile.js')
          import('./views/profile/info.js')
        }),
        {
          shouldNavigate: () => ({
            condition: () => isLoggedIn(),
            redirect: '/',
          }),
        },
      ],
      redirect: '/login',
      render: () => html`Update info`,
    },
    {
      path: `${baseURL}settings`,
      title: 'Settings',
      plugins: [
        lazy(() => {
          // import('./layouts/profile.js')
          // import('./views/profile/rcmds.js')
        }),
        {
          shouldNavigate: () => ({
            condition: () => isLoggedIn(),
            redirect: '/',
          }),
        },
      ],
      redirect: '/login',
      render: () => html`Settings`,
    },
  ],
})

/*
import type { Route } from '@vaadin/router'

export const routes: Route[] = [
  {
    path: '/',
    name: 'home',
    component: 'page-home',
    action: async () => {
      await import('../pages/page-home.js')
    },
  },
  {
    path: '/about',
    name: 'about',
    component: 'page-about',
    action: async () => {
      await import('../pages/page-about.js')
    },
  },
  {
    path: '/login',
    name: 'login',
    component: 'page-login',
    action: async () => {
      await import('../pages/page-login.js')
    },
  },
  {
    path: '/register',
    name: 'register',
    component: 'page-register',
    action: async () => {
      await import('../pages/page-register.js')
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: 'layout-profile',
    action: async () => {
      await import('../layouts/profile.js')
    },
    children: [
      {
        path: '/',
        name: 'profile-main',
        component: 'view-profile-main',
        action: async () => {
          await import('../views/profile-main.js')
        },
      },
      {
        path: '/rcmds',
        name: 'profile-rcmds',
        component: 'view-profile-rcmds',
        action: async () => {
          await import('../views/profile-rcmds.js')
        },
      },
      {
        path: '/links',
        name: 'profile-links',
        component: 'view-profile-links',
        action: async () => {
          await import('../views/profile-links.js')
        },
      },
    ],
  },
  {
    path: '/profile/edit',
    name: 'profile-edit',
    component: 'page-profile-edit',
    action: async () => {
      await import('../pages/profile-edit.js')
    },
  },
  {
    path: '/profile/add',
    name: 'profile-add',
    component: 'page-profile-add',
    action: async () => {
      await import('../pages/profile-add.js')
    },
  },
  {
    path: '/rcmd/:id',
    name: 'rcmd',
    component: 'page-rcmd-full',
    action: async () => {
      await import('../pages/rcmd-full.js')
    },
  },
  {
    path: '(.*)',
    name: 'not-found',
    component: 'page-not-found',
    action: async () => {
      await import('../pages/page-not-found.js')
    },
  },
]
*/
