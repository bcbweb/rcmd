import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { button } from '../styles/button.js'
import { flex } from '../styles/flex.js'
import { lists } from '../styles/lists.js'

@customElement('profile-block-component')
export class ProfileBlockComponent extends LitElement {
  @property()
  index: number | null = null
  @property()
  block: ProfileBlock | null = null

  @state()
  protected editing: boolean = false
  @state()
  protected deleting: boolean = false

  connectedCallback() {
    super.connectedCallback()
  }

  private async _delete() {
    if (!this.block) return
    this.deleting = true
    this.dispatchEvent(
      new CustomEvent('delete', {
        detail: this.index,
        bubbles: true,
        composed: true,
      })
    )
  }

  private async _edit() {
    this.editing = true
  }

  render() {
    return html`
      <div
        id="block"
        class="flex fdc"
        ?hidden=${this.block?.visibility === 'private'}
      >
        <div id="actions">
          <ul class="unstyled flex">
            <li>
              <sl-icon-button
                name="pencil"
                label="edit"
                @click=${this._edit}
              ></sl-icon-button>
            </li>
            <li>
              <sl-icon-button
                name="trash"
                label="delete"
                @click=${this._delete}
                loading=${this.deleting}
              >
              </sl-icon-button>
            </li>
          </ul>
        </div>
        <p>${this.block?.content}</p>
      </div>
    `
  }

  static styles = [
    button,
    flex,
    lists,
    css`
      :host {
        position: relative;
        width: 100%;
      }
      h1 {
        margin-top: 0;
      }
      #block {
        width: 100%;
        border: var(--border, none);
      }
      #block img {
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
