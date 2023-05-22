import { html, css, LitElement } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { signIn } from '../../services/auth.js'
import notify from '../../utils/notify.js'
import { sharedStyles } from '../../styles/shared-styles.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { PageElement } from '../../helpers/page-element.js'
import { router } from '../../router.js'

@customElement('page-login')
export class PageLogin extends PageElement {
  @query('form')
  private form!: HTMLFormElement

  @state()
  protected loading: boolean = false

  async _signIn(event: Event) {
    event.preventDefault()
    const validity = this.form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(this.form)
    this.loading = true
    try {
      await signIn(data.username as string, data.password as string)
    } catch (error: any) {
      switch (error.code) {
        case 'UserNotFoundException':
          notify('Invalid username or password.', 'warning')
          break
        case 'NotAuthorizedException':
          notify('Invalid username or password.', 'warning')
          break
        case 'UserNotConfirmedException':
          notify('Please confirm your email address to continue.', 'info')
          router.navigate(
            `/confirm?username=${encodeURIComponent(data.username as string)}`
          )
          break
        default:
          notify('Unable to log in. Please contact support.', 'danger')
      }
    }
    this.loading = false
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
      <sl-card class="container container--sm">
        <div slot="header">
          <h1>Login</h1>
        </div>
        <form @submit="${this._signIn}">
          <sl-input name="username" label="Username" required></sl-input>
          <sl-input
            required
            name="password"
            label="Password"
            type="password"
            password-toggle
          ></sl-input>
          <sl-button type="submit" variant="primary" ?loading=${this.loading}>
            Submit
          </sl-button>
        </form>
        <p>Don't have an account yet? <a href="/register">Sign up</a></p>
      </sl-card>
    `
  }

  meta() {
    return {
      title: 'Login',
      description: 'RCMD login page',
    }
  }
}
