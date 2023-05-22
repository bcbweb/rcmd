import { LitElement, html, css } from 'lit'
import { customElement, state, query } from 'lit/decorators.js'
import { form } from '../styles/form.js'
import { flex } from '../styles/flex.js'
import { spacing } from '../styles/spacing.js'
import { sizing } from '../styles/sizing.js'
import notify from '../utils/notify.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'

@customElement('add-link')
export class AddLink extends LitElement {
  @state()
  protected loading: boolean = false
  @query('form')
  private form!: HTMLFormElement
  @query('sl-dialog')
  private dialog!: any

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
    this.dialog.hide()
    this.loading = false
  }

  private _handleAddClick() {
    this.dialog.show()
  }

  private _handleSubmit(event: Event) {
    event.preventDefault()
    if (!this.form) return
    const validity = this.form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(event.target as HTMLFormElement)
    this.loading = true
    this.dispatchEvent(
      new CustomEvent('link-submitted', { detail: data, bubbles: true })
    )
  }

  static styles = [
    sizing,
    spacing,
    form,
    flex,
    css`
      :host {
        display: flex;
        flex-direction: column;
      }
      form {
        position: relative;
      }
      .add-button {
        align-self: center;
      }
    `,
  ]

  render() {
    return html`
      <sl-button
        variant="primary"
        @click=${this._handleAddClick}
        pill
        class="add-button w40"
      >
        Add link
        <sl-icon name="plus" slot="suffix"></sl-icon>
      </sl-button>
      <sl-dialog label="Add link">
        <form
          @submit=${this._handleSubmit}
          method="post"
          style="margin-top: 1em;"
        >
          <sl-input
            name="title"
            required
            placeholder="Title"
            help-text="Enter a descriptive title for your link."
          ></sl-input>
          <div class="flex mt1 gap1">
            <sl-input
              type="text"
              name="link"
              required
              pattern="(http[s]?://)?.+"
              placeholder="URL"
            ></sl-input>
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
      </sl-dialog>
    `
  }
}
