import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'

export const useAppDispath: () => AppDispatch = useDispatch
export const useAppState: TypedUseSelectorHook<RootState> = useSelector
