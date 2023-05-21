import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { icon } from '../styles/icon.js'
import { flex } from '../styles/flex.js'
import { shareLink } from '../utils/general.js'
import notify from '../utils/notify.js'
import twitterIcon from '../icons/twitter.js'
import facebookIcon from '../icons/facebook.js'
import linkedInIcon from '../icons/linkedin.js'
import whatsAppIcon from '../icons/whatsapp.js'
import messengerIcon from '../icons/messenger.js'
import telegramIcon from '../icons/telegram.js'
import pinterestIcon from '../icons/pinterest.js'

@customElement('share-modal')
export class ShareModal extends LitElement {
  @property({ type: String })
  link = ''
  @property({ type: String })
  externalLink = ''
  @property({ type: String })
  media = ''
  @property({ type: String })
  description = ''
  @property({ type: Boolean, attribute: 'is-open' })
  isOpen = false

  private _handleClose() {
    this.dispatchEvent(
      new CustomEvent('close-share-modal', { bubbles: true, composed: true })
    )
  }

  private _handleCopy() {
    navigator.clipboard
      .writeText(this.link)
      .then(() => {
        notify('Link copied to clipboard', 'success')
      })
      .catch((error) => {
        notify('Failed to copy link to clipboard', 'warning')
        console.error(error)
      })
  }

  private _handleInputClick(event: Event) {
    const input = event.target as HTMLInputElement
    input.select()
  }
  render() {
    if (!this.isOpen) return html``
    return html`
      <div id="share-modal" class="flex fdc">
        <sl-icon-button
          name="x"
          label="close"
          @click=${this._handleClose}
        ></sl-icon-button>
        <h1>Share</h1>
        <div id="platforms" class="flex fdr">
          <button
            class="share-button"
            @click=${() => shareLink('twitter', this.link)}
            aria-label="Share on Twitter"
          >
            <div class="icon icon--md">${twitterIcon}</div>
          </button>
          <button
            class="share-button"
            @click=${() => shareLink('facebook', this.link)}
            aria-label="Share on Facebook"
          >
            <div class="icon icon--md">${facebookIcon}</div>
          </button>
          <button
            class="share-button"
            @click=${() => shareLink('linkedin', this.link)}
            aria-label="Share on LinkedIn"
          >
            <div class="icon icon--md">${linkedInIcon}</div>
          </button>
          <button
            class="share-button"
            @click=${() => shareLink('whatsapp', this.link)}
            aria-label="Share on WhatsApp"
          >
            <div class="icon icon--md">${whatsAppIcon}</div>
          </button>
          <button
            class="share-button"
            @click=${() => shareLink('messenger', this.link, this.externalLink)}
            aria-label="Share on Messenger"
          >
            <div class="icon icon--md">${messengerIcon}</div>
          </button>
          <button
            class="share-button"
            @click=${() => shareLink('telegram', this.link)}
            aria-label="Share on Telegram"
          >
            <div class="icon icon--md">${telegramIcon}</div>
          </button>
          <button
            class="share-button"
            @click=${() =>
              shareLink(
                'pinterest',
                this.link,
                this.externalLink,
                this.media,
                this.description
              )}
            aria-label="Share on Pinterest"
          >
            <div class="icon icon--md">${pinterestIcon}</div>
          </button>
        </div>
        <div class="copy flex">
          <input
            type="text"
            .value=${this.link}
            @click=${this._handleInputClick}
            readonly
          />
          <sl-icon-button
            name="clipboard"
            label="copy"
            @click=${this._handleCopy}
          ></sl-icon-button>
        </div>
      </div>
    `
  }

  static styles = [
    icon,
    flex,
    css`
      :host {
        display: block;
        position: absolute;
        top: 50px;
        right: 0;
        z-index: 1;
      }
      #share-modal {
        background-color: #f0f0f0;
        border-radius: 10px;
        border: 1px solid #ccc;
        gap: 10px;
        padding: 10px;
      }
      h1 {
        font-size: 15px;
        margin: 0;
      }
      #platforms {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      input {
        font-size: 1rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        flex-grow: 1;
      }
      .share-button {
        background-color: transparent;
        border: none;
        color: black;
        cursor: pointer;
        padding: 0;
      }
      .close {
        background: transparent;
        color: black;
        padding: 0;
        position: absolute;
        right: 10px;
      }
    `,
  ]
}
