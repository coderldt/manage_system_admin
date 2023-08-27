import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Info } from '@/types/info'
import ajax from '@/tools/axios'
import request from '@/request'
import { Code } from '@/enum'

const initialState = {
  info: {}
} as { info: Info }

export const getInfo = createAsyncThunk('info/getInfo', async () => {
  const res = await ajax.post<Info>(request.sys.user.getUserInfo, { id: 123 })
  if (res && res.code === Code.SUCCESS) {
    return res.data
  }
  return {}
})

const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInfo.fulfilled, (state, action) => {
        state.info = action.payload as Info
      })
  },
})

// export const { } = infoSlice.actions

export default infoSlice.reducer
