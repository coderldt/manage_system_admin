import { configureStore } from '@reduxjs/toolkit'
import info from './reducer/info'

const store = configureStore({
  reducer: {
    info
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store