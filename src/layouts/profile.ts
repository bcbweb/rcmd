import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import '../components/cover-picture.js'
import '../components/avatar-component.js'
import { container } from '../styles/container.js'
import { sizing } from '../styles/sizing.js'
import { flex } from '../styles/flex.js'
import { classMap } from 'lit/directives/class-map.js'
import { ProfileStateWrapper } from '../helpers/profile-state-wrapper.js'
import notify from '../utils/notify.js'

const VITE_USER_SSR_URL = (import.meta as any).env.VITE_USER_SSR_URL

@customElement('layout-profile')
export class LayoutProfile extends ProfileStateWrapper {
  @property({ type: String })
  page: string = ''

  constructor() {
    super()
    this._handleCopyLinkClick = this._handleCopyLinkClick.bind(this)
  }

  get fullName() {
    if (!this.firstName || !this.lastName)
      return html`<sl-skeleton effect="pulse" class="w30"></sl-skeleton>`
    return html`${this.firstName} ${this.lastName}`
  }

  get profileURL(): string {
    return `${VITE_USER_SSR_URL}/${this.urlHandle}`
  }

  private _handleCopyLinkClick() {
    navigator.clipboard.writeText(this.profileURL)
    notify('Link copied to clipboard', 'success')
  }

  render() {
    return html`
      <sl-card class="container">
        <cover-picture
          class="flex aic jcc"
          slot="image"
          image="${ifDefined(
            this.coverPicture === null ? undefined : this.coverPicture
          )}"
        >
          <sl-tooltip content="Upload cover picture">
            <sl-button href="/account">
              <sl-icon name="upload" slot="suffix"></sl-icon>
            </sl-button>
          </sl-tooltip>
        </cover-picture>
        <header slot="header" id="header" class="container container--lg">
          <div class="flex aic jcsb">
            <avatar-component
              image="${ifDefined(
                this.profilePicture === null ? undefined : this.profilePicture
              )}"
              size="120px"
            ></avatar-component>
            <div id="actions" class="flex aic jcc gap05">
              <sl-tooltip content="Preview my profile page">
                <sl-button
                  href=${this.profileURL}
                  target="_blank"
                  rel="noopener"
                  circle
                >
                  <sl-icon name="arrow-up-right"></sl-icon>
                </sl-button>
              </sl-tooltip>
              <sl-tooltip content="Copy link to my profile page">
                <sl-button @click=${this._handleCopyLinkClick} circle>
                  <sl-icon name="clipboard"></sl-icon>
                </sl-button>
              </sl-tooltip>
              <sl-tooltip content="Edit my info">
                <sl-button href="/account" circle>
                  <sl-icon name="pencil"></sl-icon>
                </sl-button>
              </sl-tooltip>
              <sl-button variant="primary" href="/account" pill>
                Invite friends
              </sl-button>
            </div>
          </div>
          <h1 class="flex gap05">${this.fullName}</h1>
        </header>
        <nav id="nav">
          <sl-button
            href="/profile"
            variant="text"
            class=${classMap({ active: this.page === 'blocks' })}
          >
            Blocks
          </sl-button>
          <sl-button
            href="/profile/links"
            variant="text"
            class=${classMap({ active: this.page === 'links' })}
          >
            Links
          </sl-button>
          <sl-button
            href="/profile/rcmds"
            variant="text"
            class=${classMap({ active: this.page === 'rcmds' })}
          >
            RCMDs
          </sl-button>
        </nav>
        <sl-divider></sl-divider>
        <slot></slot>
      </sl-card>
    `
  }

  static styles = [
    container,
    sizing,
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
