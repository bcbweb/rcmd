import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { signOut } from '../services/auth.js'
import { router } from '../router.js'
import { ProfileStateWrapper } from '../helpers/profile-state-wrapper.js'
import 'pwa-helper-components/pwa-install-button.js'
import 'pwa-helper-components/pwa-update-available.js'

@customElement('account-menu')
export class AccountMenu extends ProfileStateWrapper {
  @property() token: string | null = null
  @property({ type: Boolean }) open: boolean = false
  @property()
  roleLabels: { [key: string]: string } = {
    private: 'Private',
    business: 'Business',
    content_creator: 'Content creator',
  }

  get isLoggedIn() {
    return !!this.token
  }

  constructor() {
    super()
    this.handleStorageChange = this.handleStorageChange.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.token = localStorage.getItem('token')
    window.addEventListener('storage', this.handleStorageChange)
  }

  disconnectedCallback() {
    window.removeEventListener('storage', this.handleStorageChange)
    super.disconnectedCallback()
  }

  handleStorageChange(event: StorageEvent) {
    if (event.key === 'token') {
      this.token = event.newValue
      this.requestUpdate()
    }
  }

  private _signOut() {
    signOut()
  }

  render() {
    const startMenu = html`
      <sl-button
        variant="primary"
        href="${(import.meta as any).env.BASE_URL}register"
      >
        Start sharing
      </sl-button>
      <sl-button href="${(import.meta as any).env.BASE_URL}login">
        Log in
      </sl-button>
    `
    const profileMenu = html`
      <sl-button-group label="profile menu">
        <sl-button href="/profile" pill style="width: 40px">
          <sl-avatar initials="BB" image=${this.profilePicture}></sl-avatar>
        </sl-button>
        <sl-dropdown placement="bottom-end">
          <sl-button slot="trigger" caret pill>
            <sl-visually-hidden>More options</sl-visually-hidden>
          </sl-button>
          <sl-menu>
            <sl-menu-item @click=${() => router.navigate('/profile')}>
              Manage profile
            </sl-menu-item>
            <sl-menu-item @click=${this._handleAddProfileClick}>
              Add profile
            </sl-menu-item>
            <sl-menu-item @click=${this._handleSwitchProfileClick} disabled>
              Switch profile
            </sl-menu-item>
            <sl-menu-item @click=${() => router.navigate('/profile/info')}>
              Update info
            </sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item @click=${() => router.navigate('/settings')}>
              Settings
              <sl-icon slot="suffix" name="gear"></sl-icon>
            </sl-menu-item>
            <sl-menu-item>
              <pwa-install-button>
                <button>Install app</button>
              </pwa-install-button>
              <pwa-update-available>
                <button>Update app</button>
              </pwa-update-available>
            </sl-menu-item>
            <sl-menu-item @click="${this._signOut}">Log out</sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-button-group>
    </sl-button> `

    return this.isLoggedIn ? profileMenu : startMenu
  }

  static styles = [
    css`
      :host {
        position: relative;
      }
      sl-avatar {
        --size: 30px;
        align-items: center;
        display: flex;
        height: 100%;
      }
    `,
  ]
}
