import { html, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { signUp } from '../../services/auth.js'
import notify from '../../utils/notify.js'
import { sharedStyles } from '../../styles/shared-styles.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { PageElement } from '../../helpers/page-element.js'
import { router } from '../../router.js'
import termsDialog from './terms-dialog.js'

@customElement('page-register')
export class PageRegister extends PageElement {
  @query('form')
  private form!: HTMLFormElement
  @query('#terms-dialog')
  private termsDialogElement!: HTMLDialogElement

  @state()
  protected loading: boolean = false

  async _signUp(event: Event) {
    event.preventDefault()
    const validity = this.form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(this.form)
    const user: User = {
      username: data.username as string,
      password: data.password as string,
    }
    this.loading = true

    try {
      await signUp(user)
      router.navigate(`/confirm?username=${encodeURIComponent(user.username)}`)
    } catch (error: any) {
      if (error.code === 'UsernameExistsException') {
        notify(
          'The username entered already exists. Try logging in instead.',
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

  private _showTerms() {
    this.termsDialogElement.show()
  }

  render() {
    return html`
      ${termsDialog}
      <sl-card class="container container--sm">
        <div slot="header">
          <h1>Register</h1>
        </div>
        <form @submit="${this._signUp}">
          <sl-input name="username" label="Username" required></sl-input>
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
        <p>Already have an account? <a href="/login">Sign in</a></p>
      </sl-card>
    `
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

  meta() {
    return {
      title: 'Register',
      description: 'RCMD register page',
    }
  }
}
