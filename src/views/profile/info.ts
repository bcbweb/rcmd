import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { flex } from '../../styles/flex.js'
import { button } from '../../styles/button.js'
import { form } from '../../styles/form.js'
import { updateUserMeta, uploadUserPicture } from '../../services/user.js'
import '../../components/tag-input.js'
import '../../components/cover-picture.js'
import '../../components/autocomplete-component.js'
import { locales, timeZones } from '../../utils/i18n.js'
import { ProtectedPage } from '../../helpers/protected-page.js'
import { validateForm } from '../../utils/form.js'
import { ProfileStateWrapper } from '../../helpers/profile-state-wrapper.js'

@customElement('page-profile-edit')
export class PageProfileEdit extends ProfileStateWrapper {
  @state()
  protected loading: boolean = false
  @state()
  protected stagedCoverPicture: string | null = ''
  @state()
  protected stagedProfilePicture: string | null = ''
  @state()
  private stagedGender: string = ''
  @state()
  private stagedLocale: string = 'en-US'
  @state()
  private stagedTimeZone: string = 'Europe/London'
  @state()
  private stagedInterests: string[] = []
  @state()
  private stagedTags: string[] = []

  connectedCallback() {
    super.connectedCallback()
    this.stagedCoverPicture = this.coverPicture
    this.stagedProfilePicture = this.profilePicture
    this.stagedInterests = this.interests || []
    this.stagedTags = this.tags || []
  }

  private _handleChangePicture(event: Event) {
    const element = event.target as HTMLInputElement
    const file = element.files?.[0]
    const pictureType = element.dataset.pictureType
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (pictureType === 'cover') {
        this.stagedCoverPicture = result
      } else if (pictureType === 'profile') {
        this.stagedProfilePicture = result
      }
    }
    reader.readAsDataURL(file)
  }

  async _uploadPicture(event: Event) {
    event.preventDefault()
    if (!this.email) return
    this.loading = true
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const pictureFile = formData.get('file') as File
    const metaKey = form.dataset.metaKey as string
    const result = await uploadUserPicture(pictureFile)
    if (result) {
      const updateMetaResult = await updateUserMeta({
        email: this.email,
        [metaKey]: result,
      })
      if (updateMetaResult) {
        const updateEvent = new CustomEvent('user-meta-update', {
          bubbles: true,
          composed: true,
        })
        this.dispatchEvent(updateEvent)
      }
    }
    this.loading = false
  }

  async _updateMeta(event: Event) {
    event.preventDefault()
    if (!this.email) return
    const form = event.target as HTMLFormElement
    if (!validateForm(form)) return
    const formData = new FormData(form)
    const userMeta: UserMeta = {
      email: this.email,
      urlHandle: formData.get('url-handle') as string, // todo: ensure available
      firstName: formData.get('first-name') as string,
      lastName: formData.get('last-name') as string,
      dateOfBirth: formData.get('date-of-birth') as string,
      gender: this.stagedGender,
      locale: formData.get('locale') as string,
      timeZone: formData.get('time-zone') as string,
      interests: this.stagedInterests,
      tags: this.stagedTags,
    }
    const result = await updateUserMeta(userMeta)
    if (result) {
      const updateEvent = new CustomEvent('user-meta-update', {
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(updateEvent)
    }
  }

  private _handleAddInterest(newInterest: string) {
    this.stagedInterests = [...this.stagedInterests, newInterest]
  }

  private _handleAddTag(newTag: string) {
    this.stagedTags = [...this.stagedTags, newTag]
  }

  private _removeInterest(index: number) {
    this.stagedInterests = [
      ...this.stagedInterests.slice(0, index),
      ...this.stagedInterests.slice(index + 1),
    ]
  }

  private _removeTag(index: number) {
    this.stagedTags = [
      ...this.stagedTags.slice(0, index),
      ...this.stagedTags.slice(index + 1),
    ]
  }

  private _handleLocaleChange(event: CustomEvent) {
    this.stagedLocale = event.detail.value
  }

  private _handleTimeZoneChange(event: CustomEvent) {
    this.stagedTimeZone = event.detail.value
  }

  static styles = [
    flex,
    button,
    form,
    css`
      section {
        padding: 1rem;
      }
      h1,
      h2 {
        text-align: center;
      }
      form {
        margin-bottom: 20px;
      }
      #profile-picture-form profile-picture {
        margin: auto;
      }
      #url-handle-fieldset span {
        line-height: 40px;
      }
      .tag-list .remove {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        width: 15px;
        height: 15px;
      }
    `,
  ]

  // TODO: Use presigned URL for upload
  render() {
    return html`
      <profile-nav></profile-nav>
      <header>
        <h1>Edit Profile</h1>
      </header>
      <section>
        <h2>Your pictures</h2>
        <form
          id="cover-picture-form"
          @submit=${this._uploadPicture}
          data-meta-key="coverPicture"
        >
          <fieldset>
            <cover-picture image="${this.stagedCoverPicture}"></cover-picture>
            <input
              type="file"
              @change=${this._handleChangePicture}
              data-picture-type="cover"
              id="cover-picture-input"
              name="file"
              required
              aria-label="Cover picture"
              aria-describedby="cover-picture-desc"
            />
            <div id="cover-picture-desc" class="form-desc">
              Please upload a cover picture.
            </div>
          </fieldset>
          <button
            type="submit"
            class="button ${this.loading ? 'loading' : ''}"
            ?disabled=${this.loading}
          >
            Upload cover picture
          </button>
        </form>
        <form
          id="profile-picture-form"
          @submit=${this._uploadPicture}
          data-meta-key="profilePicture"
        >
          <fieldset>
            <profile-picture
              size="100"
              image="${this.stagedProfilePicture}"
            ></profile-picture>
            <input
              type="file"
              @change=${this._handleChangePicture}
              data-picture-type="profile"
              id="profile-picture-input"
              name="file"
              required
              aria-label="Profile picture"
              aria-describedby="profile-picture-desc"
            />
            <div id="profile-picture-desc" class="form-desc">
              Please upload a profile picture.
            </div>
          </fieldset>
          <button
            type="submit"
            class="button ${this.loading ? 'loading' : ''}"
            ?disabled=${this.loading}
          >
            Upload profile picture
          </button>
        </form>
      </section>
      <section>
        <h2>Your info</h2>
        <form id="info-form" @submit=${this._updateMeta}>
          <label for="email-fieldset">Your email:</label>
          <fieldset>
            <input
              value="${this.email || ''}"
              type="text"
              id="email-input"
              aria-label="Email"
              disabled
            />
          </fieldset>
          <label for="url-handle-fieldset">URL handle:</label>
          <fieldset id="url-handle-fieldset">
            <div class="flex">
              <span>https://rcmd.world/user/</span>
              <input
                value="${this.urlHandle || ''}"
                type="text"
                id="url-handle-input"
                name="url-handle"
                aria-label="URL handle"
                aria-describedby="url-handle-desc"
              />
            </div>
            <div id="url-handle-desc" class="form-desc">
              Update the URL for your profile by chosing a handle.
            </div>
          </fieldset>

          <label for="name-fieldset">Your name</label>
          <fieldset class="flex" id="name-fieldset">
            <div id="name-fields">
              <input
                value="${this.firstName || ''}"
                type="text"
                id="first-name-input"
                name="first-name"
                required
                aria-label="First name"
                aria-describedby="first-name-desc"
              />
            </div>
            <div>
              <input
                value="${this.lastName || ''}"
                type="text"
                id="last-name-input"
                name="last-name"
                required
                aria-label="Last name"
                aria-describedby="last-name-desc"
              />
            </div>
          </fieldset>

          <label for="date-of-birth-fieldset">Date of birth (optional):</label>
          <fieldset id="interests-fieldset">
            <input
              value="${this.dateOfBirth || ''}"
              type="date"
              id="date-of-birth-input"
              name="date-of-birth"
              aria-label="Date of birth"
            />
          </fieldset>

          <label for="gender-fieldset">Gender (optional):</label>
          <fieldset id="gender-fieldset">
            <custom-dropdown
              .options=${['Male', 'Female', 'Other/prefer not to say']}
              .selectedValue=${this.stagedGender}
              @selected-changed=${(event: CustomEvent) => {
                this.stagedGender = event.detail
              }}
            ></custom-dropdown>
          </fieldset>

          <label for="locale-fieldset">Locale (optional):</label>
          <fieldset id="locale-fieldset">
            <autocomplete-component
              .items=${locales}
              .value=${this.stagedLocale}
              @change=${this._handleLocaleChange}
            ></autocomplete-component>
          </fieldset>

          <label for="time-zone-fieldset">Time zone (optional):</label>
          <fieldset id="time-zone-fieldset">
            <autocomplete-component
              .items=${timeZones}
              .value=${this.stagedTimeZone}
              @change=${this._handleTimeZoneChange}
            ></autocomplete-component>
          </fieldset>

          <label for="interests-fieldset">Interests (optional):</label>
          <fieldset id="interests-fieldset">
            <ul class="tag-list">
              ${this.stagedInterests.map(
                (interest, index) =>
                  html`<li>
                    <div class="flex aic">
                      ${interest}
                      <button
                        class="remove"
                        type="button"
                        @click=${() => this._removeInterest(index)}
                      ></button>
                    </div>
                  </li>`
              )}
            </ul>
            <tag-input
              name="interests-input"
              @add-tag=${(event: CustomEvent) =>
                this._handleAddInterest(event.detail)}
            ></tag-input>
            <div id="interests-desc" class="form-desc">Press enter to add.</div>
          </fieldset>

          <label for="tags-fieldset">Tags (optional):</label>
          <fieldset id="tags-fieldset">
            <ul class="tag-list">
              ${this.stagedTags.map(
                (tag, index) =>
                  html`<li>
                    <div class="flex aic">
                      ${tag}
                      <button
                        class="remove"
                        type="button"
                        @click=${() => this._removeTag(index)}
                      >
                        ${removeIcon}
                      </button>
                    </div>
                  </li>`
              )}
            </ul>
            <tag-input
              name="tags-input"
              @add-tag=${(event: CustomEvent) =>
                this._handleAddTag(event.detail)}
            ></tag-input>
            <div id="tags-desc" class="form-desc">Press enter to add.</div>
          </fieldset>

          <button
            type="submit"
            class="button ${this.loading ? 'loading' : ''}"
            ?disabled=${this.loading}
          >
            Save
          </button>
        </form>
      </section>
    `
  }

  meta() {
    return {
      title: 'Register',
      description: 'RCMD register page',
    }
  }
}
