import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { signOut } from '../services/auth.js'
import { router } from '../router.js'
import { ProfileStateWrapper } from '../helpers/profile-state-wrapper.js'
import { flex } from '../styles/flex.js'
import { lists } from '../styles/lists.js'
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
    this._handleStorageChange = this._handleStorageChange.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.token = localStorage.getItem('token')
    window.addEventListener('storage', this._handleStorageChange)
  }

  disconnectedCallback() {
    window.removeEventListener('storage', this._handleStorageChange)
    super.disconnectedCallback()
  }

  private _handleStorageChange(event: StorageEvent) {
    if (event.key === 'token') {
      this.token = event.newValue
      this.requestUpdate()
    }
  }

  private _handleAddProfileClick() {}

  private _handleSwitchProfileClick() {}

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
          <sl-avatar
            initials="BB"
            image=${ifDefined(
              this.profilePicture === null ? undefined : this.profilePicture
            )}
          ></sl-avatar>
        </sl-button>
        <sl-dropdown placement="bottom-end">
          <sl-button slot="trigger" caret pill>
            <sl-visually-hidden>More options</sl-visually-hidden>
          </sl-button>
          <sl-menu>
            <sl-menu-item @click=${() => router.navigate('/profile')}>
              Manage profile
            </sl-menu-item>
            <sl-menu-item @click=${() => router.navigate('/profile/rcmds')}>
              RCMDs
            </sl-menu-item>
            <sl-menu-item @click=${this._handleAddProfileClick}>
              Add profile type
            </sl-menu-item>
            <sl-menu-item @click=${this._handleSwitchProfileClick} disabled>
              Switch profile
            </sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item @click=${() => router.navigate('/account')}>
              My account
              <sl-icon slot="suffix" name="person"></sl-icon>
            </sl-menu-item>
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
            <sl-divider></sl-divider>
            <footer>
              <ul id="footer-menu" class="unstyled flex jcc">
                <li>
                  <sl-button variant="text" size="small">About</sl-button>
                </li>
                <li><sl-button variant="text" size="small">Help</sl-button></li>
                <li>
                  <sl-button variant="text" size="small">Terms</sl-button>
                </li>
                <li>
                  <sl-button variant="text" size="small">Privacy</sl-button>
                </li>
              </ul>
            </footer>
          </sl-menu>
        </sl-dropdown>
      </sl-button-group>
    `

    return this.isLoggedIn ? profileMenu : startMenu
  }

  static styles = [
    flex,
    lists,
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
      sl-menu {
        width: 300px;
      }
    `,
  ]
}
