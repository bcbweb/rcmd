import { API } from 'aws-amplify'
import { camelToSnake } from '../utils/general.js'

const API_NAME = 'linkApi'
const PATH = '/link'

/**
 * Returns a specific link from table
 *
 * @param {string} id The UUID for the link
 */
export function getLink(id: string) {
  return API.get(API_NAME, `${PATH}/object/${id}`, {})
}

/**
 * Returns a list of all links
 *
 * @param {string} owner Links will be returns for this owner
 */
export function getLinks(owner: string) {
  return API.get(API_NAME, `${PATH}/list/${owner}`, {})
}

/**
 * Adds a new link to the database
 *
 * @param {Link} linkObject Link object containing necessary metadata for dynamoDB
 */
export function createLink(linkObject: Link) {
  delete linkObject.id
  return API.put(API_NAME, PATH, {
    body: camelToSnake(linkObject),
  })
}

/**
 * Deletes a specific link from table
 *
 * @param {string} owner The owner of the link
 * @param {string} id The UUID for the link
 */
export function deleteLink(owner: string, id: string) {
  return API.del(API_NAME, `${PATH}/object/${owner}/${id}`, {})
}

/**
 * Updates an existing link database entry
 *
 * @param {Link} linkObject Link object containing necessary metadata for dynamoDB
 */
export function updateLink(linkObject: Link) {
  console.log('Update not implemented', linkObject)
  return Promise.resolve()
}
