import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { form } from '../styles/form.js'

interface AutocompleteItem {
  value: string
  label: string
}

@customElement('autocomplete-component')
export class AutocompleteComponent extends LitElement {
  @property({ type: String }) label: string | null = null
  @property({ type: Array }) items: AutocompleteItem[] = []
  @property({ type: String }) value: string = ''
  @property({ type: Boolean }) open: boolean = false

  static styles = [
    form,
    css`
      :host {
        display: inline-block;
        position: relative;
      }

      ul {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 100;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        list-style-type: none;
        padding: 0;
        margin: 0;
        max-height: 200px;
        overflow-y: auto;
      }

      li {
        padding: 8px;
        cursor: pointer;
      }

      li:hover {
        background-color: #f0f0f0;
      }
    `,
  ]

  constructor() {
    super()
    this._handleOutsideClick = this._handleOutsideClick.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('click', this._handleOutsideClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._handleOutsideClick)
  }

  private _handleOutsideClick(event: Event) {
    if (!this.contains(event.target as Node)) {
      this.open = false
    }
  }

  private _handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement
    this.value = input.value
    this.open = true
  }

  private _handleItemClick(item: AutocompleteItem) {
    this.value = item.value
    this.open = false
  }

  render() {
    return html`
      <sl-input
        label=${this.label}
        type="text"
        @input=${this._handleInputChange}
        .value=${this.value}
      ></sl-input>
      ${this.open
        ? html`
            <ul>
              ${this.items
                .filter((item) =>
                  item.value.toLowerCase().includes(this.value.toLowerCase())
                )
                .map(
                  (item) =>
                    html`
                      <li @click=${() => this._handleItemClick(item)}>
                        ${item.label}
                      </li>
                    `
                )}
            </ul>
          `
        : ''}
    `
  }
}
