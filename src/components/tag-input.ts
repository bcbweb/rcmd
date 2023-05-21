import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('tag-input')
export class TagInput extends LitElement {
  @property({ type: String })
  inputValue = ''

  handleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (this.inputValue !== '') {
        const newTag = this.inputValue.trim()
        this.dispatchEvent(new CustomEvent('add-tag', { detail: newTag }))
        this.inputValue = ''
      }
    }
  }

  handleInputChange(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value
  }

  static styles = [
    css`
      div {
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
    `,
  ]

  render() {
    return html`
      <div>
        <sl-input
          type="text"
          .value=${this.inputValue}
          @keydown=${this.handleInputKeydown}
          @input=${this.handleInputChange}
          help-text="Press enter to add"
        >
          <sl-icon name="plus" slot="suffix"></sl-icon>
        </sl-input>
      </div>
    `
  }
}
