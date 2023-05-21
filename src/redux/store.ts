import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import profileReducer from './profileSlice'
import homepageReducer from './homepageSlice'
import { pokemonApi } from '../services/pokemon.js'

const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    homepage: homepageReducer,
    pokemonApi: pokemonApi.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export default store
