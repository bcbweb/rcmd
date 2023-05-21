import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { skeleton } from '../styles/skeleton.js'

@customElement('cover-picture')
export class CoverPicture extends LitElement {
  @property()
  image: string | null = null

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`
      <sl-skeleton effect="pulse" class="skeleton--image"></sl-skeleton>
      <img
        src=${this.image}
        width="100%"
        height="100%"
        ?hidden=${!this.image}
      />
    `
  }

  static styles = [
    skeleton,
    css`
      :host {
        aspect-ratio: 4/1;
        position: relative;
      }
      sl-skeleton {
        aspect-ratio: 4/1;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 0;
      }
      img {
        aspect-ratio: 4/1;
        object-fit: cover;
        object-position: center center;
        position: absolute;
        top: 0;
        z-index: 1;
      }
    `,
  ]
}
