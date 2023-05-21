import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { flex } from '../styles/flex.js'
import { icon } from '../styles/icon.js'
import { button } from '../styles/button.js'
import { lists } from '../styles/lists.js'
import { container } from '../styles/container.js'
import { spacing } from '../styles/spacing.js'
import { ProtectedPage } from '../helpers/protected-page.js'
import { Router, BeforeEnterObserver, RouterLocation } from '@vaadin/router'
import { deleteRcmd } from '../utils/rcmd.js'
import editIcon from '../icons/edit.js'
import trashIcon from '../icons/trash.js'
import externalLinkIcon from '../icons/external-link.js'
import shareIcon from '../icons/share.js'
import '../components/share-modal.js'

const RCMD_SSR_URL = (import.meta as any).env.RCMD_SSR_URL

@customElement('page-rcmd-full')
export class PageRcmdFull extends ProtectedPage implements BeforeEnterObserver {
  @state()
  protected loading: boolean = false
  @state()
  protected rcmdId?: string
  @state()
  protected editing: boolean = false
  @state()
  protected deleting: boolean = false
  @state()
  protected showingShareModal: boolean = false

  onBeforeEnter(location: RouterLocation) {
    this.rcmdId = location.params.id as string
  }

  get rcmd(): Rcmd {
    return this.rcmds?.find((rcmd) => rcmd.id === this.rcmdId)!
  }

  get computedLink(): string {
    return `${RCMD_SSR_URL}/${this.rcmd.id}`
  }

  get computedExternalLink(): string {
    return `https://${this.rcmd.url
      .replace('https://', '')
      .replace('http://', '')}`
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('close-share-modal', this._closeShareModalListener)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  private async _delete() {
    if (!this.rcmd || !this.rcmd.id) return
    this.deleting = true
    try {
      await deleteRcmd(this.rcmd.owner, this.rcmd.id)
      this.dispatchEvent(new CustomEvent('deleted', { detail: this.rcmd }))
    } catch (error) {
      console.error(error)
    }
    this.deleting = false
  }

  private async _edit() {
    this.editing = true
  }

  private _handleShareClick(event: Event) {
    event.preventDefault()
    this._toggleShareModal(true)
  }

  private _toggleShareModal(visibility: boolean) {
    this.showingShareModal = visibility
  }

  private _closeShareModalListener() {
    this._toggleShareModal(false)
  }

  render() {
    return html`
      <div class="container">
        <a
          href="javascript:void(0)"
          class="button mb1 mt1"
          @click=${(event: Event) => {
            event.preventDefault()
            Router.go('/profile/rcmds')
          }}
          >← Back to RCMD list</a
        >
        <share-modal
          link=${this.computedLink}
          external-url=${this.computedExternalLink}
          media=${this.rcmd.image}
          description=${this.rcmd.description}
          ?is-open=${this.showingShareModal}
        ></share-modal>
        <div
          id="rcmd-view"
          class="flex fdc mt1 mb1"
          ?hidden=${this.rcmd.visibility === 'private'}
        >
          <div id="actions">
            <ul class="unstyled flex">
              <li>
                <button
                  type="button"
                  class="button button--action"
                  aria-label="Edit"
                  @click=${this._edit}
                >
                  <span class="icon icon--sm">${editIcon}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="button button--action ${this.deleting
                    ? 'loading'
                    : ''}"
                  aria-label="Delete"
                  @click=${this._delete}
                >
                  <span class="icon icon--sm">${trashIcon}</span>
                </button>
              </li>
              <li>
                <a
                  href=${this.computedExternalLink}
                  class="button button--action"
                  aria-label="Open link"
                >
                  <span class="icon icon--sm">${externalLinkIcon}</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  class="button button--action"
                  aria-label="Share"
                  @click=${this._handleShareClick}
                >
                  <span class="icon icon--sm">${shareIcon}</span>
                </button>
              </li>
            </ul>
          </div>
          <h1>${this.rcmd.title}</h1>
          <time>${this.rcmd.created}</time>
          <img src=${this.rcmd.image} alt=${this.rcmd.title} />
          <p>${this.rcmd.description}</p>
          <span>${this.rcmd.locationType}</span>
          <p>${this.rcmd.address}</p>
          ${this.rcmd.tags?.length &&
          html`<ul>
            ${this.rcmd.tags.map((tag) => html`<li>${tag}</li>`)}
          </ul>`}
          <span>${this.rcmd.url}</span>
          <span>${this.rcmd.discountCode}</span>
          <span>${this.rcmd.video}</span>
        </div>
      </div>
    `
  }

  static styles = [
    button,
    flex,
    lists,
    icon,
    container,
    spacing,
    css`
      :host {
        width: 100%;
      }
      h1 {
        margin-top: 0;
      }
      #rcmd-view {
        border: var(--border, none);
        position: relative;
        width: 100%;
      }
      #rcmd-view img {
        object-position: center center;
        object-fit: cover;
      }
      #actions {
        position: absolute;
        top: 0;
        right: 0;
      }
    `,
  ]

  meta() {
    return {
      title: this.rcmd.title,
      description: 'RCMD full view page',
    }
  }
}
