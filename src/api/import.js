import request from '@/utils/request'

// 上传视频
export function uploadVideos(formData) {
  return request({
    url: 'import/videos',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
// 上传图片
export function uploadPictures(formData) {
  return request({
    url: 'import/pictures',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
