import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { container } from '../styles/container.js'
import { flex } from '../styles/flex.js'

@customElement('hero-component')
export class HeroComponent extends LitElement {
  @property()
  title: string = ''
  @property()
  text: string = ''
  @property()
  image: string = ''
  @property({ attribute: 'button-text' })
  buttonText: string = ''
  @property({ attribute: 'button-url' })
  buttonUrl: string = ''

  get hasButton(): boolean {
    return this.buttonText !== '' && this.buttonUrl !== ''
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`
      <div id="hero" class="flex jcc container container--lg">
        <div id="content" class="flex jcc fdc">
          <h1>${this.title}</h1>
          <p>${this.text}</p>
          ${this.hasButton
            ? html`<sl-button variant="primary" href="${this.buttonUrl}">
                ${this.buttonText}
              </sl-button>`
            : ''}
        </div>
        <div id="image">
          <img src=${this.image} />
        </div>
      </div>
    `
  }

  static styles = [
    container,
    flex,
    css`
      h1 {
        font-size: 4em;
        line-height: 1.1em;
        margin: 0;
      }
      #hero {
        gap: 2rem;
      }
      #content {
        width: 40%;
      }
      #content p {
        font-size: 1.3em;
      }
      #content sl-button {
        width: max-content;
      }
      #image {
        width: 60%;
      }
      #image img {
        width: 100%;
      }
    `,
  ]
}
