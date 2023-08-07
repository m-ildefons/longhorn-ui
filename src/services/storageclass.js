import { request } from '../utils'

export async function listStorageClasses() {
  return request({
    url: '/v1/storageclasses',
    method: 'get',
  })
}

export async function getStorageClass(name) {
  return request({
    url: `/v1/storageclasses/${name}`,
    method: 'get',
  })
}

export async function createStorageClass(params) {
  return request({
    url: '/v1/storageclasses',
    method: 'post',
    data: params,
  })
}

export async function deleteStorageClass(params) {
  if (params.name) {
    return request({
      url: `/v1/storageclasses/${params.name}`,
      method: 'delete',
    })
  }
}
