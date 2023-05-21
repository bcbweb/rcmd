import { css } from 'lit'

export const container = css`
  .container {
    box-sizing: border-box;
    margin: auto;
    max-width: 1200px;
    padding: 0 20px;
    width: 100%;
  }
  .container--lg {
    max-width: 1000px;
  }
  .container--md {
    max-width: 800px;
  }
  .container--sm {
    max-width: 600px;
  }
`
