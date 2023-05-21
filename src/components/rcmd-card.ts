import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { button } from '../styles/button.js'
import { flex } from '../styles/flex.js'
import { icon } from '../styles/icon.js'
import { lists } from '../styles/lists.js'
import { deleteRcmd } from '../services/rcmd.js'
import { formatTimestamp } from '../utils/general.js'
import editIcon from '../icons/edit.js'
import externalLinkIcon from '../icons/external-link.js'
import shareIcon from '../icons/share.js'
import './share-modal.js'

const RCMD_SSR_URL = (import.meta as any).env.RCMD_SSR_URL

@customElement('rcmd-card')
export class RcmdCard extends LitElement {
  @property()
  rcmd: Rcmd = {
    owner: '',
    image: '',
    title: '',
    description: '',
    locationType: '',
    address: '',
    tags: [],
    url: '',
    discountCode: '',
    video: '',
    created: '',
    updated: '',
    visibility: '',
  }

  @state()
  protected editing: boolean = false
  @state()
  protected deleting: boolean = false
  @state()
  protected showingShareModal: boolean = false

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('close-share-modal', this._closeShareModalListener)
  }

  get computedLink(): string {
    return `${RCMD_SSR_URL}/${this.rcmd.id}`
  }

  get computedExternalLink(): string {
    return `https://${this.rcmd.url
      .replace('https://', '')
      .replace('http://', '')}`
  }

  get formattedDate(): string {
    return formatTimestamp(this.rcmd.created)
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
      <share-modal
        link=${this.computedLink}
        external-url=${this.computedExternalLink}
        media=${this.rcmd.image}
        description=${this.rcmd.description}
        ?is-open=${this.showingShareModal}
      ></share-modal>
      <div
        id="rcmd-card"
        class="flex fdc gap1"
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
              <sl-button
                variant="text"
                label="Delete"
                @click=${this._delete}
                ?loading=${this.deleting}
              >
                <sl-icon name="trash"></sl-icon>
              </sl-button>
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
        <time>${this.formattedDate}</time>
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
        <sl-button variant="text" href="/rcmd/${this.rcmd.id}">
          View more
        </sl-button>
      </div>
    `
  }

  static styles = [
    button,
    flex,
    lists,
    icon,
    css`
      :host {
        position: relative;
        width: 100%;
      }
      h1 {
        margin: 0;
      }
      #rcmd-card {
        width: 100%;
        border: var(--border, none);
      }
      #rcmd-card img {
        object-position: center center;
        object-fit: cover;
        width: 100%;
      }
      #actions {
        position: absolute;
        top: 0;
        right: 0;
      }
    `,
  ]
}
