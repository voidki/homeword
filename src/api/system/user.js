import request from '@/utils/request'
// 查询用户列表
export function listUser(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}
// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/user/' + userId,
    method: 'get'
  })
}



// 用户密码重置
export function resetUserPwd(password) {
  const data = {
    password
  }
  return request({
    url: '/user/resetPassword',
    headers: {
      isToken: true
    },
    method: 'put',
    data: data
  })
}
// 用户旧密码验证
export function verifyPwd(password) {
  const data = {
    password
  }
  return request({
    url: '/user/verify',
    headers: {
      isToken: true
    },
    method: 'post',
    data: data
  })
}
// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/user/changeStatus',
    method: 'put',
    data: data
  })
}
