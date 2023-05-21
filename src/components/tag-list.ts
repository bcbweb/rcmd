import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('tag-list')
export class TagList extends LitElement {
  @property({ type: Array })
  tags = []
  @property({ type: String, attribute: 'empty-message' })
  emptyMessage = 'No tags added'

  connectedCallback() {
    super.connectedCallback()
  }

  private _handleRemove(index: number) {
    this.dispatchEvent(
      new CustomEvent('remove-tag', { detail: index, bubbles: true })
    )
  }

  render() {
    if (this.tags.length === 0) {
      return html`<p id="empty-message">${this.emptyMessage}</p>`
    }
    return html`
      <ul id="list">
        ${this.tags.map(
          (tag, index) => html`<li>
            <sl-tag removable @sl-remove=${() => this._handleRemove(index)}>
              ${tag}
            </sl-tag>
          </li>`
        )}
      </ul>
    `
  }

  static styles = [
    css`
      #list {
        list-style: none;
        margin: 20px 0;
        padding: 0;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      #empty-message {
        font-size: 0.9rem;
        color: var(--sl-color-gray-500);
        font-style: italic;
      }
    `,
  ]
}
