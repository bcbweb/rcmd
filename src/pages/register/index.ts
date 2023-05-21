import { html, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { router } from '../../router.js'
import {
  signUp,
  confirmSignUp,
  resendConfirmationCode,
} from '../../services/auth.js'
import {
  createUserMeta,
  generateUniqueURLHandle,
  uploadUserPicture,
  updateUserMeta,
} from '../../services/user.js'
import { setUser } from '../../utils/state.js'
import notify from '../../utils/notify.js'
import termsDialog from './terms-dialog.js'
import { sharedStyles } from '../../styles/shared-styles.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { PageElement } from '../../helpers/page-element.js'
import '../../components/tag-input.js'
import '../../components/tag-list.js'

@customElement('page-register')
export class PageRegister extends PageElement {
  @query('#stage1')
  private stage1Form!: HTMLFormElement
  @query('#stage2')
  private stage2Form!: HTMLFormElement
  @query('#stage3')
  private stage3Form!: HTMLFormElement
  @query('#stage4')
  private stage4Form!: HTMLFormElement
  @query('#terms-dialog')
  private termsDialogElement!: HTMLDialogElement

  @state()
  protected loading: boolean = false
  @state()
  protected resent: boolean = false
  @state()
  protected stage: number = 1
  @state()
  private stagedEmail: string = ''
  @state()
  private stagedInterests: string[] = []
  @state()
  private stagedTags: string[] = []

  get progress() {
    return (this.stage / 4) * 100
  }

  async _signUp(event: Event) {
    event.preventDefault()
    const validity = this.stage1Form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(this.stage1Form)
    const user: User = {
      username: data.username as string,
      password: data.password as string,
    }
    this.loading = true

    try {
      const result = await signUp(user)
      console.log('Created user', result)
      this.stagedEmail = user.username
      this.stage++
    } catch (error: any) {
      if (error.code === 'UsernameExistsException') {
        notify(
          'The username entered already exists.',
          'warning',
          'exclamation-triangle'
        )
      } else if (error.code === 'InvalidPasswordException') {
        notify('Invalid password.', 'warning')
      } else {
        notify(
          'There was an error creating the user.',
          'danger',
          'exclamation-triangle'
        )
      }
    }
    this.loading = false
  }

  async _confirm(event: Event) {
    event.preventDefault()
    const validity = this.stage2Form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(this.stage2Form)
    this.loading = true
    try {
      const result = await confirmSignUp(this.stagedEmail, data.code as string)
      this.stage++
      console.log('Sign up confirmed', result)
    } catch (error: any) {
      console.log(error, Object.keys(error))
    }
    this.loading = false
  }

  async _resend(event: Event) {
    event.preventDefault()
    if (this.resent) return
    this.loading = true
    const result = await resendConfirmationCode(this.stagedEmail)
    if (result) {
      this.loading = false
      this.resent = true
    }
  }

  async _addUserMeta(event: Event) {
    event.preventDefault()
    if (!this.stagedEmail) {
      notify('Email is not set', 'danger', 'exclamation-triangle')
      return
    }
    const validity = this.stage3Form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(this.stage3Form)
    this.loading = true
    const urlHandle = await generateUniqueURLHandle(
      data.firstName as string,
      data.lastName as string
    )
    const userMeta: UserMeta = {
      email: this.stagedEmail,
      firstName: data.firstName as string,
      lastName: data.lastName as string,
      urlHandle,
      interests: this.stagedInterests,
      tags: this.stagedTags,
      roles: ['private'],
    }
    const result = await createUserMeta(userMeta)
    setUser()
    router.navigate('/profile')
    if (result) {
      this.stage++
    }
    this.loading = false
  }

  private _showTerms() {
    this.termsDialogElement.show()
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

  async _uploadPicture(event: Event) {
    event.preventDefault()
    const validity = this.stage4Form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(this.stage4Form)
    console.log(data)
    this.loading = true
    const file = data.profilePicture as File
    const result = await uploadUserPicture(file)
    if (result) {
      const updateMetaResult = await updateUserMeta({
        email: this.stagedEmail,
        profilePicture: result,
      })
      if (updateMetaResult) {
        this._completeOnboarding()
      }
    }
    this.loading = false
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

  static styles = [
    sharedStyles,
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

  render() {
    return html`
      ${termsDialog}
      <sl-progress-bar value="${this.progress}"></sl-progress-bar>
      <sl-divider></sl-divider>
      <div ?hidden=${this.stage !== 1}>
        <sl-card class="container container--sm">
          <div slot="header">
            <h1>Register</h1>
          </div>
          <form @submit="${this._signUp}" id="stage1">
            <sl-input
              name="username"
              label="Your email address"
              required
            ></sl-input>
            <sl-input
              required
              name="password"
              label="Password"
              type="password"
              password-toggle
            ></sl-input>
            <sl-checkbox value="accept" required>
              Accept
              <a href="javascript:void(0)" @click=${this._showTerms}>
                terms and conditions
              </a>
            </sl-checkbox>
            <sl-button type="submit" variant="primary" ?loading=${this.loading}>
              Get started
            </sl-button>
          </form>
        </sl-card>
      </div>
      <div ?hidden=${this.stage !== 2}>
        <sl-card class="container container--sm">
          <div slot="header">
            <h1>Confirm</h1>
          </div>
          <form @submit="${this._confirm}" id="stage2">
            <sl-input
              required
              name="code"
              label="Confirmation code"
              help-text="Please enter the confirmation code you should have received by email. If you did not receive one, please use the resend button."
            ></sl-input>
            <sl-button-group>
              <sl-button
                type="submit"
                variant="primary"
                ?loading=${this.loading}
              >
                Submit
              </sl-button>
              <sl-button
                variant="neutral"
                ?loading=${this.loading}
                @click=${this._resend}
              >
                ${this.resent ? 'Resent!' : 'Resend'}
              </sl-button>
            </sl-button-group>
          </form>
        </sl-card>
      </div>
      <div ?hidden=${this.stage !== 3}>
        <sl-card class="container container--sm">
          <div slot="header">
            <h1>Tell us about yourself</h1>
          </div>
          <form @submit="${this._addUserMeta}" id="stage3">
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
            <sl-button type="submit" variant="primary" ?loading=${this.loading}>
              Save
            </sl-button>
          </form>
        </sl-card>
      </div>
      <div ?hidden=${this.stage !== 4}>
        <sl-card class="container container--sm">
          <h1>Add a profile picture</h1>
          <form @submit=${this._uploadPicture} id="stage4">
            <div class="mb1">
              <input
                type="file"
                accept="image/jpeg, image/png, image/gif, image/bmp, image/tiff, image/webp"
                name="profilePicture"
                required
                aria-label="Profile picture"
                aria-describedby="profile-picture-desc"
              />
              <div id="profile-picture-desc" class="form-desc">
                Please upload a profile picture.
              </div>
            </div>
            <sl-button type="submit" variant="primary" ?loading=${this.loading}>
              Upload & continue
            </sl-button>
          </form>
        </sl-card>
      </div>
    `
  }

  meta() {
    return {
      title: 'Login',
      description: 'RCMD login page',
    }
  }
}
