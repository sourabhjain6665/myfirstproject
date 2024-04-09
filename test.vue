import { axios } from '@/utils/request'
import { _SERVICE_URL } from '../../config/services.config'
const USER_GROUP = _SERVICE_URL + '/user-group'

export function queryUserGroupList (params) {
  return axios({
    url: _SERVICE_URL + '/user-group/query/userGroup', // '/user-group/query/page',
    method: 'GET',
    params: params
  })
}
/**
 * query
 * @param {*} params
 */
export function queryAllUserGroup (params) {
  return axios({
    url: USER_GROUP,
    method: 'GET',
    params
  })
}
/**
 * query
 * @param {*} params
 */
export function queryUserGroup (params) {
  return axios({
    url: USER_GROUP + '/query/page',
    method: 'GET',
    params: params
  })
}
export function queryAdminUserGroup (params) {
  return axios({
    url: window.APP_SETTING.rbacServiceUrl + '/user/usergroup',
    method: 'GET',
    params: params
  })
}
export function getApplicationRoles () {
  return axios({
    url: window.APP_SETTING.rbacServiceUrl + '/user/approles',
    method: 'GET'
  })
}
export function getRolePermissions (params) {
  return axios({
    url: window.APP_SETTING.rbacServiceUrl + '/user/permissions?roles=' + encodeURI(params.roles),
    method: 'GET'
  })
}
export function getApplications () {
  return axios({
    url: window.APP_SETTING.rbacServiceUrl + '/user/applications',
    method: 'GET'
  })
}
export function adminValidation () {
  return axios({
    url: window.APP_SETTING.rbacServiceUrl + '/user/adminroles',
    method: 'GET'
  })
}

/**
 * body
 * @param {*} body
 */
export function createUserGroup (data) {
  return axios({
    url: USER_GROUP,
    method: 'POST',
    data
  })
}
export function createUserGroupForAdmin (data) {
  return axios({
    url: window.APP_SETTING.rbacServiceUrl + '/user/captureUser',
    method: 'POST',
    data
  })
}
/**
 * body
 * @param {*} body
 */
export function updateUserGroup (data) {
  return axios({
    url: USER_GROUP + `/${data.id}`,
    method: 'PUT',
    data
  })
}
export function queryByIdUserGroup (id) {
  return axios({
    url: USER_GROUP + `/${id}`,
    method: 'GET'
  })
}
export function deleteUserGroup (id) {
  return axios({
    url: USER_GROUP + `/${id}`,
    method: 'DELETE'
  })
}
export function deleteAdmin (data) {
  return axios({
    url: window.APP_SETTING.rbacServiceUrl + '/user/roles/delete',
    method: 'DELETE',
    data
  })
}
export function editAdmin (data) {
  return axios({
    url: window.APP_SETTING.rbacServiceUrl + '/user/roles/edit',
    method: 'POST',
    data
  })
}
export function freezeUserGroup (params) {
  return axios({
    url: USER_GROUP + `/${params.id}/freeze`,
    method: 'PUT',
    params
  })
}
