import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type HomepageState = {
  users: User[] | null
}
const initialState: HomepageState = {
  users: null,
}

const homepageSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUsers(state: HomepageState, action: PayloadAction<User[]>) {
      if (!action.payload) return
      state.users = action.payload
    },
  },
})

export const { setUsers } = homepageSlice.actions
export default homepageSlice.reducer
export type { HomepageState }
