import { css } from 'lit'

export const button = css`
  .button {
    background: transparent;
    border: none;
    cursor: pointer;
    display: inline-block;
    margin: 0;
    overflow: visible;
    padding: 0;
    position: relative;
    width: auto;
    /* inherit font & color from ancestor */
    color: inherit;
    font: inherit;
    /* Normalize line-height. Cannot be changed from normal in Firefox 4+. */
    line-height: normal;
    /* Corrects font smoothing for webkit */
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    /* Corrects inability to style clickable input types in iOS */
    -webkit-appearance: none;
  }
  .button:disabled,
  .button.loading {
    opacity: 0.5;
    pointer-events: none;
  }
  .button.loading {
    color: transparent;
    position: relative;
  }
  /* Add a spinner to the button in the loading state */
  button.loading::after {
    content: '';
    display: inline-block;
    width: var(--spinner-size, 20px);
    height: var(--spinner-size, 20px);
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    border: 2px solid var(--spinner-color, white);
    border-top-color: transparent;
    transform: translateX(-50%, -50%);
    animation: spin 0.6s linear infinite;
  }
  /* Define the keyframe animation for the spinner */
  @keyframes spin {
    from {
      transform: translate(-50%, -50%) rotate(360deg);
    }
    to {
      transform: translate(-50%, -50%);
    }
  }
  .button--primary {
    font-size: 1rem;
    padding: 0.5rem;
    background-color: #0077cc;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  .button--action {
    --spinner-color: black;
    --spinner-size: 10px;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    height: 30px;
    justify-content: center;
    width: 30px;
  }
`
