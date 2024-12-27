import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { SecureStorage } from '@/lib/core/secureStorage'
import { SessionManager } from '@/lib/core/sessionManager'
import { RateLimiter } from '@/lib/core/rateLimiter'
import { toast } from 'sonner'
import { apiConfig } from '@/config'
import type { ApiResponse, ExtendedAxiosRequestConfig } from './client'

interface RefreshTokenResponse {
  token: string
  expiresIn: number
}

interface ErrorResponse {
  message: string
  code?: string
  details?: unknown
}

export function setupInterceptors(axiosInstance: AxiosInstance) {
  let isRefreshing = false
  const refreshSubscribers: ((token: string) => void)[] = []

  const handleRefreshToken = async (originalRequest: ExtendedAxiosRequestConfig) => {
    try {
      const { data } = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>(
        apiConfig.endpoints.auth.refresh
      )
      
      SecureStorage.setItem('token', data.data.token)
      refreshSubscribers.forEach((callback) => callback(data.data.token))
      refreshSubscribers.length = 0 // Clear array
      
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.data.token}`
      }
      return axiosInstance(originalRequest)
    } catch (error) {
      SecureStorage.clear()
      SessionManager.getInstance().emit('session_expired')
      window.location.href = apiConfig.endpoints.auth.login
      return Promise.reject(error)
    }
  }

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = SecureStorage.getItem<string>('token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      const endpoint = config.url || ''
      if (!RateLimiter.checkRateLimit(endpoint)) {
        return Promise.reject(new Error('Too many requests. Please try again later.'))
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorResponse>) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig

      if (!originalRequest) {
        return Promise.reject(error)
      }

      // Handle token expiration
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshSubscribers.push((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              resolve(axiosInstance(originalRequest))
            })
          })
        }

        isRefreshing = true
        originalRequest._retry = true

        try {
          return await handleRefreshToken(originalRequest)
        } finally {
          isRefreshing = false
        }
      }

      // Handle rate limiting
      if (error.response?.status === 429) {
        const retryAfter = parseInt(error.response.headers['retry-after'] || '60', 10)
        toast.error(`Too many requests. Please try again in ${retryAfter} seconds.`)
      }

      // Handle other errors
      const message = error.response?.data?.message || error.message
      toast.error('Error', { description: message })
      
      return Promise.reject(error)
    }
  )
}