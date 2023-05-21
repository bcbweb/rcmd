import { LitElement, html, css } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { grid } from '../styles/grid.js'
import { lists } from '../styles/lists.js'

@customElement('card-grid')
export class CardGrid extends LitElement {
  @property({ type: Boolean })
  loading = false
  @property({ type: String })
  title = ''

  @query('#items')
  items: HTMLUListElement

  connectedCallback() {
    super.connectedCallback()
  }

  get cardCount(): number {
    const slots = this.items?.querySelector('slot')
    if (!slots) return 0
    return slots[0]?.assignedNodes().length
  }

  get gridClass(): string {
    if (this.cardCount == 1 || this.cardCount.length == 2) {
      return 'grid--1-2'
    } else if (this.cardCount.length == 3) {
      return 'grid--3'
    } else {
      return 'grid--4-plus'
    }
  }

  render() {
    return html`
      ${this.title ? html`<h2>${this.title}</h2>` : ''}
      <div id="items" class="grid grid--gap-lg ${this.gridClass}"></ul>
        <slot name="card"></slot>
      </div>
    `
  }

  static styles = [
    grid,
    lists,
    css`
      :host {
        position: relative;
        width: 100%;
      }
      h2 {
        margin-top: 0;
      }
    `,
  ]
}
