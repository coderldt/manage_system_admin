import { Button, Pagination, PaginationProps, Popconfirm, Space, Table, notification } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { Columns } from '@/types'
import useTable from '@/hooks/useTable'
import apiUrl from '@/request'
import Search from './search'
import type { SearchType } from './types.d'
import './index.less'

const CallPlanning = () => {
  const { data, pages, isLoading, handleSearch, handleRefrensh, handlePageChange } = useTable({ url: apiUrl.callPlan.list, method: 'post' })

  const search = (params: SearchType) => {
    const { createTime, planDate, ...param } = params
    const data = {
      ...param,
      createTimeStart: (createTime && createTime[0]) ? dayjs(createTime[0]).format('YYYY-MM-DD') : '',
      createEndStart: (createTime && createTime[1]) ? dayjs(createTime[1]).format('YYYY-MM-DD') : '',
      planStartDate: (planDate && planDate[0]) ? dayjs(planDate[0]).format('YYYY-MM-DD') : '',
      planEndDate: (planDate && planDate[1]) ? dayjs(planDate[1]).format('YYYY-MM-DD') : ''
    }
    handleSearch(data)
  }

  const reset = (params: SearchType) => {
    handleSearch(params)
  }

  const onPageChange: PaginationProps['onChange'] = (page, pageSize) => {
    handlePageChange({ page, pageSize })
  }

  const handleDetail = (record: Columns) => {
    notification.info({
      message: `点击了${record.address}项`
    })
  }

  const handleDelete = (record: Columns) => {
    notification.error({
      message: `点击了${record.address}项`
    })
    handleRefrensh()
  }

  const columns: ColumnsType<Columns> = [
    {
      key: 'name',
      title: '姓名',
      width: 200,
      dataIndex: 'name'
    },
    {
      key: 'age',
      title: '年龄',
      width: 200,
      dataIndex: 'age'
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address'
    },
    {
      key: 'address',
      title: '操作',
      width: 200,
      dataIndex: 'address',
      render: (_, record) => (
        <Space>
          <Button type='primary' onClick={() => handleDetail(record)}>详情</Button>
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
      <Search handleSearch={search} handleReset={reset} />
      <Table columns={columns} loading={isLoading} dataSource={data} pagination={false} />
      <Pagination
        current={pages.page}
        total={pages.total}
        showSizeChanger
        onChange={onPageChange}
        showQuickJumper
        showTotal={(total) => `总共 ${total} 条`}
      />
    </>
  )
}

export default CallPlanning