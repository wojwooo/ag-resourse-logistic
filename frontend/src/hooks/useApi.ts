import axios from 'axios'
import { ElNotification } from 'element-plus'
import type { KeyType } from '@ag-resourse-logistic/core'

export const useApi = () => {
  const get = async <T>(api: string, params?: any) => {
    let error
    try {
      const res = await axios.get<T>(`/api/${api}`, {
        params
      })
      return res.data
    } catch (e) {
      error = e
    }
    console.error(`Не удалось выполнить get запрос к api ${api} с параметрами`, params, error)
  }

  const post = async <T>(api: string, data?: unknown, params?: any) => {
    let error
    try {
      const res = await axios.post<T>(`/api/${api}`, data, {
        params
      })
      return res.data
    } catch (e) {
      error = e
    }
    console.error(`Не удалось выполнить post запрос к api ${api} с параметрами`, params, error)
  }

  const put = async <T>(api: string, key: KeyType, data?: unknown, params?: any) => {
    let error
    try {
      const res = await axios.put<T>(`/api/${api}/${key}`, data, {
        params
      })
      return res.data
    } catch (e) {
      error = e
    }
    console.error(
      `Не удалось выполнить put запрос к api ${api}/${key} с параметрами`,
      params,
      error
    )
  }

  const remove = async (api: string, key: KeyType) => {
    let error
    try {
      const res = await axios.delete(`/api/${api}/${key}`)
      if (res.data && res.data.message) {
        ElNotification({
          message: res.data.message,
          type: 'warning'
        })
      }
      return true
    } catch (e) {
      error = e
    }
    console.error(`Не удалось выполнить delete запрос к api ${api}/${key}`, error)
    return false
  }

  return { get, post, put, remove }
}
