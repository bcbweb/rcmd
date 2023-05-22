import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './pages/home/index.js'
import './components/site-header.js'
import './styles/global.css'
import './setup.js'
import { router } from './router.js'
import { Hub } from 'aws-amplify'
import { setUser } from './utils/state.js'
import { updateLocalStorage } from './utils/general.js'
import './components/search-drawer.js'
import notify from './utils/notify.js'

@customElement('app-index')
export class AppIndex extends LitElement {
  @property({ type: String }) page = ''
  @property()
  private hubAuthListener: any
  @property()
  private hubAuthListenerCancelToken: any

  static get styles() {
    return css`
      main {
        margin-top: 80px;
        padding-left: 16px;
        padding-right: 16px;
        padding-bottom: 16px;
      }
    `
  }

  connectedCallback() {
    super.connectedCallback()
    console.log((import.meta as any).env)
    this.hubAuthListener = this._handleAuthEvent.bind(this)
    this.hubAuthListenerCancelToken = Hub.listen('auth', this.hubAuthListener)
    document.addEventListener(
      'set-local-storage-token',
      this._handleSetLocalStorageToken
    )
    document.addEventListener(
      'remove-local-storage-token',
      this._handleRemoveLocalStorageToken
    )
    document.addEventListener(
      'user-onboarding-complete',
      this._handleOnboardingComplete
    )
    setUser()
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.hubAuthListenerCancelToken()
    document.removeEventListener(
      'set-local-storage-token',
      this._handleSetLocalStorageToken
    )
    document.removeEventListener(
      'remove-local-storage-token',
      this._handleRemoveLocalStorageToken
    )
  }

  firstUpdated() {
    router.addEventListener('route-changed', (RouteEvent: any) => {
      this.page = RouteEvent.context.url.pathname.replace('/', '')
      if ('startViewTransition' in document) {
        return (document as any).startViewTransition(() => {
          this.requestUpdate()
        })
      } else {
        this.requestUpdate()
      }
    })
  }

  private _handleSetLocalStorageToken(event: any) {
    updateLocalStorage('token', event.detail)
  }

  private _handleRemoveLocalStorageToken() {
    updateLocalStorage('token', null)
  }

  private _handleOnboardingComplete() {
    setUser()
    notify('Onboarding complete! Welcome to RCMD', 'success', 'check-circle')
    router.navigate('/profile')
  }

  private _loginFailureCallback() {
    notify('Automatic login failed.', 'danger', 'exclamation-triangle')
    router.navigate('/login')
  }

  private async _handleAuthEvent(data: any) {
    const { payload } = data
    switch (payload.event) {
      case 'signIn':
        await setUser()
        if (location.pathname !== '/register') {
          router.navigate('/profile')
        }
        break
      case 'autoSignIn':
        setUser()
        break
      case 'autoSignIn_failure':
        console.log(payload)
        this._loginFailureCallback()
        break
      case 'signOut':
        updateLocalStorage('token', null)
        router.navigate('/')
        break
      default:
        break
    }
  }

  render() {
    return html`
      <site-header ?enableBack="${false}" page=${this.page}></site-header>
      <search-drawer></search-drawer>
      <main>${router.render()}</main>
    `
  }
}
