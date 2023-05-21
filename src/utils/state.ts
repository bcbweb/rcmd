import store from '../redux/store.js'
import { getUserMeta } from '../services/user.js'
import { getSession } from '../services/auth.js'
import {
  setEmail,
  setFirstName,
  setLastName,
  setUrlHandle,
  setProfilePicture,
  setDateOfBirth,
  setGender,
  setLocale,
  setTimeZone,
  setCoverPicture,
  setRoles,
  setTags,
  setInterests,
  setProfileBlocks,
  setOnboardingComplete,
} from '../redux/userSlice.js'

/**
 * Set a user in the Redux store
 *
 */
export async function setUser(user?: UserMeta) {
  const session = await getSession()
  if (!session) {
    console.error('Error retrieving user session')
    return
  }
  let userMeta = user || (await getUserMeta(session.idToken.payload.email))
  store.dispatch(setEmail(session.idToken.payload.email))
  store.dispatch(setFirstName(userMeta.first_name))
  store.dispatch(setLastName(userMeta.last_name))
  store.dispatch(setUrlHandle(userMeta.url_handle))
  store.dispatch(setProfilePicture(userMeta.profile_picture))
  store.dispatch(setDateOfBirth(userMeta.date_of_birth))
  store.dispatch(setGender(userMeta.gender))
  store.dispatch(setLocale(userMeta.locale))
  store.dispatch(setTimeZone(userMeta.time_zone))
  store.dispatch(setCoverPicture(userMeta.cover_picture))
  store.dispatch(setRoles(Object.values(userMeta.roles || {})))
  store.dispatch(setTags(Object.values(userMeta.tags || {})))
  store.dispatch(setInterests(Object.values(userMeta.interests || {})))
  store.dispatch(setProfileBlocks(Object.values(userMeta.profile_blocks || {})))
  store.dispatch(setOnboardingComplete(userMeta.onboarding_complete))
  console.log(store.getState())
  return Promise.resolve()
}
