import { LitElement, html, css } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
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
        src=${ifDefined(this.image === null ? undefined : this.image)}
        width="100%"
        height="100%"
        ?hidden=${!this.image}
      />
      <slot></slot>
    `
  }

  static styles = [
    skeleton,
    css`
      :host {
        aspect-ratio: 4/1;
        position: relative;
        display: flex;
      }
      sl-skeleton.skeleton--image {
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
