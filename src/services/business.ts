import { API } from 'aws-amplify'
import { camelToSnake } from '../utils/general.js'

const API_NAME = 'businessApi'
const PATH = '/business'

/**
 * Returns a specific business from table
 *
 * @param {string} id The UUID for the business
 */
export function getBusiness(id: string) {
  return API.get(API_NAME, `${PATH}/object/${id}`, {})
}

/**
 * Returns a list of all businesses
 *
 * @param {string} owner businesses will be returned for this owner
 */
export function getBusinesses(owner: string) {
  return API.get(API_NAME, `${PATH}/${owner}`, {})
}

/**
 * Adds a new business to the database
 *
 * @param {Business} businessObject business object containing necessary metadata for dynamoDB
 */
export function createBusiness(businessObject: Business) {
  delete businessObject.id
  console.log('creating business')
  return API.put(API_NAME, PATH, {
    body: camelToSnake(businessObject),
  })
}

/**
 * Deletes a specific business from table
 *
 * @param {string} owner The owner of the business
 * @param {string} id The UUID for the business
 */
export function deleteBusiness(owner: string, id: string) {
  return API.del(API_NAME, `${PATH}/object/${owner}/${id}`, {})
}

/**
 * Updates an existing business database entry
 *
 * @param {Rcms} businessObject Business object containing necessary metadata for dynamoDB
 */
export function updateBusiness(businessObject: Link) {
  console.log('Update not implemented', businessObject)
  return Promise.resolve()
}
