const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

interface ApiErrorBody {
  code?: string
  message?: string
}

export function request<T>(
  path: string,
  options: {
    method?: UniApp.RequestOptions['method']
    data?: UniApp.RequestOptions['data']
    header?: Record<string, string>
  } = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${path}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data as T)
          return
        }

        const body = response.data as ApiErrorBody
        reject(new Error(body.message || `请求失败（${response.statusCode}）`))
      },
      fail: (error) => {
        reject(new Error(error.errMsg || '网络连接失败'))
      }
    })
  })
}

