import { API } from 'aws-amplify'
import { camelToSnake } from '../utils/general.js'

const API_NAME = 'contentCreatorApi'
const PATH = '/contentCreator'

/**
 * Returns a specific content creator from table
 *
 * @param {string} id The UUID for the content creator
 */
export function getContentCreator(id: string) {
  return API.get(API_NAME, `${PATH}/object/${id}`, {})
}

/**
 * Returns a list of all content creators
 *
 * @param {string} owner content creators will be returned for this owner
 */
export function getContentCreators(owner: string) {
  return API.get(API_NAME, `${PATH}/${owner}`, {})
}

/**
 * Adds a new content creator to the database
 *
 * @param {ContentCreator} contentCreatorObject content creator object containing necessary metadata for dynamoDB
 */
export function createContentCreator(contentCreatorObject: ContentCreator) {
  delete contentCreatorObject.id
  console.log('creating content creator')
  return API.put(API_NAME, PATH, {
    body: camelToSnake(contentCreatorObject),
  })
}

/**
 * Deletes a specific content creator from table
 *
 * @param {string} owner The owner of the content creator
 * @param {string} id The UUID for the content creator
 */
export function deleteContentCreator(owner: string, id: string) {
  return API.del(API_NAME, `${PATH}/object/${owner}/${id}`, {})
}

/**
 * Updates an existing content creator database entry
 *
 * @param {Rcms} contentCreatorObject Content creator object containing necessary metadata for dynamoDB
 */
export function updateContentCreator(contentCreatorObject: Link) {
  console.log('Update not implemented', contentCreatorObject)
  return Promise.resolve()
}
