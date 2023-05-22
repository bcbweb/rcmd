import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { sharedStyles } from '../../styles/shared-styles.js'
import { spacing } from '../../styles/spacing.js'
import { ProfileStateWrapper } from '../../helpers/profile-state-wrapper.js'
import '../../components/avatar-component.js'
import '../../components/tag-list.js'
import '../../components/tag-input.js'

@customElement('view-settings-main')
export class ViewSettingMain extends ProfileStateWrapper {
  @state()
  protected loading: boolean = false

  render() {
    return html`
      <sl-card class="container container--sm">
        <div slot="header">
          <h2>Settings</h2>
        </div>
        <form @submit=${() => {}}>
          <sl-button type="submit" variant="danger" ?loading=${this.loading}>
            Delete account
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
      sl-button {
        align-self: flex-start;
      }
    `,
  ]

  meta() {
    return {
      title: 'Settings',
      description: 'RCMD settings page',
    }
  }
}
