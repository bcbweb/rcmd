import { Auth } from 'aws-amplify'
import notify from '../utils/notify.js'
import { updateLocalStorage } from '../utils/general.js'

/**
 * Create a new user in cognito
 *
 * @param {User} userObject User object containing necessary data for Cognito
 */
export async function signUp(userObject: User) {
  try {
    // Create cognito user
    const { user } = (await Auth.signUp({
      username: userObject.username,
      password: userObject.password,
      autoSignIn: {
        enabled: true,
      },
    })) as any // AWS Amplify types are incorrect
    updateLocalStorage('token', user.signInUserSession.idToken.jwtToken)
    console.log('Created user in cognito', user)
    return user
  } catch (error) {
    notify('Error creating user', 'warning', 'exclamation-triangle')
    console.error(`Error creating user: ${error}`)
    throw error
  }
}

/**
 * Resend the code required to confirm a user
 *
 * @param {string} username Corresponding username
 */
export async function resendConfirmationCode(username: string) {
  try {
    const result = await Auth.resendSignUp(username)
    console.log(`Code resent successfully: ${result}`)
    return result
  } catch (error) {
    notify('Error resending code', 'warning', 'exclamation-triangle')
    console.error('Error resending code: ', error)
    throw error
  }
}

/**
 * Confirm a user's registration with the confirmation code
 *
 * @param {string} username Corresponding username
 * @param {string} code Confirmation code
 */
export async function confirmSignUp(username: string, code: string) {
  let result
  try {
    result = await Auth.confirmSignUp(username, code, {
      forceAliasCreation: false,
    })
  } catch (error) {
    notify('Error confirming sign up', 'warning', 'exclamation-triangle')
    console.error('Error confirming sign up', error)
    throw error
  }
  return result
}

/**
 * Sign a user in
 *
 * @param {string} username Username
 * @param {string} password Password
 */
export async function signIn(username: string, password: string) {
  try {
    const user = await Auth.signIn(username, password)
    updateLocalStorage('token', user.signInUserSession.idToken.jwtToken)
    return user
  } catch (error) {
    notify('Error signing in.', 'warning', 'exclamation-triangle')
    console.error(`Error signing in: ${error}`)
    throw error
  }
}

/**
 * Sign a user out
 *
 */
export async function signOut() {
  try {
    await Auth.signOut()
    updateLocalStorage('token', null)
    return true
  } catch (error) {
    notify('Error signing out.', 'warning', 'exclamation-triangle')
    console.error(`Error signing out: ${error}`)
    throw error
  }
}

/**
 * Retrieve current cognito user
 *
 */
export async function getCognitoUser() {
  try {
    const cognitoUser = await Auth.currentAuthenticatedUser()
    if (!cognitoUser) {
      console.error('No cognito user')
      return
    }
    return cognitoUser
  } catch (error) {
    notify('Error retrieving cognito user', 'warning', 'exclamation-triangle')
    console.error(`Error retrieving cognito user: ${error}`)
    throw error
  }
}

/**
 * Retrieve current user's session
 *
 */
export async function getSession() {
  const session = await Auth.currentSession()
  if (!session) {
    console.error('No session found')
    return false
  }
  return session as any
}
