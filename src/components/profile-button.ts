import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import profileIcon from '../icons/profile.js'
import { button } from '../styles/button.js'
import { icon } from '../styles/icon.js'
import { connect } from 'pwa-helpers'
import store, { RootState } from '../redux/store'

@customElement('profile-button')
export class ProfileButton extends connect(store)(LitElement) {
  @property()
  sessionToken: string | null = null

  connectedCallback() {
    super.connectedCallback()
  }

  stateChanged(state: RootState) {
    this.sessionToken = state.auth.sessionToken
  }

  static styles = [button, icon]

  render() {
    return html`
      <a
        class="button icon"
        href=${this.sessionToken ? '/profile' : '/register'}
        >${profileIcon}</a
      >
    `
  }
}
