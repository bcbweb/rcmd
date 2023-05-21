import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import {
  PageElementNotFound,
  pageNotFoundMeta,
} from '../../helpers/page-element-not-found.js'

@customElement('page-not-found')
export class PageNotFound extends PageElementNotFound {
  static styles = css`
    :host {
      display: block;
    }

    section {
      padding: 1rem;
      text-align: center;
    }
  `

  render() {
    return html`
      <section>
        <h1>Page not found</h1>

        <p>
          <sl-button variant="primary" href="/">Back to home</sl-button>
        </p>
      </section>
    `
  }

  meta() {
    return pageNotFoundMeta
  }
}
