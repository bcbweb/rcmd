import { API, Storage } from 'aws-amplify'
import { camelToSnake } from '../utils/general.js'

const VITE_CLOUDFRONT_URL_USER_IMAGES = (import.meta as any).env
  .VITE_CLOUDFRONT_URL_USER_IMAGES
const API_NAME = 'rcmdApi'
const PATH = '/rcmd'

/**
 * Returns a specific RCMD from table
 *
 * @param {string} id The UUID for the rcmd
 */
export function getRcmd(id: string) {
  return API.get(API_NAME, `${PATH}/object/${id}`, {})
}

/**
 * Returns a list of all RCMDs
 *
 * @param {string} owner RCMDs will be returned for this owner
 */
export function getRcmds(owner: string) {
  return API.get(API_NAME, `${PATH}/list/${owner}`, {})
}

/**
 * Adds a new RCMD to the database
 *
 * @param {Rcmd} rcmdObject RCMD object containing necessary metadata for dynamoDB
 */
export function createRcmd(rcmdObject: Rcmd) {
  delete rcmdObject.id // ID is auto generated by endpoint
  return API.put(API_NAME, PATH, {
    body: camelToSnake(rcmdObject),
  })
}

/**
 * Deletes a specific RCMD from table
 *
 * @param {string} owner The owner of the RCMD
 * @param {string} id The UUID for the RCMD
 */
export function deleteRcmd(owner: string, id: string) {
  return API.del(API_NAME, `${PATH}/object/${owner}/${id}`, {})
}

/**
 * Updates an existing RCMD database entry
 *
 * @param {Rcms} rcmdObject RCMD object containing necessary metadata for dynamoDB
 */
export function updateRcmd(rcmdObject: Link) {
  console.log('Update not implemented', rcmdObject)
  return Promise.resolve()
}

/**
 * Upload a user picture (profile or cover image)
 *
 * @param {File} file File to upload as picture
 */
export async function uploadPicture(file: File | undefined) {
  if (!file) return false
  try {
    const result = await Storage.put(file.name, file, {
      contentType: file.type,
      contentDisposition: 'inline',
      level: 'public',
      acl: 'public-read',
    })
    console.log('RCMD picture uploaded successfully')
    return `${VITE_CLOUDFRONT_URL_USER_IMAGES}/public/${result.key}`
  } catch (error) {
    console.log(`Error uploading RCMD picture: ${error}`)
    throw error
  }
}
