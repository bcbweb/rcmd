import { API } from 'aws-amplify'
import { camelToSnake } from '../utils/general.js'

const API_NAME = 'blocksApi'
const PATH = '/blocks'

/**
 * Returns a specific block from table
 *
 * @param {string} id The UUID for the block
 */
export function getBlock(id: string) {
  return API.get(API_NAME, `${PATH}/object/${id}`, {})
}

/**
 * Returns a list of all blocks
 *
 * @param {string} owner Blocks will be returns for this owner
 */
export function getBlocks(owner: string) {
  return API.get(API_NAME, `${PATH}/list/${owner}`, {})
}

/**
 * Adds a new block to the database
 *
 * @param {ProfileBlock} blockObject Block object containing necessary metadata for dynamoDB
 */
export function createBlock(blockObject: ProfileBlock) {
  delete blockObject.id
  return API.put(API_NAME, PATH, {
    body: camelToSnake(blockObject),
  })
}

/**
 * Deletes a specific block from table
 *
 * @param {string} owner The owner of the block
 * @param {string} id The UUID for the block
 */
export function deleteBlock(owner: string, id: string) {
  return API.del(API_NAME, `${PATH}/object/${owner}/${id}`, {})
}

/**
 * Updates an existing block database entry
 *
 * @param {ProfileBlock} blockObject Block object containing necessary metadata for dynamoDB
 */
export function updateBlock(blockObject: ProfileBlock) {
  console.log('Update not implemented', blockObject)
  return Promise.resolve()
}
