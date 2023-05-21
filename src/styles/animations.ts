import { css } from 'lit'

export const animations = css`
  @keyframes ellipsis-animation {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`
