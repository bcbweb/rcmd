import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { flex } from '../../styles/flex.js'
import { grid } from '../../styles/grid.js'
import { icon } from '../../styles/icon.js'
import { button } from '../../styles/button.js'
import { lists } from '../../styles/lists.js'
import { spacing } from '../../styles/spacing.js'
import { container } from '../../styles/container.js'
import { animations } from '../../styles/animations.js'
import { createRcmd, uploadPicture } from '../../services/rcmd.js'
import '../../components/add-rcmd.js'
import '../../components/rcmd-card.js'
import store from '../../redux/store.js'
import { addRcmd, removeRcmd } from '../../redux/profileSlice.js'
import notify from '../../utils/notify.js'
import { ProfileStateWrapper } from '../../helpers/profile-state-wrapper.js'

@customElement('view-profile-rcmds')
export class ViewProfileRcmds extends ProfileStateWrapper {
  @state()
  protected loading: boolean = false
  @state()
  protected deleting: number | false = false

  get gridClass(): string {
    if (this.rcmds?.length == 1 || this.rcmds?.length == 2) {
      return 'grid--1-2'
    } else if (this.rcmds?.length == 3) {
      return 'grid--3'
    } else {
      return 'grid--4-plus'
    }
  }

  constructor() {
    super()
    this._handleFetchRcmdsComplete = this._handleFetchRcmdsComplete.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    if (this.rcmds === null) {
      this.loading = true
      const fetchRcmdsEvent = new Event('fetch-rcmds', {
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(fetchRcmdsEvent)
    }
    this.addEventListener(
      'fetch-rcmds-complete',
      this._handleFetchRcmdsComplete
    )
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener(
      'fetch-rcmds-complete',
      this._handleFetchRcmdsComplete
    )
  }

  private async _handleFetchRcmdsComplete() {
    this.loading = false
  }

  private async _handleRcmdSubmitted(event: CustomEvent) {
    if (!this.email) return
    const {
      image,
      title,
      description,
      locationType,
      address,
      tags,
      url,
      discountCode,
      video,
    } = event.detail

    let uploadedImageUrl

    try {
      uploadedImageUrl = await uploadPicture(image)
    } catch (error) {
      console.error(error)
      return
    }

    const now = new Date()
    const timestamp = now.toISOString()
    const rcmd: Rcmd = {
      owner: this.email,
      image: uploadedImageUrl as string,
      title,
      description,
      locationType,
      address,
      tags,
      url,
      discountCode,
      video,
      created: timestamp,
      updated: timestamp,
      visibility: 'public',
    }
    try {
      const result = await createRcmd(rcmd)
      const closeFormEvent = new CustomEvent('close-add-rcmd-form', {
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(closeFormEvent)
      store.dispatch(addRcmd(result.item))
    } catch (error: any) {
      console.error(error)
      notify(error.code as string, 'danger', 'exclamation-triangle')
    }
  }

  private async _handleRcmdDeleted(event: CustomEvent) {
    store.dispatch(removeRcmd(event.detail.id))
  }

  render() {
    return html`
      <header id="header" class="flex fdc aic jcc">
        <h1>RCMDs</h1>
        <p>Manage your recommendations</p>
      </header>
      <div class="container">
        <div class="add-rcmd-form">
          <add-rcmd @rcmd-submitted=${this._handleRcmdSubmitted}></add-rcmd>
        </div>
        <section ?hidden=${!this.loading}>
          <p class="loading-text">Loading RCMDs<span id="ellipsis"></span></p>
        </section>
        <section id="rcmds" class="mt1 mb1" ?hidden=${this.loading}>
          <p ?hidden=${this.rcmds && this.rcmds.length > 0}>
            No RCMDs have been added.
          </p>
          <ul
            class="rcmd-list unstyled grid grid--gap-md ${this.gridClass}"
            ?hidden=${!this.rcmds || this.rcmds.length === 0}
          >
            ${(this.rcmds || []).map(
              (rcmd) =>
                html`<li class="rcmd-item flex fdc">
                  <rcmd-card
                    .rcmd=${rcmd}
                    @deleted=${this._handleRcmdDeleted}
                  ></rcmd-card>
                </li>`
            )}
          </ul>
        </section>
      </div>
    `
  }

  static styles = [
    flex,
    grid,
    icon,
    button,
    lists,
    spacing,
    container,
    animations,
    css`
      h1 {
        margin: 0;
        text-align: center;
      }
      .header {
        align-items: center;
        gap: 20px;
        justify-content: center;
      }
      .header__name {
        text-align: center;
      }
      #ellipsis::after {
        animation: ellipsis-animation 1s infinite;
        content: '';
      }
    `,
  ]

  meta() {
    return {
      title: 'RCMDs',
      description: 'RCMD recommendations page',
    }
  }
}
