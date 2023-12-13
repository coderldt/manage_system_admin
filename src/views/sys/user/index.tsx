import { Button, Pagination, PaginationProps, Popconfirm, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import useTable from '@/hooks/useTable'
import apiUrl from '@/request'
import TemplateLayout from '@/components/templateLayout'
import ajax from '@/tools/axios'
import request from '@/request'
import { Code } from '@/enum'
import Search from './search'
import EditModal from './editModal'
import './index.less'
import type { Columns } from './types'

const User = () => {
  const { data, pages, isLoading, handleSearch, handleRefrensh, handlePageChange } = useTable<Columns>({ url: apiUrl.sys.user.list, method: 'post' })

  const onPageChange: PaginationProps['onChange'] = (page, pageSize) => {
    handlePageChange({ page, pageSize })
  }

  const handleDelete = async (record: Columns) => {
    const res = await ajax.post(request.sys.user.delete, { user_id: record.user_id })
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

  const columns: ColumnsType<Columns> = [
    {
      key: 'username',
      title: '姓名',
      dataIndex: 'username'
    },
    {
      key: 'phone',
      title: '电话',
      width: 200,
      dataIndex: 'phone'
    },
    {
      key: 'address',
      title: '操作',
      width: 200,
      dataIndex: 'address',
      render: (_, record) => (
        <Space>
          <EditModal mode='detail' data={record} refrensh={refrensh} />
          <EditModal mode='edit' data={record} refrensh={refrensh} />
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
        Search={<Search handleSearch={handleSearch} handleReset={handleSearch} />}
        TableRight={
          <EditModal mode='add' refrensh={refrensh} />
        }
        Table={
          <>
            <Table columns={columns} loading={isLoading} dataSource={data} pagination={false} rowKey="user_id" />
            <Pagination
              current={pages.page}
              total={pages.total}
              showSizeChanger
              onChange={onPageChange}
              showQuickJumper
              showTotal={(total) => `总共 ${total} 条`}
            />
          </>
        }
      />
    </>
  )
}

export default User