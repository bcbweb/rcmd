import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { flex } from '../styles/flex.js'
import './card-skeleton.js'

@customElement('carousel-skeleton')
export class CarouselSkeleton extends LitElement {
  @property({ type: Number })
  cardsPerPage = 3

  render() {
    return html`<div class="flex gap1">
      ${Array(this.cardsPerPage)
        .fill()
        .map(() => html`<card-skeleton></card-skeleton>`)}
    </div>`
  }

  static styles = [flex, css``]
}
