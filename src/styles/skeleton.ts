import { css } from 'lit'

export const skeleton = css`
  .skeleton--image {
    aspect-ratio: 16 / 9;
  }

  .skeleton--circle {
    aspect-ratio: 1 / 1;
  }

  .skeleton--image::part(indicator) {
    --border-radius: var(--sl-border-radius-medium);
  }
`
