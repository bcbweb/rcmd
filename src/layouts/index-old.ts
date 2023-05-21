import { LitElement, html, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { Router } from '@vaadin/router'
import { connect } from 'pwa-helpers'
import config from '../config.js'
import { attachRouter, urlForName } from '../router/index.js'
import { getUserMeta } from '../connectors/user.js'
import { button } from '../styles/button.js'
import store from '../redux/store.js'
import { setSessionToken } from '../redux/authSlice.js'
import {
  setEmail,
  setFirstName,
  setLastName,
  setUrlHandle,
  setProfilePicture,
  setDateOfBirth,
  setGender,
  setLocale,
  setTimeZone,
  setCoverPicture,
  setRoles,
  setTags,
  setInterests,
  setProfileBlocks,
  setOnboardingComplete,
} from '../redux/userSlice.js'
import { CognitoUser } from 'amazon-cognito-identity-js'
import 'pwa-helper-components/pwa-install-button.js'
import 'pwa-helper-components/pwa-update-available.js'
import '../components/site-header.js'
import '../components/notification-message.js'
import '../components/tag-list.js'
import '../components/account-menu.js'
import { Amplify, Hub, Auth } from 'aws-amplify'
import awsconfig from '../aws-exports.js'

Amplify.configure(awsconfig)

@customElement('layout-index')
export class LayoutIndex extends connect(store)(LitElement) {
  @query('main')
  private main!: HTMLElement

  private hubAuthListener: any
  private hubAuthListenerCancelToken: any

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
    this.hubAuthListener = this._handleAuthEvent.bind(this)
    this.hubAuthListenerCancelToken = Hub.listen('auth', this.hubAuthListener)
    this.addEventListener(
      'user-onboarding-complete',
      this._handleOnboardingComplete
    )
    this.addEventListener('user-meta-update', this._handleUserMetaUpdate)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.hubAuthListenerCancelToken()
    this.removeEventListener(
      'user-onboarding-complete',
      this._handleOnboardingComplete
    )
  }

  async firstUpdated(): Promise<void> {
    this._setUser()
    attachRouter(this.main)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js')
      })
    }
  }

  private async _setUser(user?: CognitoUser | null) {
    // If no CognitoUser is provided, try fetching it
    let cognitoUser = user || (await Auth.currentAuthenticatedUser())
    if (!cognitoUser) {
      console.error('No cognito user.')
      return
    }
    const session = cognitoUser?.getSignInUserSession() ?? null
    if (!session) {
      console.error('Error retrieving user session')
      return
    }
    const idToken = session.getIdToken()
    store.dispatch(setSessionToken(idToken.jwtToken))
    const userMeta = await getUserMeta(idToken.payload.email)
    store.dispatch(setEmail(idToken.payload.email))
    store.dispatch(setFirstName(userMeta.first_name))
    store.dispatch(setLastName(userMeta.last_name))
    store.dispatch(setUrlHandle(userMeta.url_handle))
    store.dispatch(setProfilePicture(userMeta.profile_picture))
    store.dispatch(setDateOfBirth(userMeta.date_of_birth))
    store.dispatch(setGender(userMeta.gender))
    store.dispatch(setLocale(userMeta.locale))
    store.dispatch(setTimeZone(userMeta.time_zone))
    store.dispatch(setCoverPicture(userMeta.cover_picture))
    store.dispatch(setRoles(Object.values(userMeta.roles || {})))
    store.dispatch(setTags(Object.values(userMeta.tags || {})))
    store.dispatch(setInterests(Object.values(userMeta.interests || {})))
    store.dispatch(
      setProfileBlocks(Object.values(userMeta.profile_blocks || {}))
    )
    store.dispatch(setOnboardingComplete(userMeta.onboarding_complete))
    return Promise.resolve()
  }

  private _loginFailureCallback() {
    console.error('Login failed.')
    Router.go(urlForName('login'))
  }

  private async _handleOnboardingComplete() {
    this._setUser()
    Router.go(urlForName('profile'))
  }

  private _handleUserMetaUpdate() {
    this._setUser()
  }

  private async _handleAuthEvent(data: any) {
    const { payload } = data
    switch (payload.event) {
      case 'signIn':
        await this._setUser(payload.data)
        if (location.pathname !== '/register') {
          Router.go(urlForName('profile'))
        }
        break
      case 'autoSignIn':
        this._setUser(payload.data)
        break
      case 'autoSignIn_failure':
        this._loginFailureCallback()
        break
      case 'signOut':
        this._loginFailureCallback()
        break
      default:
        break
    }
  }

  static styles = [
    button,
    css`
      :host {
        display: flex;
        flex-direction: column;
      }
      profile-picture {
        --border: solid 1px currentColor;
      }
      main,
      main > * {
        display: flex;
        flex: 1;
        flex-direction: column;
      }
      footer {
        padding: 1rem;
        background-color: #eee;
        text-align: center;
      }
      main:empty ~ footer {
        display: none;
      }
    `,
  ]

  render() {
    return html`
      <notification-message></notification-message>
      <site-header></site-header>

      <!-- The main content is added / removed dynamically by the router -->
      <main role="main"></main>

      <footer>
        <span>Environment: ${config.environment}</span>
      </footer>
    `
  }
}
