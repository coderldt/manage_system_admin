import React, { useState } from 'react'
import { Button, Popconfirm, Space, Table, Tag, message } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import useTable from '@/hooks/useTable'
import { Code, MenuType } from '@/enum'
import request from '@/request'
import { iconfontScriptUrl } from '@/config/iconfont'
import ajax from '@/tools/axios'
import { arrayToTree } from '@/tools'
import TemplateLayout from '@/components/templateLayout'
import type { Columns } from './types'
import Search from './search'
import EditModal from './editModal'
import './index.less'

const Iconfont = createFromIconfontCN({
  scriptUrl: iconfontScriptUrl,
})

const Permission = () => {
  const [oldList, setOldList] = useState<Columns[]>([])
  const afterRequest = (data: { list: Columns[] }) => {
    const { list, ...pages } = data
    const tree = arrayToTree({ array: list.sort((a, b) => a.sort - b.sort), pId: null, fieldNames: { label: 'menu_name', value: 'menu_id', parentId: 'parent_id' } })

    setOldList(list)

    return {
      data: tree,
      pages
    }
  }
  const { data, pages, isLoading, handleRefrensh, handlePageChange } = useTable({ url: request.sys.permission.list, method: 'post', afterRequest })

  const handleDelete = async (record: Columns) => {
    const res = await ajax.post(request.sys.permission.delete, { menu_id: record.menu_id })
    if (res.code === Code.SUCCESS) {
      message.success('删除成功')
      handleRefrensh()
    } else {
      message.error(res.msg)
    }
  }

  const refrensh = (initePage: boolean) => {
    initePage ? handlePageChange({ page: 1 }) : handleRefrensh()
  }

  const [expandedKeys, setExpandedKeys] = useState<readonly React.Key[]>([])

  const handleExpand = (type = 'all') => {
    setExpandedKeys(type === 'all' ? oldList.map(item => item.parent_id) : [])
  }

  const onExpandedRowsChange = (keys: readonly React.Key[]) => {
    setExpandedKeys(keys)
  }

  const columns: ColumnsType<Columns> = [
    {
      key: 'menu_name',
      title: '权限名称',
      dataIndex: 'menu_name'
    },
    {
      key: 'menu_type',
      title: '权限类型',
      width: 200,
      dataIndex: 'menu_type',
      render: (_, record) => (
        <Tag bordered={false} color={record.menu_type === MenuType.MENU ? '#108ee9' : '#f50'}>
          {record.menu_type === MenuType.MENU ? '菜单' : '操作'}
        </Tag>
      )
    },
    {
      key: 'menu_icon',
      title: '权限图标',
      width: 100,
      dataIndex: 'menu_icon',
      render: (_, record) => (
        record.menu_icon ? <Iconfont type={record.menu_icon} style={{ 'fontSize': '19px' }} /> : ''
      )
    },
    {
      key: 'sort',
      title: '排序',
      dataIndex: 'sort'
    },
    {
      key: 'address',
      title: '操作',
      width: 200,
      dataIndex: 'address',
      render: (_, record) => (
        <Space>
          <EditModal mode='addSub' data={record} list={data} refrensh={refrensh} />
          <EditModal mode='edit' data={record} list={data} refrensh={refrensh} />
          <EditModal mode='detail' data={record} list={data} refrensh={refrensh} />
          <Popconfirm
            title="是否删除该项"
            onConfirm={() => handleDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    }
  ]

  return (
    <>
      <TemplateLayout
        Search={
          <>
            <Search handleExpand={handleExpand} />
          </>
        }
        TableRight={
          <EditModal mode='add' list={data} refrensh={refrensh} />
        }
        Table={
          <>
            <Table columns={columns} expandable={{ expandedRowKeys: expandedKeys, onExpandedRowsChange: onExpandedRowsChange }} loading={isLoading} dataSource={data} pagination={false} rowKey="menu_id" />
            <div className='total'>{`总共 ${pages.total} 条`}</div>
          </>
        }
      />
    </>
  )
}

export default Permission