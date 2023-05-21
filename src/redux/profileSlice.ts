import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { snakeToCamel } from '../utils/general.js'

type ProfileState = {
  blocks: ProfileBlock[] | null
  links: Link[] | null
  rcmds: Rcmd[] | null
  activeRole: string | null
}
const initialState: ProfileState = {
  blocks: null,
  links: null,
  rcmds: null,
  activeRole: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setBlocks(state: ProfileState, action: PayloadAction<ProfileBlock[]>) {
      if (!action.payload) return
      state.blocks = action.payload
    },
    addBlock(state: ProfileState, action: PayloadAction<ProfileBlock>) {
      if (!action.payload) return
      state.blocks?.push(action.payload)
    },
    removeBlock(state: ProfileState, action: PayloadAction<string>) {
      if (!action.payload) return
      const newBlocks = state.blocks?.filter(
        (block) => block.id !== action.payload
      ) as ProfileBlock[]
      state.blocks = newBlocks
    },
    setLinks(state: ProfileState, action: PayloadAction<Link[]>) {
      if (!action.payload) return
      state.links = action.payload
    },
    addLink(state: ProfileState, action: PayloadAction<Link>) {
      if (!action.payload) return
      state.links?.push(action.payload)
    },
    removeLink(state: ProfileState, action: PayloadAction<string>) {
      if (!action.payload) return
      const newLinks = state.links?.filter(
        (link) => link.id !== action.payload
      ) as Link[]
      state.links = newLinks
    },
    setRcmds(state: ProfileState, action: PayloadAction<Rcmd[]>) {
      if (!action.payload) return
      state.rcmds = snakeToCamel(action.payload)
    },
    addRcmd(state: ProfileState, action: PayloadAction<Rcmd>) {
      if (!action.payload) return
      state.rcmds?.push(action.payload)
    },
    removeRcmd(state: ProfileState, action: PayloadAction<string>) {
      if (!action.payload) return
      const newRcmds = state.rcmds?.filter(
        (rcmd) => rcmd.id !== action.payload
      ) as Rcmd[]
      state.rcmds = newRcmds
    },
    setActiveRole(state: ProfileState, action: PayloadAction<string>) {
      if (!action.payload) return
      state.activeRole = action.payload
    },
  },
})

export const {
  setBlocks,
  addBlock,
  removeBlock,
  setLinks,
  addLink,
  removeLink,
  setRcmds,
  addRcmd,
  removeRcmd,
  setActiveRole,
} = profileSlice.actions
export default profileSlice.reducer
export type { ProfileState }
