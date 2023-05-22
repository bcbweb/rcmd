import { getCognitoUser } from '../services/auth'

/**
 * Determines if a user is logged in.
 * TODO: improve approach to eliminate reduntant token in localstorage?
 *
 * @param {object} obj Object with camel case keys
 */
export function isLoggedIn(): boolean {
  return localStorage.getItem('token') !== null
}

export async function isUserConfirmed() {
  const user: any = await getCognitoUser()
  return user && user.attributes?.email_verified
}

/**
 * Updates a value in localStorage and ensures an event is fired even when in same browser context
 *
 * @param {string} key localStorage key
 * @param {string | null} value value to assign
 */
export function updateLocalStorage(key: string, value: string | null): void {
  const oldValue = localStorage.getItem(key)
  if (value) {
    localStorage.setItem(key, value)
  } else {
    localStorage.removeItem(key)
  }
  const event = new StorageEvent('storage', {
    key,
    oldValue,
    newValue: value,
  })
  window.dispatchEvent(event)
}

/**
 * Converts keys in an object from camel case to snake case
 *
 * @param {object} obj Object with camel case keys
 */
export function camelToSnake(obj: any): any {
  const snakeObj = {}
  for (let [key, value] of Object.entries(obj)) {
    const snakeKey: string = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    )
    snakeObj[snakeKey as keyof Object] =
      value && typeof value === 'object' ? camelToSnake(value) : value
  }
  return snakeObj
}

/**
 * Converts keys in an object from snake case to camel case
 *
 * @param {object} obj Object with snake case keys
 */
export function snakeToCamel(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item))
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/(_\w)/g, (match) => match[1].toUpperCase())
    acc[camelKey as keyof Object] = snakeToCamel(obj[key])
    return acc
  }, {})
}

export function slugify(str: string): string {
  const a = 'àáäâãåæçèéëêìíïîòóöôõøùúüûñßþÿ'
  const b = 'aaaaaaaaceeeeiiiioooooouuuunbtssy'
  const p = new RegExp(`[${a}]+`, 'g')

  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/(^-+)|(-+$)/g, '')
}

/**
 * Function to fetch page title for a given URL
 *
 * @param {string} url The page's URL
 */
export async function getPageTitle(url: string) {
  try {
    // Fetch the HTML content of the web page
    const response = await fetch(url)
    const html = await response.text()

    // Extract the title from the HTML content
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = match ? match[1] : null

    return title
  } catch (error) {
    console.error('Error fetching page title:', error)
    return null
  }
}

/**
 * Renders a timestamp to a human-readable format
 *
 * @param {string} timestamp The timestamp to format
 */
export function formatTimestamp(timestamp: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'UTC',
  }

  const date = new Date(timestamp)
  return date.toLocaleString('en-US', options)
}

/**
 * Function to share a link on a given platform
 *
 * @param {string} platform The platform to share the link on
 * @param {string} url The URL to share
 * @param {string} redirectUrl The URL to redirect to after sharing (only applies to Facebook Messenger)
 * @param {string} media The URL of the media to share (only applies to Pinterest)
 * @param {string} description The description text used by some platforms when sharing
 */
export function shareLink(
  platform: string,
  link: string,
  redirectUrl?: string,
  media?: string,
  description: string = 'Check out this link!'
) {
  const APP_ID = process.env.VITE_FACEBOOK_APP_ID
  const url = encodeURIComponent(link)
  let shareUrl

  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${description}`
      break
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
      break
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`
      break
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${url}`
      break
    case 'messenger':
      shareUrl = `https://www.facebook.com/dialog/send?app_id=${APP_ID}&link=${url}${
        redirectUrl ? `&redirect_uri=${redirectUrl}` : ''
      }`
      break
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${url}`
      break
    case 'pinterest':
      shareUrl = `https://www.pinterest.com/pin/create/button/?url=${url}&description=${description}${
        media ? `&media=${media}` : ''
      }`
      break
    default:
      console.log('Unsupported platform')
      return
  }

  window.open(shareUrl, '_blank', 'width=400,height=400')
}

/**
 * Function to escape HTML making it safe to inject into the DOM
 * @param {string} html The HTML to escape
 * @returns {string} The escaped HTML
 */
export function escapeHTML(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Opens the search drawer
 *
 */
export function openSearchDrawer() {
  const event = new CustomEvent('open-search-drawer', {
    bubbles: true,
    composed: true,
  })
  document.dispatchEvent(event)
}

/**
 * Capitalizes the first letter of a string
 * @param {string} string The string to capitalize
 * @returns {string} The capitalized string
 * @example
 * capitalize('hello world') // 'Hello world'
 */
export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
