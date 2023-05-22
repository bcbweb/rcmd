import { Auth } from 'aws-amplify'

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
    console.log('Created user in cognito', user)
    return user
  } catch (error) {
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
    return await Auth.signIn(username, password)
  } catch (error) {
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
    return await Auth.signOut()
  } catch (error) {
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
    console.error(`Error retrieving cognito user: ${error}`)
    throw error
  }
}

/**
 * Retrieve current user's session
 *
 */
export async function getSession() {
  try {
    const session = await Auth.currentSession()
    return session as any
  } catch (error) {
    console.error('Error retrieving session', error)
    throw error
  }
}
