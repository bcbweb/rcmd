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
import { getSession } from './services/auth.js'

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
    this.hubAuthListener = this._handleAuthEvent.bind(this)
    this.hubAuthListenerCancelToken = Hub.listen('auth', this.hubAuthListener)
    this._initializeState()
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

  private async _initializeState() {
    const session = await getSession()
    if (session) {
      setUser()
      updateLocalStorage('token', session.idToken.jwtToken)
    } else {
      updateLocalStorage('token', null)
    }
  }

  private _loginFailureCallback() {
    notify('Login failed.', 'error', 'exclamation-triangle')
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
        this._loginFailureCallback()
        break
      case 'signOut':
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
