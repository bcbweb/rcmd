import { css } from 'lit'

export const sharedStyles = css`
  .container {
    display: block;
    padding: 18px;
    padding-top: 0px;
    margin: auto;
  }
  .container::part(footer) {
    display: flex;
    justify-content: flex-end;
  }
  @media (min-width: 750px) {
    .container {
      width: 90vw;
    }
    .container--sm {
      width: 60vw;
    }
  }
`
