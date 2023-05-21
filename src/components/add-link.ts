import { LitElement, html, css } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { button } from '../styles/button.js'
import { form } from '../styles/form.js'
import { flex } from '../styles/flex.js'
import { icon } from '../styles/icon.js'
import { spacing } from '../styles/spacing.js'
import notify from '../utils/notify.js'
@customElement('add-link')
export class AddLink extends LitElement {
  @property({ type: Boolean }) isFormVisible = false

  @state()
  protected loading: boolean = false

  @query('form')
  private form!: HTMLFormElement

  private titleInputElement!: HTMLInputElement
  private linkInputElement!: HTMLInputElement

  constructor() {
    super()
    this._closeForm = this._closeForm.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('close-add-link-form', this._closeForm)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('close-add-link-form', this._closeForm)
  }

  private _closeForm() {
    this.isFormVisible = false
    this.loading = false
  }

  private _handleAddClick() {
    this.isFormVisible = true
  }

  private _handleCloseClick() {
    this._closeForm()
  }

  private _handleSubmit(event: Event) {
    event.preventDefault()
    if (!this.form) return
    const validity = this.form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    this.loading = true
    const link = {
      title: this.titleInputElement.value,
      url: this.linkInputElement.value,
    }
    this.dispatchEvent(
      new CustomEvent('link-submitted', { detail: link, bubbles: true })
    )
  }

  static styles = [
    button,
    icon,
    spacing,
    form,
    flex,
    css`
      form {
        position: relative;
      }
      .close-button {
        background-color: transparent;
        cursor: pointer;
        border: none;
        width: 30px;
        height: 30px;
      }
      button[type='submit'] {
        width: 100px;
      }
    `,
  ]

  render() {
    return html`
      <sl-button
        variant="primary"
        @click=${this._handleAddClick}
        ?hidden=${this.isFormVisible}
      >
        Add link
        <sl-icon name="plus" slot="suffix"></sl-icon>
      </sl-button>
      <form
        @submit=${this._handleSubmit}
        method="post"
        style="margin-top: 1em; display: ${this.isFormVisible
          ? 'block'
          : 'none'}"
        @keydown=${(e: KeyboardEvent) =>
          e.keyCode === 13 && this._handleSubmit(e)}
      >
        <sl-icon-button
          name="x"
          label="close"
          @click=${this._handleCloseClick}
        ></sl-icon-button>
        <input
          type="text"
          name="title"
          required
          placeholder="Title"
          @input=${(e: InputEvent) =>
            (this.titleInputElement = e.target as HTMLInputElement)}
        />
        <div class="flex mt1 gap1">
          <input
            type="text"
            name="link"
            required
            pattern="(http[s]?://)?.+"
            placeholder="URL"
            @input=${(e: InputEvent) =>
              (this.linkInputElement = e.target as HTMLInputElement)}
          />
          <sl-button
            type="submit"
            variant="primary"
            name="plus"
            label="add link"
            ?loading=${this.loading}
          >
            Add
          </sl-button>
        </div>
      </form>
    `
  }
}
