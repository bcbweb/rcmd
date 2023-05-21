import { css } from 'lit'

export const styles = css`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  #carousel {
    aspect-ratio: 2;
  }
  .card-overview {
    max-width: 300px;
  }
  .card-overview small {
    color: var(--sl-color-neutral-500);
  }
  .card-overview [slot='footer'] {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @media (horizontal-viewport-segments: 2) {
    #welcomeBar {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
    #welcomeCard {
      margin-right: 64px;
    }
  }
`
