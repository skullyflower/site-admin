import { ApiResponse } from '../../shared/types'

export const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data })
export const okMessage = (message: string): ApiResponse => ({ success: true, message })
export const fail = (message: string): ApiResponse => ({ success: false, message })
