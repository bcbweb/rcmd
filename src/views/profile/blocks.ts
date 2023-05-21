import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { icon } from '../../styles/icon.js'
import { flex } from '../../styles/flex.js'
import { container } from '../../styles/container.js'
import { animations } from '../../styles/animations.js'
import { createBlock, deleteBlock } from '../../services/profile-block.js'
import '../../components/add-block.js'
import store from '../../redux/store.js'
import { addBlock, removeBlock } from '../../redux/profileSlice.js'
import notify from '../../utils/notify.js'
import { ProfileStateWrapper } from '../../helpers/profile-state-wrapper.js'

@customElement('view-profile-blocks')
export class ViewProfileBlocks extends ProfileStateWrapper {
  @state()
  protected loading: boolean = false
  @state()
  protected deleting: number | false = false

  constructor() {
    super()
    this._handleFetchBlocksComplete = this._handleFetchBlocksComplete.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener(
      'fetch-blocks-complete',
      this._handleFetchBlocksComplete
    )
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener(
      'fetch-blocks-complete',
      this._handleFetchBlocksComplete
    )
  }

  firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties)
    if (this.profileBlocks === null) {
      this.loading = true
      const fetchBlocksEvent = new Event('fetch-blocks', {
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(fetchBlocksEvent)
    }
  }

  private async _handleFetchBlocksComplete() {
    this.loading = false
  }

  private _closeForm() {
    const closeFormEvent = new CustomEvent('close-add-block-form', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(closeFormEvent)
  }

  private async _handleBlockSubmitted(event: CustomEvent) {
    if (!this.email) {
      notify(
        'There was an error adding the block',
        'danger',
        'exclamation-triangle'
      )
      return
    }
    const { url } = event.detail
    const now = new Date()
    const timestamp = now.toISOString()
    const block: ProfileBlock = {
      id: '',
      owner: this.email,
      type: 'link',
      url,
      content: '',
      created: timestamp,
      visibility: 'public',
    }
    try {
      const result = await createBlock(block)
      block.id = result.id
      this._closeForm()
      store.dispatch(addBlock(block))
    } catch (error: any) {
      notify(error.code as string, 'danger', 'exclamation-triangle')
    }
  }

  private async _deleteBlock(
    id: string | undefined,
    index: number,
    target: EventTarget | null
  ) {
    this.deleting = index
    if (!this.email || !id) return
    const element = target as HTMLElement
    element.parentElement?.classList.add('loading')
    await deleteBlock(this.email, id as string)
    store.dispatch(removeBlock(id))
    this.deleting = false
  }

  render() {
    return html`
      <header id="header" class="flex fdc aic jcc">
        <h1>Blocks</h1>
        <p>Add content blocks to your main profile page</p>
      </header>
      <div class="container">
        <div class="add-block-form">
          <add-block @block-submitted=${this._handleBlockSubmitted}></add-block>
        </div>
        <section ?hidden=${!this.loading}>
          <p class="loading-text">Loading blocks<span id="ellipsis"></span></p>
        </section>
        <section id="blocks" ?hidden=${this.loading}>
          <p ?hidden=${this.profileBlocks && this.profileBlocks.length > 0}>
            No blocks have been added.
          </p>
          <ul
            class="tag-list"
            ?hidden=${!this.profileBlocks || this.profileBlocks.length === 0}
          >
            ${(this.profileBlocks || []).map(
              (block, index) =>
                html`<li>
                  <div class="flex aic">
                    <a href="http://${block.url}" target="blank">
                      ${block.content}
                    </a>
                    <sl-button
                      variant="text"
                      class="delete-button"
                      @click=${(event: Event) =>
                        this._deleteBlock(block.id, index, event.target)}
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
    icon,
    container,
    animations,
    css`
      h1 {
        margin: 0;
        text-align: center;
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
      title: 'Blocks',
      description: 'RCMD blocks page',
    }
  }
}
