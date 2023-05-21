import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { skeleton } from '../styles/skeleton.js'
import { sizing } from '../styles/sizing.js'

@customElement('card-skeleton')
export class CardSkeleton extends LitElement {
  render() {
    return html`
      <sl-skeleton effect="pulse" class="skeleton--image"></sl-skeleton>
      <sl-skeleton effect="pulse" class="w80"></sl-skeleton>
      <sl-skeleton effect="pulse" class="w50"></sl-skeleton>
      <sl-skeleton effect="pulse" class="w70"></sl-skeleton>
      <sl-skeleton effect="pulse" class="w60"></sl-skeleton>
    `
  }

  static styles = [
    skeleton,
    sizing,
    css`
      :host {
        aspect-ratio: 1 / 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `,
  ]
}
