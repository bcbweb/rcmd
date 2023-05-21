import { css } from 'lit'

export const form = css`
  form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f7f7f7;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type='text'],
  input[type='password'],
  input[type='email'],
  input[type='url'],
  textarea {
    display: block;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
  }

  textarea {
    resize: none;
  }

  input + label {
    margin-bottom: 20px;
  }

  input[type='submit'],
  button[type='submit'] {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }

  input[type='submit']:hover,
  button[type='submit']:hover {
    background-color: #3e8e41;
  }

  fieldset {
    border: none;
    margin: 0 0 20px 0;
    padding: 0;
  }

  .form-desc {
    font-size: 0.8em;
    margin-top: 5px;
  }

  .form-error-message {
    display: block;
    color: red;
    margin-bottom: 20px;
  }
  .form-info {
    text-align: center;
  }
`
