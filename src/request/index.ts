
const BASE_URL = '/api'

const apiUrl = {
  callPlan: {
    list: `${BASE_URL}/callPlaning/list`,
    detail: `${BASE_URL}/callPlaning/detail`,
    delete: `${BASE_URL}/callPlaning/delete`,
    export: `${BASE_URL}/callPlaning/export`
  },
  sys: {
    user: {
      login: `${BASE_URL}/login`,
      getUserInfo: `${BASE_URL}/getUserInfo`,
      list: `${BASE_URL}/sys/user/list`,
      add: `${BASE_URL}/sys/user/add`,
      update: `${BASE_URL}/sys/user/update`,
      detail: `${BASE_URL}/sys/user/detail`,
      delete: `${BASE_URL}/sys/user/del`,
    },
    permission: {
      list: `${BASE_URL}/sys/permission/list`,
      getListByRoleid: `${BASE_URL}/sys/permission/getListByRoleid`,
      add: `${BASE_URL}/sys/permission/add`,
      update: `${BASE_URL}/sys/permission/update`,
      detail: `${BASE_URL}/sys/permission/detail`,
      delete: `${BASE_URL}/sys/permission/del`,
    },
    role: {
      list: `${BASE_URL}/sys/role/list`,
      add: `${BASE_URL}/sys/role/add`,
      update: `${BASE_URL}/sys/role/update`,
      detail: `${BASE_URL}/sys/role/detail`,
      delete: `${BASE_URL}/sys/role/del`,
      addRoleMenus: `${BASE_URL}/sys/role/addRoleMenus`,
    }
  }
}

export default apiUrl