import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UserState = {
  email: string | null
  firstName: string | null
  lastName: string | null
  urlHandle: string | null
  profilePicture: string | null
  dateOfBirth: string | null
  gender: string | null
  locale: string | null
  timeZone: string | null
  coverPicture: string | null
  roles: Array<string> | null
  tags: Array<string> | null
  interests: Array<string> | null
  profileBlocks: ProfileBlock[] | null
  onboardingComplete: boolean | null
}

const initialState: UserState = {
  email: null,
  firstName: null,
  lastName: null,
  urlHandle: null,
  profilePicture: null,
  dateOfBirth: null,
  gender: null,
  locale: null,
  timeZone: null,
  coverPicture: null,
  roles: null,
  tags: null,
  interests: null,
  profileBlocks: null,
  onboardingComplete: null,
}

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail(state: UserState, action: PayloadAction<string | null>) {
      state.email = action.payload
    },
    setFirstName(state: UserState, action: PayloadAction<string | null>) {
      state.firstName = action.payload
    },
    setLastName(state: UserState, action: PayloadAction<string | null>) {
      state.lastName = action.payload
    },
    setUrlHandle(state: UserState, action: PayloadAction<string | null>) {
      state.urlHandle = action.payload
    },
    setProfilePicture(state: UserState, action: PayloadAction<string | null>) {
      state.profilePicture = action.payload
    },
    setDateOfBirth(state: UserState, action: PayloadAction<string | null>) {
      state.dateOfBirth = action.payload
    },
    setGender(state: UserState, action: PayloadAction<string | null>) {
      state.gender = action.payload
    },
    setLocale(state: UserState, action: PayloadAction<string | null>) {
      state.locale = action.payload
    },
    setTimeZone(state: UserState, action: PayloadAction<string | null>) {
      state.timeZone = action.payload
    },
    setCoverPicture(state: UserState, action: PayloadAction<string | null>) {
      state.coverPicture = action.payload
    },
    setRoles(state: UserState, action: PayloadAction<Array<string> | null>) {
      state.roles = action.payload
    },
    setTags(state: UserState, action: PayloadAction<Array<string> | null>) {
      if (!action.payload) return
      state.tags = Object.values(action.payload)
    },
    setInterests(
      state: UserState,
      action: PayloadAction<Array<string> | null>
    ) {
      if (!action.payload) return
      state.interests = Object.values(action.payload)
    },
    setProfileBlocks(
      state: UserState,
      action: PayloadAction<ProfileBlock[] | null>
    ) {
      if (!action.payload) return
      state.profileBlocks = action.payload
    },
    setOnboardingComplete(
      state: UserState,
      action: PayloadAction<boolean | null>
    ) {
      state.onboardingComplete = action.payload
    },
    unsetUser(state: UserState) {
      state.email = null
      state.firstName = null
      state.lastName = null
      state.urlHandle = null
      state.profilePicture = null
      state.dateOfBirth = null
      state.gender = null
      state.locale = null
      state.timeZone = null
      state.coverPicture = null
      state.roles = null
      state.tags = null
      state.interests = null
      state.profileBlocks = null
      state.onboardingComplete = null
    },
  },
})

export const {
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
  unsetUser,
} = userSlice.actions
export default userSlice.reducer
export type { UserState }
