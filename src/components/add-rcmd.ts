import { LitElement, html, css } from 'lit'
import { customElement, state, query } from 'lit/decorators.js'
import { form } from '../styles/form.js'
import { flex } from '../styles/flex.js'
import { spacing } from '../styles/spacing.js'
import { sizing } from '../styles/sizing.js'
import notify from '../utils/notify.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'

@customElement('add-rcmd')
export class AddRcmd extends LitElement {
  @state() protected loading: boolean = false
  @state() private stagedPicture: string | null = null
  @state() private stagedLocationType: string = ''
  @state() private stagedTags: string[] = []

  @query('form') private form!: HTMLFormElement
  @query('sl-dialog') private dialog!: any

  constructor() {
    super()
    this._closeForm = this._closeForm.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('close-add-rcmd-form', this._closeForm)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('close-add-rcmd-form', this._closeForm)
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
      new CustomEvent('rcmd-submitted', { detail: data, bubbles: true })
    )
  }

  private _handleChangePicture() {}

  private _removeTag(event: Event) {
    console.log(event)
  }

  private _handleAddTag(event: Event) {
    console.log(event)
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
        Add RCMD
        <sl-icon name="plus" slot="suffix"></sl-icon>
      </sl-button>
      <sl-dialog label="Add RCMD">
        <form
          @submit=${this._handleSubmit}
          method="post"
          style="margin-top: 1em;"
        >
          <fieldset class="mb1">
            <img src=${this.stagedPicture || ''} width="100%" />
            <input
              type="file"
              @change=${this._handleChangePicture}
              id="picture-input"
              name="file"
              required
              aria-label="Picture"
              aria-describedby="picture-desc"
            />
            <div id="picture-desc" class="form-desc">
              Upload an image for your RCMD
            </div>
          </fieldset>
          <div class="mb1">
            <input type="text" name="title" required placeholder="Title" />
          </div>
          <div class="mb1">
            <input
              type="text"
              name="description"
              required
              placeholder="Description"
            />
          </div>
          <div class="mb1">
            <label for="location-type">Location type:</label>
            <custom-dropdown
              required
              name="location-type"
              .options=${['Online', 'Retail', 'Other']}
              .selectedValue=${this.stagedLocationType}
              @selected-changed=${(event: CustomEvent) => {
                this.stagedLocationType = event.detail
              }}
            ></custom-dropdown>
          </div>
          <div class="mb1">
            <textarea
              type="text"
              name="address"
              placeholder="Address (optional)"
            ></textarea>
          </div>
          <div class="mb1">
            <label for="tags-input">Tags (optional):</label>
            <tag-list
              .tags=${this.stagedTags}
              @remove-tag=${(event: CustomEvent) =>
                this._removeTag(event.detail)}
            ></tag-list>
            <tag-input
              name="tags-input"
              @add-tag=${(event: CustomEvent) =>
                this._handleAddTag(event.detail)}
            ></tag-input>
          </div>
          <div class="mb1">
            <input
              type="text"
              name="url"
              required
              pattern="(http[s]?://)?.+"
              placeholder="URL"
            />
            <div id="cover-picture-desc" class="form-desc">
              This is where your recommendation links to. This can be an
              affiliate URL.
            </div>
          </div>
          <div class="mb1">
            <input
              type="text"
              name="discount-code"
              placeholder="Discount code (optional)"
            />
          </div>
          <div class="mb1">
            <input
              type="text"
              name="video"
              disabled
              placeholder="Video (Coming soon)"
            />
          </div>
          <sl-button
            type="submit"
            variant="primary"
            name="plus"
            label="add rcmd"
            ?loading=${this.loading}
          >
            Add
          </sl-button>
        </form>
      </sl-dialog>
    `
  }
}
