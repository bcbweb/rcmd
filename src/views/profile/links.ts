import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { lists } from '../../styles/lists.js'
import { flex } from '../../styles/flex.js'
import { sizing } from '../../styles/sizing.js'
import { spacing } from '../../styles/spacing.js'
import { container } from '../../styles/container.js'
import { animations } from '../../styles/animations.js'
import { createLink, deleteLink } from '../../services/link.js'
import '../../components/add-link.js'
import store from '../../redux/store.js'
import { addLink, removeLink } from '../../redux/profileSlice.js'
import notify from '../../utils/notify.js'
import { ProfileStateWrapper } from '../../helpers/profile-state-wrapper.js'

@customElement('view-profile-links')
export class ViewProfileLinks extends ProfileStateWrapper {
  @state()
  protected loading: boolean = false
  @state()
  protected deleting: number | false = false

  constructor() {
    super()
    this._handleFetchLinksComplete = this._handleFetchLinksComplete.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener(
      'fetch-links-complete',
      this._handleFetchLinksComplete
    )
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener(
      'fetch-links-complete',
      this._handleFetchLinksComplete
    )
  }

  firstUpdated() {
    super.firstUpdated()
    if (this.links === null) {
      this.loading = true
      const fetchLinksEvent = new Event('fetch-links', {
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(fetchLinksEvent)
    }
  }

  private async _handleFetchLinksComplete() {
    this.loading = false
  }

  private _closeForm() {
    const closeFormEvent = new CustomEvent('close-add-link-form', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(closeFormEvent)
  }

  private async _handleLinkSubmitted(event: CustomEvent) {
    if (!this.email) {
      notify(
        'There was an error adding the link',
        'danger',
        'exclamation-triangle'
      )
      return
    }
    const { url, title } = event.detail
    const now = new Date()
    const timestamp = now.toISOString()
    const link: Link = {
      id: '',
      owner: this.email,
      title,
      url,
      description: '',
      created: timestamp,
      updated: timestamp,
      visibility: 'public',
    }
    try {
      const result = await createLink(link)
      link.id = result.id
      this._closeForm()
      store.dispatch(addLink(link))
    } catch (error: any) {
      notify(error.code as string, 'danger', 'exclamation-triangle')
    }
  }

  private async _deleteLink(
    id: string | undefined,
    index: number,
    target: EventTarget | null
  ) {
    this.deleting = index
    if (!this.email || !id) return
    const element = target as HTMLElement
    element.parentElement?.classList.add('loading')
    await deleteLink(this.email, id as string)
    store.dispatch(removeLink(id))
    this.deleting = false
  }

  render() {
    return html`
      <header id="header" class="flex fdc aic jcc">
        <h1>Links</h1>
        <p>Curate your favourite links to show on your profile</p>
      </header>
      <div class="container">
        <add-link @link-submitted=${this._handleLinkSubmitted}></add-link>
        <section ?hidden=${!this.loading}>
          <p class="loading-text">Loading links<span id="ellipsis"></span></p>
        </section>
        <section id="links" class="mt1" ?hidden=${this.loading}>
          <p ?hidden=${this.links && this.links.length > 0}>
            No links have been added.
          </p>
          <ul
            id="links-list"
            class="unstyled flex fdc"
            ?hidden=${!this.links || this.links.length === 0}
          >
            ${(this.links || []).map(
              (link, index) =>
                html`<li>
                  <div class="flex aic">
                    <sl-button
                      href="http://${link.url}"
                      target="_blank"
                      class="w100"
                    >
                      ${link.title}
                    </sl-button>
                    <sl-button
                      variant="text"
                      class="delete-button"
                      @click=${(event: Event) =>
                        this._deleteLink(link.id, index, event.target)}
                      ?loading=${this.deleting === index}
                    >
                      <sl-icon name="trash"></sl-icon>
                    </sl-button>
                  </div>
                </li>`
            )}
          </ul>
        </section>
      </div>
    `
  }

  static styles = [
    flex,
    lists,
    container,
    animations,
    sizing,
    spacing,
    css`
      h1 {
        margin: 0;
        text-align: center;
      }
      #links-list {
        gap: 10px;
      }
      #ellipsis::after {
        animation: ellipsis-animation 1s infinite;
        content: '';
      }
      sl-button.delete-button::part(base) {
        color: var(--sl-color-black);
      }
    `,
  ]

  meta() {
    return {
      title: 'Links',
      description: 'RCMD links page',
    }
  }
}
