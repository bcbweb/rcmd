import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { skeleton } from '../styles/skeleton.js'
import { sizing } from '../styles/sizing.js'

@customElement('avatar-component')
export class AvatarComponent extends LitElement {
  @property({ type: String }) image = ''
  @property({ type: String }) size = '120px'

  connectedCallback() {
    super.connectedCallback()
    this.style.setProperty('--size', this.size)
  }

  render() {
    return html`
      <sl-skeleton effect="pulse" class="skeleton--circle"></sl-skeleton>
      <sl-avatar
        ?hidden=${!this.image}
        image=${this.image}
        style=${`--size: ${this.size}`}
      ></sl-avatar>
    `
  }

  static styles = [
    skeleton,
    sizing,
    css`
      :host {
        position: relative;
        width: var(--size);
        height: var(--size);
      }
      sl-skeleton {
        position: absolute;
        top: 0;
        width: var(--size);
        height: var(--size);
        z-index: 1;
      }
      sl-avatar {
        position: absolute;
        top: 0;
        z-index: 2;
      }
      sl-avatar[hidden] {
        opacity: 0;
      }
    `,
  ]
}
