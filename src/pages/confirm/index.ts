import { html, css } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { confirmSignUp, resendConfirmationCode } from '../../services/auth.js'
import notify from '../../utils/notify.js'
import { sharedStyles } from '../../styles/shared-styles.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { PageElement } from '../../helpers/page-element.js'

@customElement('page-confirm')
export class PageConfirm extends PageElement {
  @property({ type: String }) username!: string

  @query('form')
  private form!: HTMLFormElement

  @state()
  protected loadingConfirm: boolean = false
  @state()
  protected loadingResend: boolean = false
  @state()
  protected resent: boolean = false

  async _confirm(event: Event) {
    event.preventDefault()
    const validity = this.form.reportValidity()
    if (!validity) {
      notify('Please fill out all fields.', 'neutral', 'info-circle')
      return
    }
    const data = serialize(this.form)
    this.loadingConfirm = true
    try {
      const result = await confirmSignUp(this.username, data.code as string)
      console.log('Sign up confirmed', result)
    } catch (error: any) {
      switch (error.code) {
        case 'CodeMismatchException':
          notify('Invalid confirmation code.', 'warning')
          break
        default:
          notify('Unable to confirm. Please contact support.', 'danger')
      }
      console.error(error)
    }
    this.loadingConfirm = false
  }

  async _resend(event: Event) {
    event.preventDefault()
    if (this.resent) return
    this.loadingResend = true
    const result = await resendConfirmationCode(this.username)
    if (result) {
      this.loadingResend = false
      this.resent = true
    }
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
          <h1>Confirm</h1>
        </div>
        <form @submit="${this._confirm}">
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
              ?loading=${this.loadingConfirm}
            >
              Submit
            </sl-button>
            <sl-button
              variant="neutral"
              ?loading=${this.loadingResend}
              @click=${this._resend}
            >
              ${this.resent ? 'Resent!' : 'Resend'}
            </sl-button>
          </sl-button-group>
        </form>
      </sl-card>
    `
  }

  meta() {
    return {
      title: 'Confirm',
      description: 'RCMD confirmation page',
    }
  }
}
