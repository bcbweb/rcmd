import { LitElement, html, css } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { button } from '../styles/button.js'
import { form } from '../styles/form.js'
import { flex } from '../styles/flex.js'
import { icon } from '../styles/icon.js'
import { spacing } from '../styles/spacing.js'
import { validateForm } from '../utils/form.js'
import notify from '../utils/notify.js'
import '../components/tag-list.js'
import '../components/tag-input.js'

@customElement('add-rcmd')
export class AddRcmd extends LitElement {
  @property({ type: Boolean }) isFormVisible = false

  @state()
  protected loading: boolean = false
  @state()
  private stagedPicture: string | null = null
  @state()
  private stagedLocationType: string = ''
  @state()
  private stagedTags: string[] = []

  @query('#picture-input')
  private pictureInput!: HTMLInputElement

  constructor() {
    super()
    this._closeForm = this._closeForm.bind(this)
    this._handleChangePicture = this._handleChangePicture.bind(this)
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
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const locationType = this.stagedLocationType
    const address = formData.get('address') as string
    const tags = this.stagedTags
    const url = formData.get('url') as string
    const discountCode = formData.get('discount-code') as string
    const video = formData.get('video') as string
    if (!form || !validateForm(form)) {
      notify('Please fill all required fields', 'neutral')
      return
    }
    this.loading = true
    const rcmd = {
      image,
      title,
      description,
      locationType,
      address,
      tags,
      url,
      discountCode,
      video,
    }
    this.dispatchEvent(
      new CustomEvent('rcmd-submitted', { detail: rcmd, bubbles: true })
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

  private _handleAddTag(newTag: string) {
    this.stagedTags = [...this.stagedTags, newTag]
  }

  private _removeTag(index: number) {
    this.stagedTags = [
      ...this.stagedTags.slice(0, index),
      ...this.stagedTags.slice(index + 1),
    ]
  }

  // TODO: Use presigned URL for upload
  render() {
    return html`
      <sl-button
        variant="primary"
        @click=${this._handleAddClick}
        ?hidden=${this.isFormVisible}
      >
        Add RCMD
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
            @remove-tag=${(event: CustomEvent) => this._removeTag(event.detail)}
          ></tag-list>
          <tag-input
            name="tags-input"
            @add-tag=${(event: CustomEvent) => this._handleAddTag(event.detail)}
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
            This is where your recommendation links to. This can be an affiliate
            URL.
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
        <button
          type="submit"
          class="button button--primary ${this.loading ? 'loading' : ''}"
          aria-label="add RCMD"
        >
          Add RCMD
        </button>
      </form>
    `
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
      .tag-list .remove {
        background: none;
        border: none;
        padding: 0;
        width: 15px;
        height: 15px;
      }
    `,
  ]
}
