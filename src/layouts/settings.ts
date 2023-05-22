import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../components/cover-picture.js'
import '../components/avatar-component.js'
import { container } from '../styles/container.js'
import { sizing } from '../styles/sizing.js'
import { spacing } from '../styles/spacing.js'
import { flex } from '../styles/flex.js'
import { classMap } from 'lit/directives/class-map.js'
import { ProfileStateWrapper } from '../helpers/profile-state-wrapper.js'

@customElement('layout-settings')
export class LayoutSettings extends ProfileStateWrapper {
  @property({ type: String })
  page: string = ''

  get fullName() {
    if (!this.firstName || !this.lastName)
      return html`<sl-skeleton effect="pulse" class="w30"></sl-skeleton>`
    return html`${this.firstName} ${this.lastName}`
  }

  render() {
    return html`
      <sl-card class="container">
        <nav id="nav" class="mb1">
          <sl-button
            href="/settings"
            variant="text"
            class=${classMap({ active: this.page === 'settings' })}
          >
            Settings
            <sl-icon name="gear" slot="suffix"></sl-icon>
          </sl-button>
          <sl-button
            href="/account"
            variant="text"
            class=${classMap({ active: this.page === 'account' })}
          >
            My account
            <sl-icon name="person" slot="suffix"></sl-icon>
          </sl-button>
        </nav>
        <slot></slot>
      </sl-card>
    `
  }

  static styles = [
    container,
    sizing,
    spacing,
    flex,
    css`
      :host {
        display: flex;
      }
      cover-picture {
        width: 100%;
      }
      h1 sl-skeleton {
        height: 1em;
      }
      #header {
        position: relative;
        top: -30px;
      }
      #nav sl-button::part(base) {
        color: var(--sl-color-gray-500);
      }
      #nav sl-button.active::part(base) {
        color: var(--sl-color-primary-500);
      }
    `,
  ]

  meta() {
    return {
      title: 'Profile',
      description: 'RCMD profile page',
    }
  }
}
