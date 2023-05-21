import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../components/cover-picture.js'
import '../components/avatar-component.js'
import { container } from '../styles/container.js'
import { sizing } from '../styles/sizing.js'
import { flex } from '../styles/flex.js'
import { PageElement } from '../helpers/page-element.js'
import { classMap } from 'lit/directives/class-map.js'
import { ProfileStateWrapper } from '../helpers/profile-state-wrapper.js'

@customElement('layout-profile')
export class LayoutProfile extends ProfileStateWrapper {
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
        <cover-picture
          slot="image"
          image="${this.coverPicture}"
        ></cover-picture>
        <header slot="header" id="header" class="container container--lg">
          <div class="flex aic jcsb">
            <avatar-component
              image="${this.profilePicture}"
              size="120px"
            ></avatar-component>
            <div id="actions" class="flex aic jcc gap05">
              <sl-button
                href=${this.profileUrl}
                target="_blank"
                rel="noopener"
                circle
              >
                <sl-icon name="link-45deg"></sl-icon>
              </sl-button>
              <sl-button href="/profile/info" circle>
                <sl-icon name="pencil"></sl-icon>
              </sl-button>
              <sl-button variant="primary" href="/profile/info" pill>
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
