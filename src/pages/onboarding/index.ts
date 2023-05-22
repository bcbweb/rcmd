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
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { ProfileStateWrapper } from '../../helpers/profile-state-wrapper.js'
import '../../components/avatar-component.js'
import '../../components/tag-list.js'
import '../../components/tag-input.js'

@customElement('page-onboarding')
export class PageOnboarding extends ProfileStateWrapper {
  @query('#pictureForm')
  private pictureForm!: HTMLFormElement
  @query('#infoForm')
  private infoForm!: HTMLFormElement

  @state()
  protected loadingPictureForm: boolean = false
  @state()
  protected loadingInfoForm: boolean = false
  @state()
  protected stagedProfilePicture: string | null = ''
  @state()
  private stagedInterests: string[] = []
  @state()
  private stagedTags: string[] = []

  get previewProfilePicture() {
    return this.stagedProfilePicture || this.profilePicture
  }

  async _uploadPicture(event: Event) {
    event.preventDefault()
    if (!this.email) {
      notify('Email is not set', 'danger', 'exclamation-triangle')
      return
    }
    const validity = this.pictureForm.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(this.pictureForm)
    this.loadingPictureForm = true
    const file = data.profilePicture as File
    const result = await uploadUserPicture(file)
    if (result) {
      const updateMetaResult = await updateUserMeta({
        email: this.email,
        profilePicture: result,
      })
      if (updateMetaResult) {
        notify('Profile picture updated.', 'success', 'check-circle')
      }
    }
    this.loadingPictureForm = false
  }

  async _addUserMeta(event: Event) {
    event.preventDefault()
    if (!this.email) {
      notify('Email is not set', 'danger', 'exclamation-triangle')
      return
    }
    const validity = this.infoForm.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(this.infoForm)
    this.loadingInfoForm = true
    const urlHandle = await generateUniqueURLHandle(
      data.firstName as string,
      data.lastName as string
    )
    const userMeta: UserMeta = {
      email: this.email,
      firstName: data.firstName as string,
      lastName: data.lastName as string,
      urlHandle,
      interests: this.stagedInterests,
      tags: this.stagedTags,
      roles: ['private'],
    }
    try {
      await updateUserMeta(userMeta)
      notify('Information saved.', 'success', 'check-circle')
      this._completeOnboarding()
    } catch (error) {
      console.error(error)
      notify(
        'An error occurred saving your information. Contact support if issues persist.',
        'danger',
        'exclamation-triangle'
      )
      return
    }
    this.loadingInfoForm = false
  }

  private _handleChangePicture(event: Event) {
    const element = event.target as HTMLInputElement
    const file = element.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      this.stagedProfilePicture = result
    }
    reader.readAsDataURL(file)
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

  async _completeOnboarding() {
    if (!this.email) {
      console.error('Email is not set')
      return
    }
    const updateMetaResult = await updateUserMeta({
      email: this.email,
      onboardingComplete: true,
    })
    if (!updateMetaResult) {
      console.error('Error setting onboarding complete user meta')
      notify(
        'An error occurred completing onboarding. Contact support if issues persist.',
        'danger',
        'exclamation-triangle'
      )
    }
    const event = new CustomEvent('user-onboarding-complete', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
  }

  render() {
    return html`
      <sl-card class="container container--sm">
        <div slot="header">
          <h1>Tell us about yourself</h1>
        </div>
        <h2>Add a profile picture</h2>
        <form @submit=${this._uploadPicture} id="pictureForm">
          <div class="mb1">
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
              name="profilePicture"
              required
              aria-label="Profile picture"
              aria-describedby="profile-picture-desc"
            />
            <div id="profile-picture-desc" class="form-desc">
              Please upload a profile picture.
            </div>
          </div>
          <sl-button
            type="submit"
            variant="primary"
            ?loading=${this.loadingPictureForm}
          >
            Upload
          </sl-button>
        </form>
        <sl-divider></sl-divider>
        <h2>About you</h2>
        <form @submit="${this._addUserMeta}" id="infoForm">
          <sl-input
            name="firstName"
            label="First name"
            help-text="Please enter your first name(s)."
            required
          ></sl-input>
          <sl-input
            name="lastName"
            label="Last name"
            help-text="Please enter your last name."
            required
          ></sl-input>
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
            ?loading=${this.loadingInfoForm}
          >
            Save & finish
          </sl-button>
        </form>
      </sl-card>
    `
  }

  static styles = [
    sharedStyles,
    spacing,
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
    `,
  ]

  meta() {
    return {
      title: 'Onboarding',
      description: 'RCMD onboarding page',
    }
  }
}
