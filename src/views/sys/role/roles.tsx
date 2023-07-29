import React, { useEffect, useState } from 'react'
import ajax from '@/tools/axios'
import request from '@/request'
import { Code } from '@/enum'
import { Button, Tree, message } from 'antd'
import { arrayToTree } from '@/tools'
import { CommonTableListRes } from '@/types'
import type { Columns } from '@/views/sys/permission/types'
import type { DataNode } from 'antd/es/tree'

interface Props {
  role_id?: string | number
}

interface Permission extends DataNode {
  menu_name: string,
  menu_id: string,
  children: Permission[]
}

const RolesTree: React.FC<Props> = ({ role_id }) => {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermission, setRolePermission] = useState<React.Key[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])

  const getPermission = async () => {
    const res = await ajax.post<CommonTableListRes<Columns>>(request.sys.permission.list, {})
    if (res.code === Code.SUCCESS) {
      setExpandedKeys(res.data.list.map((item) => item.parent_id) || [])
      const tree = arrayToTree({ array: res.data.list, pId: null, fieldNames: { label: 'menu_name', value: 'menu_id', parentId: 'parent_id' } })
      setPermissions(tree)
    }
  }

  const getPermissionByRoleId = async (role_id: string | number) => {
    const res = await ajax.post<CommonTableListRes<Columns>>(request.sys.permission.getListByRoleid, { role_id })
    if (res.code === Code.SUCCESS) {
      setRolePermission(res.data.list.map((role) => role.menu_id))
    }
  }

  useEffect(() => {
    getPermission()
  }, [])

  useEffect(() => {
    if (role_id) {
      getPermissionByRoleId(role_id)
    } else {
      setRolePermission([])
    }
  }, [role_id])

  const handleSave = async () => {
    if (!role_id) return
    const res = await ajax.post(request.sys.role.addRoleMenus, { role_id, permission: rolePermission })
    if (res.code === Code.SUCCESS) {
      message.success('保存成功')
    } else {
      message.error(res.msg)
    }
  }

  const onCheck = (checkedKeys: {
    checked: React.Key[]
    halfChecked: React.Key[]
  }) => {
    setRolePermission(checkedKeys.checked)
  }

  const onExpand = (keys: React.Key[]) => {
    setExpandedKeys(keys)
  }

  return (
    <>
      <Button type='primary' disabled={!role_id} onClick={handleSave}>保存</Button>
      <Tree
        checkable
        defaultExpandAll
        checkStrictly={true}
        checkedKeys={rolePermission}
        expandedKeys={expandedKeys}
        treeData={permissions}
        fieldNames={{ title: 'menu_name', key: 'menu_id', children: 'children' }}
        onCheck={onCheck}
        onExpand={onExpand}
      />
    </>
  )
}

export default RolesTree