import { LitElement, html, css } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { flex } from '../styles/flex.js'
import { spacing } from '../styles/spacing.js'
import { validateForm } from '../utils/form.js'
import notify from '../utils/notify.js'

@customElement('add-block')
export class AddBlock extends LitElement {
  @property({ type: Boolean }) isFormVisible = false

  @state()
  protected loading: boolean = false
  @state()
  private stagedPicture: string | null = null
  @state()
  private stagedVisibility: string = 'public'

  @query('#picture-input')
  private pictureInput!: HTMLInputElement

  constructor() {
    super()
    this._closeForm = this._closeForm.bind(this)
    this._handleChangePicture = this._handleChangePicture.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('close-add-block-form', this._closeForm)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('close-add-block-form', this._closeForm)
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
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const image = this.pictureInput.files?.[0]
    const content = formData.get('content') as string
    const visibility = formData.get('visibility') as string
    if (!form || !validateForm(form)) {
      notify('Please fill all required fields', 'warning')
      return
    }
    this.loading = true
    const block = {
      image,
      content,
      visibility,
    }
    this.dispatchEvent(
      new CustomEvent('block-submitted', { detail: block, bubbles: true })
    )
  }

  private _handleChangePicture() {
    const file = this.pictureInput.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      this.stagedPicture = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  static styles = [
    spacing,
    flex,
    css`
      form {
        position: relative;
      }
    `,
  ]

  // TODO: Use presigned URL for upload
  render() {
    return html`
      <sl-button
        variant="primary"
        @click=${this._handleAddClick}
        ?hidden=${this.isFormVisible}
      >
        Add block
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
        <fieldset class="mb1">
          <img src=${this.stagedPicture} width="100%" />
          <input
            type="file"
            @change=${this._handleChangePicture}
            id="picture-input"
            name="file"
            aria-label="Picture"
            aria-describedby="picture-desc"
          />
          <div id="picture-desc" class="form-desc">
            Upload an image for your profile block
          </div>
        </fieldset>
        <div class="mb1">
          <input type="text" name="content" required placeholder="Content" />
        </div>
        <div class="mb1">
          <label for="visibility">Visibility:</label>
          <custom-dropdown
            required
            name="visibility"
            .options=${['Public', 'Private']}
            .selectedValue=${this.stagedVisibility}
            @selected-changed=${(event: CustomEvent) => {
              this.stagedVisibility = event.detail
            }}
          ></custom-dropdown>
        </div>
        <button
          type="submit"
          class="button button--primary ${this.loading ? 'loading' : ''}"
          aria-label="add block"
        >
          Add block
        </button>
      </form>
    `
  }
}
