import axios from 'axios'
import { getToken } from '@/utils/auth'

export function upload(api, file) {
  var data = new FormData()
  data.append('file', file)
  const config = {
    headers: {
      Authorization: getToken(),
      'Content-Type': 'multipart/form-data'
    }
  }
  return axios.post(api, data, config)
}
