import { LitElement, html, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'

@customElement('search-drawer')
export class SearchDrawer extends LitElement {
  @query('sl-drawer')
  private drawer!: any

  constructor() {
    super()
    this._handleOpenDrawer = this._handleOpenDrawer.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('open-search-drawer', this._handleOpenDrawer)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('open-search-drawer', this._handleOpenDrawer)
  }

  private _handleOpenDrawer() {
    this.drawer.show()
  }

  render() {
    return html`
      <sl-drawer label="Search" placement="top">
        <sl-input placeholder="Search" size="large" pill>
          <sl-icon slot="prefix" name="search"></sl-icon>
        </sl-input>
      </sl-drawer>
    `
  }

  static styles = css`
    :host {
    }
  `
}
