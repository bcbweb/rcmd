import { API, Storage } from 'aws-amplify'
import { camelToSnake, slugify } from '../utils/general.js'

const CLOUDFRONT_URL_USER_IMAGES = (import.meta as any).env
  .CLOUDFRONT_URL_USER_IMAGES
const API_NAME = 'userApi'
const PATH = '/user'

/**
 * Returns a specific user from metadata table
 *
 */
export function getUserMeta(email: string) {
  return API.get(API_NAME, `${PATH}/object/${email}`, {})
}

/**
 * Returns a list of all users
 *
 */
export function getUsers() {
  return API.get(API_NAME, PATH, {})
}

/**
 * Creates a database entry containing user's metadata, as we only
 * store data necessary for auth in Cognito.
 *
 * @param {UserMeta} userMeta User object containing necessary metadata for dynamoDB
 */
export function createUserMeta(userMetaObject: UserMeta) {
  return API.put(API_NAME, PATH, {
    body: camelToSnake(userMetaObject),
  })
}

/**
 * Updates an existing database entry for a user's metadata.
 *
 * @param {UserMeta} userMeta User object containing necessary metadata for dynamoDB
 */
export function updateUserMeta(userMetaObject: UserMeta) {
  const data = camelToSnake(userMetaObject)
  delete data.email
  return API.post(API_NAME, PATH, {
    body: {
      id: userMetaObject.email,
      data,
    },
  })
}

/**
 * Upload a user picture (profile or cover image, block image, etc.)
 *
 * @param {File} file File to upload as picture
 */
export async function uploadUserPicture(file: File | undefined) {
  if (!file) return false
  try {
    const result = await Storage.put(file.name, file, {
      contentType: file.type,
      contentDisposition: 'inline',
      level: 'public',
      acl: 'public-read',
    })
    console.log('User picture uploaded successfully')
    return `${CLOUDFRONT_URL_USER_IMAGES}/public/${result.key}`
  } catch (error) {
    console.log(`Error uploading user picture: ${error}`)
    throw error
  }
}

/**
 * Check if a given URL handle exists in the user meta database. Returns true if it exists, false otherwise
 *
 * @param {string} handle User's first name
 */
export async function checkURLHandle(handle: string) {
  try {
    const result = await API.get(API_NAME, `/user/handle/${handle}`, {})
    return result.data.Count > 0
  } catch (error) {
    console.log(`Error checking URL handle`)
    throw error
  }
}

/**
 * Generate a unique URL hanlde (similar to username) based on first and last names
 *
 * @param {string} firstName User's first name
 * @param {string} lastName User's last name
 */
export async function generateUniqueURLHandle(
  firstName: string,
  lastName: string
): Promise<string> {
  const baseHandle = slugify(`${firstName}${lastName}`.replace(' ', ''))
  let handle = baseHandle
  let handleExists = true
  let attempts = 0
  const maxAttempts = 10 // Maximum number of attempts before giving up
  while (handleExists && attempts < maxAttempts) {
    const result = await checkURLHandle(handle) // Returns true if it exists, so we need to retry
    if (result) {
      const random = Math.floor(Math.random() * 10000)
      handle = `${baseHandle}${random}`
      attempts++
    } else {
      handleExists = false
    }
  }
  if (attempts === maxAttempts) {
    throw new Error(
      `Could not generate a unique username after ${maxAttempts} attempts`
    )
  }
  return handle
}
