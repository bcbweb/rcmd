import { LitElement, css, html } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { openSearchDrawer } from '../utils/general.js'
import '../components/account-menu.js'

@customElement('site-header')
export class SiteHeader extends LitElement {
  @property({ type: String }) title = 'RCMD'
  @property({ type: String }) page = ''

  @property({ type: Boolean }) enableBack: boolean = false

  static get styles() {
    return css`
      header {
        box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        color: black;
        height: 4em;
        padding: 0 16px;
        position: fixed;
        left: env(titlebar-area-x, 0);
        top: env(titlebar-area-y, 0);
        height: env(titlebar-area-height, 50px);
        width: env(titlebar-area-width, 100%);
        z-index: 99;
        -webkit-app-region: drag;
      }
      #logo h1 {
        color: var(--sl-color-primary-500);
        margin-top: 0;
        margin-bottom: 0;
        font-size: 20px;
        font-weight: bold;
      }
      #main-nav {
        display: flex;
      }
      #site-actions {
        align-items: center;
        display: flex;
        gap: 10px;
      }
      sl-button::part(base) {
        color: var(--sl-color-gray-500);
      }
      sl-button.active::part(base) {
        color: var(--sl-color-primary-500);
      }
    `
  }

  constructor() {
    super()
  }

  render() {
    return html`
      <header>
        <nav id="main-nav">
          ${this.enableBack
            ? html`<sl-button href="${(import.meta as any).env.BASE_URL}">
                Back
              </sl-button>`
            : null}

          <sl-button
            href="/"
            variant="text"
            id="logo"
            class=${classMap({ active: this.page === '' })}
          >
            <h1>${this.title}</h1>
          </sl-button>
          <sl-dropdown>
            <sl-button variant="text" slot="trigger" caret>About</sl-button>
            <sl-menu>
              <sl-menu-item disabled>
                For individuals
                <sl-badge variant="neutral">Coming soon</sl-badge></sl-menu-item
              >
              <sl-menu-item disabled>
                For content creators
                <sl-badge variant="neutral">Coming soon</sl-badge>
              </sl-menu-item>
              <sl-menu-item disabled>
                For businesses
                <sl-badge variant="neutral">Coming soon</sl-badge>
              </sl-menu-item>
            </sl-menu>
          </sl-dropdown>
          <sl-button
            href="/explore"
            variant="text"
            class=${classMap({ active: this.page === 'explore' })}
          >
            Explore
          </sl-button>
        </nav>

        <nav id="site-actions">
          <sl-icon-button
            name="search"
            @click=${() => openSearchDrawer()}
          ></sl-icon-button>
          <account-menu></account-menu>
        </nav>
      </header>
    `
  }
}
