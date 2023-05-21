import { escapeHTML } from '../utils/general.js'

export default function notify(
  message: string,
  variant: string = 'primary',
  icon: string = 'info-circle',
  duration: number = 3000
) {
  const alert = Object.assign(document.createElement('sl-alert'), {
    variant,
    closable: true,
    duration: duration,
    innerHTML: `
      <sl-icon name="${icon}" slot="icon"></sl-icon>
      ${escapeHTML(message)}
    `,
  }) as any

  document.body.append(alert)
  return alert.toast()
}
