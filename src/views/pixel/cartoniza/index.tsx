import { useEffect, useState } from 'react'
import { Pagination, PaginationProps, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import useTable, { Props } from '@/hooks/useTable'
import apiUrl from '@/request'
import TemplateLayout from '@/components/templateLayout'
import ajax from '@/tools/axios'
import request from '@/request'
import { Code, Status } from '@/enum'
import { CommonTableListRes } from '@/types'
import Search from './search'
import EditModal from './editModal'
import EditFirstImgModal from './editFirstImgModal'
import EditSecondImgModal from './editSecondImgModal'
import './index.less'
import type { Columns } from './types'

const User = () => {
  const [imgTypeDict, setImgTypeDict] = useState<Columns[]>([])
  useEffect(() => {
    ajax.post<Columns[]>(request.pixel.cartoniza.getFirstList).then(res => {
      if (res.code === Code.SUCCESS) {
        setImgTypeDict(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  const useTableProps: Props<Columns> = {
    url: apiUrl.pixel.cartoniza.list,
    method: 'post',
    afterRequest: (res: CommonTableListRes<Columns>) => {
      const { list, ...pages } = res
      const sortList = list.sort((a, b) => a.sort - b.sort)
      let finalData: Columns[] = sortList.filter(i => i.parentId === '0').map(i => ({ ...i, children: [] }))

      if (finalData.length) {
        sortList.filter(i => i.parentId !== '0').forEach(i => {
          const detail = finalData.find(data => data.typeId === i.parentId)
          if (detail && detail.children) {
            detail.children.push(i)
          }
        })
      } else {
        finalData = sortList
      }
      return {
        pages: pages || { page: 1, pageSize: 10, total: 0 },
        data: finalData
      }
    }
  }
  const { data, pages, isLoading, handleSearch, handleRefrensh, handlePageChange } = useTable<Columns>(useTableProps)

  const onPageChange: PaginationProps['onChange'] = (page, pageSize) => {
    handlePageChange({ page, pageSize })
  }

  const refrensh = (initePage: boolean) => {
    initePage ? handlePageChange({ page: 1 }) : handleRefrensh()
  }

  const columns: ColumnsType<Columns> = [
    {
      key: 'label',
      title: '名称',
      dataIndex: 'label'
    },
    {
      key: 'value',
      title: '值',
      width: 100,
      dataIndex: 'value'
    },
    {
      key: 'sort',
      title: '排序',
      width: 100,
      dataIndex: 'sort'
    },
    {
      key: 'isRecommend',
      title: '是否推荐',
      width: 100,
      dataIndex: 'isRecommend',
      render: (val) => <div>{ val === '1' ? '推荐' : '' }</div>
    },
    {
      key: 'status',
      title: '是否上架',
      width: 100,
      dataIndex: 'status',
      render: (val) => <div>{ val === Status.ENABLE ? '上架' : '下架' }</div>
    },
    {
      key: 'imgUrl',
      title: '原/效果 图',
      width: 200,
      dataIndex: 'imgUrl',
      render: (val) => val && <img src={val} alt="avatar" style={{ width: '200px', height: '50px', objectFit: 'contain' }} />
    },
    {
      key: 'address',
      title: '操作',
      width: 300,
      dataIndex: 'address',
      render: (_, record) => (
        <Space>
          {
            record.parentId !== '0' && (<>
              <EditModal mode='detail' imgTypeDict={imgTypeDict} data={record} refrensh={refrensh} />
              <EditModal mode='edit' imgTypeDict={imgTypeDict} data={record} refrensh={refrensh} />
            </>)
          }
          {
            record.parentId === '0'
              ? <EditFirstImgModal data={record} refrensh={refrensh} />
              : <EditSecondImgModal data={record} refrensh={refrensh}/>
          }
        </Space>
      ),
    }
  ]

  return (
    <>
      <TemplateLayout
        Search={<Search imgTypeDict={imgTypeDict} handleSearch={handleSearch} handleReset={handleSearch} />}
        TableRight={
          <EditModal imgTypeDict={imgTypeDict} mode='add' refrensh={refrensh} />
        }
        Table={
          <>
            <Table bordered columns={columns} loading={isLoading} dataSource={data} pagination={false} rowKey="typeId" />
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