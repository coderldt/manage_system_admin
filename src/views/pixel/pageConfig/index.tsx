import { Button, Popconfirm, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import useTable from '@/hooks/useTable'
import { Code, Status } from '@/enum'
import request from '@/request'
import ajax from '@/tools/axios'
import TemplateLayout from '@/components/templateLayout'
import type { Columns } from './types'
import Search from './search'
import './index.less'

const PixelNotice = () => {
  const { data, isLoading, handleSearch, handleRefrensh } = useTable({ url: request.pixel.pageConfig.list, method: 'post' })

  const handleChangeStatus = async (record: Columns) => {
    const res = await ajax.post(request.pixel.pageConfig.changeStatus, {
      page_id: record.page_id,
      status: record.status === Status.DISABLE ? Status.ENABLE : Status.DISABLE
    })
    if (res.code === Code.SUCCESS) {
      message.success('状态修改成功')
      handleRefrensh()
    } else {
      message.error(res.msg)
    }
  }

  const columns: ColumnsType<Columns> = [
    {
      key: 'page_title',
      title: '页面标题',
      dataIndex: 'page_title'
    },
    {
      key: 'page_router',
      title: '页面路由',
      width: 200,
      dataIndex: 'page_router',
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: (_, record) => (
        record.status === Status.ENABLE ? '开启' : '关闭'
      )
    },
    {
      key: 'address',
      title: '操作',
      width: 200,
      dataIndex: 'address',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="是否变更状态"
            onConfirm={() => handleChangeStatus(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button danger>变更状态</Button>
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
            <Search handleSearch={handleSearch} handleReset={handleSearch} />
          </>
        }
        Table={
          <>
            <Table columns={columns} loading={isLoading} dataSource={data} pagination={false} rowKey="menu_id" />
          </>
        }
      />
    </>
  )
}

export default PixelNotice