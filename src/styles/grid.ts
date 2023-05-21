import { css } from 'lit'

export const grid = css`
  .grid {
    display: grid;
  }
  .grid--gap-sm {
    grid-gap: 3px;
  }
  .grid--gap-md {
    grid-gap: 5px;
  }
  .grid--gap-lg {
    grid-gap: 10px;
  }
  .grid--4-plus {
    grid-template-columns: repeat(1, 1fr);
  }
  .grid--1-2 {
    grid-template-columns: repeat(1, 1fr);
  }
  .grid--3 {
    grid-template-columns: repeat(1, 1fr);
  }
  @media (min-width: 420px) {
    .grid--4-plus {
      grid-template-columns: repeat(2, 1fr);
    }
    .grid--1-2 {
      grid-template-columns: repeat(2, 1fr);
    }
    .grid--3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 750px) {
    .grid--4-plus {
      grid-template-columns: repeat(3, 1fr);
    }

    .grid--3 {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media (min-width: 990px) {
    .grid--4-plus {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`
