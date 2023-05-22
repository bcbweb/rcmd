import { html, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import {
  uploadUserPicture,
  updateUserMeta,
  generateUniqueURLHandle,
} from '../../services/user.js'
import notify from '../../utils/notify.js'
import { sharedStyles } from '../../styles/shared-styles.js'
import { spacing } from '../../styles/spacing.js'
import { sizing } from '../../styles/sizing.js'
import { flex } from '../../styles/flex.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { locales, timeZones } from '../../utils/i18n.js'
import { ProfileStateWrapper } from '../../helpers/profile-state-wrapper.js'
import '../../components/avatar-component.js'
import '../../components/autocomplete-component.js'
import '../../components/tag-list.js'
import '../../components/tag-input.js'

@customElement('view-settings-account')
export class ViewSettingsAccount extends ProfileStateWrapper {
  @state() private loadingSaveProfilePicture: boolean = false
  @state() private loadingSaveCoverPicture: boolean = false
  @state() private loadingSaveInfo: boolean = false
  @state() private stagedProfilePicture: string | null = ''
  @state() private stagedCoverPicture: string | null = ''
  @state() private stagedLocale: string = 'en-US'
  @state() private stagedTimeZone: string = 'Europe/London'
  @state() private stagedInterests: string[] = []
  @state() private stagedTags: string[] = []

  get previewProfilePicture() {
    return this.stagedProfilePicture || this.profilePicture
  }

  get previewCoverPicture() {
    return this.stagedCoverPicture || this.coverPicture
  }

  connectedCallback() {
    super.connectedCallback()
    this.stagedInterests = this.interests || []
    this.stagedTags = this.tags || []
  }

  async _uploadPicture(event: Event) {
    event.preventDefault()
    if (!this.email) return
    const form = event.target as HTMLFormElement
    const metaKey = form.dataset.metaKey as string
    if (metaKey !== 'profilePicture' && metaKey !== 'coverPicture') return
    if (metaKey === 'profilePicture') {
      this.loadingSaveProfilePicture = true
    } else {
      this.loadingSaveCoverPicture = true
    }
    const data = serialize(form) as any
    const result = await uploadUserPicture(data.file as File)
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
        notify('Picture updated.', 'success', 'check-circle')
        this.dispatchEvent(updateEvent)
      }
    }
    if (metaKey === 'profilePicture') {
      this.loadingSaveProfilePicture = false
    } else {
      this.loadingSaveCoverPicture = false
    }
  }

  async _addUserMeta(event: Event) {
    event.preventDefault()
    if (!this.email) {
      notify('Email is not set', 'danger', 'exclamation-triangle')
      return
    }
    const form = event.target as HTMLFormElement
    const validity = form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(form)

    this.loadingSaveInfo = true
    const userMeta: UserMeta = {
      email: this.email,
      dateOfBirth: data.dateOfBirth as string,
      locale: this.stagedLocale,
      timeZone: this.stagedTimeZone,
      gender: data.gender as string,
      firstName: data.firstName as string,
      lastName: data.lastName as string,
      urlHandle: data.urlHandle as string,
      interests: this.stagedInterests,
      tags: this.stagedTags,
      roles: ['private'],
    }
    try {
      await updateUserMeta(userMeta)
      notify('Information updated.', 'success', 'check-circle')
    } catch (error) {
      console.error(error)
      notify(
        'An error occurred saving your information. Contact support if issues persist.',
        'danger',
        'exclamation-triangle'
      )
      return
    }
    this.loadingSaveInfo = false
  }

  private async _generateURLHandle(firstName: string, lastName: string) {
    return await generateUniqueURLHandle(firstName, lastName)
  }

  private _handleChangePicture(event: Event) {
    const element = event.target as HTMLInputElement
    const file = element.files?.[0]
    const pictureType = element.dataset.pictureType
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      console.log(pictureType)
      if (pictureType === 'cover') {
        this.stagedCoverPicture = result
      } else if (pictureType === 'profile') {
        this.stagedProfilePicture = result
      }
    }
    reader.readAsDataURL(file)
  }

  private _handleLocaleChange(event: CustomEvent) {
    this.stagedLocale = event.detail.value
  }

  private _handleTimeZoneChange(event: CustomEvent) {
    this.stagedTimeZone = event.detail.value
  }

  private _handleAddInterest(newInterest: string) {
    this.stagedInterests = [...this.stagedInterests, newInterest]
  }

  private _removeInterest(index: number) {
    this.stagedInterests = [
      ...this.stagedInterests.slice(0, index),
      ...this.stagedInterests.slice(index + 1),
    ]
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

  render() {
    return html`
      <sl-card class="container container--sm">
        <div slot="header">
          <h2>Account</h2>
        </div>
        <h3>Profile picture</h3>
        <form
          @submit=${this._uploadPicture}
          id="profilePictureForm"
          data-meta-key="profilePicture"
        >
          <avatar-component
            class="mb1"
            image=${ifDefined(
              this.previewProfilePicture === null
                ? undefined
                : this.previewProfilePicture
            )}
          ></avatar-component>
          <input
            type="file"
            accept="image/jpeg, image/png, image/gif, image/bmp, image/tiff, image/webp"
            @change=${this._handleChangePicture}
            data-picture-type="profile"
            name="file"
            help-text="Upload a profile picture"
            required
            aria-label="Profile picture"
            aria-describedby="profile-picture-desc"
          />
          <div id="profile-picture-desc" class="form-desc">
            Select a profile picture.
          </div>
          <sl-button
            type="submit"
            variant="primary"
            ?loading=${this.loadingSaveProfilePicture}
          >
            Upload & save
          </sl-button>
        </form>
        <sl-divider></sl-divider>
        <h3>Cover picture</h3>
        <form
          @submit=${this._uploadPicture}
          id="coverPictureForm"
          data-meta-key="coverPicture"
        >
          <cover-picture
            class="mb1"
            image=${ifDefined(
              this.previewCoverPicture === null
                ? undefined
                : this.previewCoverPicture
            )}
          ></cover-picture>
          <input
            type="file"
            accept="image/jpeg, image/png, image/gif, image/bmp, image/tiff, image/webp"
            @change=${this._handleChangePicture}
            data-picture-type="cover"
            name="file"
            required
            aria-label="Cover picture"
            aria-describedby="profile-picture-desc"
          />
          <div id="cover-picture-desc" class="form-desc">
            Select a cover picture.
          </div>
          <sl-button
            type="submit"
            variant="primary"
            ?loading=${this.loadingSaveCoverPicture}
          >
            Upload & save
          </sl-button>
        </form>
        <sl-divider></sl-divider>
        <h3>Your info</h3>
        <form @submit="${this._addUserMeta}" id="infoForm">
          <sl-input
            label="Your email"
            disabled
            filled
            value=${ifDefined(this.email || '')}
          ></sl-input>
          <div class="flex gap05 w100">
            <sl-input
              label="URL handle"
              disabled
              filled
              value="https://rcmd.world/user/"
            ></sl-input>
            <sl-input
              value=${ifDefined(this.urlHandle || '')}
              class="asfe"
              name="urlHandle"
            ></sl-input>
          </div>
          <div class="flex gap05 w100">
            <sl-input
              name="firstName"
              label="First name"
              class="w50"
              value=${ifDefined(this.firstName || '')}
              name="firstName"
            ></sl-input>
            <sl-input
              name="lastName"
              label="Last name"
              class="w50"
              value=${ifDefined(this.lastName || '')}
              name="lastName"
            ></sl-input>
          </div>
          <sl-input
            class="w50"
            type="date"
            name="dateOfBirth"
            label="Date of Birth"
            value=${ifDefined(this.dateOfBirth || '')}
          ></sl-input>
          <sl-select
            label="Gender"
            name="gender"
            class="w50"
            value=${ifDefined(this.gender || '')}
          >
            <sl-option value="male">Male</sl-option>
            <sl-option value="female">Female</sl-option>
            <sl-option value="other">Other</sl-option>
            <sl-option value="undisclosed">Prefer not to say</sl-option>
          </sl-select>
          <autocomplete-component
            class="w50"
            label="Locale"
            name="locale"
            .items=${locales}
            .value=${this.stagedLocale}
            @change=${this._handleLocaleChange}
          ></autocomplete-component>
          <autocomplete-component
            class="w50"
            label="Time zone"
            name="timeZone"
            .items=${timeZones}
            .value=${this.stagedTimeZone}
            @change=${this._handleTimeZoneChange}
          ></autocomplete-component>
          <div class="mb1">
            <label for="interests-input">Interests (optional):</label>
            <tag-list
              .tags=${this.stagedInterests}
              empty-message="No interests added"
              @remove-tag=${(event: CustomEvent) =>
                this._removeInterest(event.detail)}
            ></tag-list>
            <tag-input
              name="interests-input"
              @add-tag=${(event: CustomEvent) =>
                this._handleAddInterest(event.detail)}
            ></tag-input>
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
          <sl-button
            type="submit"
            variant="primary"
            ?loading=${this.loadingSaveInfo}
          >
            Save info
          </sl-button>
        </form>
      </sl-card>
    `
  }

  static styles = [
    sharedStyles,
    spacing,
    sizing,
    flex,
    css`
      section {
        padding: 1rem;
      }
      h1 {
        text-align: center;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      sl-button {
        align-self: flex-start;
      }
    `,
  ]

  meta() {
    return {
      title: 'My Account',
      description: 'RCMD my account page',
    }
  }
}
