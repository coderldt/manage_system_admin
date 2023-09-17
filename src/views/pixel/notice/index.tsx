import { Button, Popconfirm, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import useTable from '@/hooks/useTable'
import { Code, Status } from '@/enum'
import request from '@/request'
import ajax from '@/tools/axios'
import TemplateLayout from '@/components/templateLayout'
import type { Columns } from './types'
import Search from './search'
import EditModal from './editModal'
import './index.less'
import { niticeLabelType } from '@/enum/pixel'

const PixelNotice = () => {
  // const [oldList, setOldList] = useState<Columns[]>([])
  // const afterRequest = (data: { list: Columns[] }) => {
  //   const { list, ...pages } = data
  //   const tree = arrayToTree({ array: list.sort((a, b) => a.sort - b.sort), pId: null, fieldNames: { label: 'menu_name', value: 'menu_id', parentId: 'parent_id' } })

  //   setOldList(list)

  //   return {
  //     data: tree,
  //     pages
  //   }
  // }
  const { data, isLoading, handleSearch, handleRefrensh, handlePageChange } = useTable({ url: request.pixel.notice.list, method: 'post' })

  const handleDelete = async (record: Columns) => {
    const res = await ajax.post(request.pixel.notice.del, { notice_id: record.notice_id })
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
      key: 'notice_title',
      title: '通知内容',
      dataIndex: 'notice_title'
    },
    {
      key: 'notice_type',
      title: '通知类型',
      width: 200,
      dataIndex: 'notice_type',
      render: (_, record) => (
        <span>
          {niticeLabelType[record.notice_type]}
        </span>
      )
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
            <Search handleSearch={handleSearch} handleReset={handleSearch} />
          </>
        }
        TableRight={
          <EditModal mode='add' list={data} refrensh={refrensh} />
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