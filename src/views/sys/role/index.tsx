import { useState } from 'react'
import { Button, Col, Input, Popconfirm, Row, Tree, message } from 'antd'
import useTable from '@/hooks/useTable'
import ajax from '@/tools/axios'
import request from '@/request'
import { Code } from '@/enum'
import EditModal from './editModal'
import Roles from './roles'
import type { Columns } from './types'
import './index.less'

const { Search } = Input

const Role = () => {
  const [currentRole, setCurrentRole] = useState<string | number>('')
  const { data, handleRefrensh } = useTable<any>({ url: request.sys.role.list, method: 'post', isPages: false })

  const handleDelete = async (record: Columns) => {
    const res = await ajax.post(request.sys.role.delete, { role_id: record.role_id })
    if (res.code === Code.SUCCESS) {
      message.success('删除成功')
      setCurrentRole('')
      handleRefrensh()
    } else {
      message.error(res.msg)
    }
  }

  const refrensh = () => {
    handleRefrensh()
  }

  const handleClick = (node: Columns) => {
    setCurrentRole(node.role_id)
  }

  return (
    <>
      <div className='role'>
        <Row gutter={16}>
          <Col className="gutter-row" span={10}>
            <div className='role-list'>
              <Search style={{ marginBottom: 8 }} placeholder="Search" />
              <div className='role-right'>
                <EditModal mode='add' refrensh={refrensh} />
              </div>
              <div className="role-tree-list">
                <Tree
                  fieldNames={{ title: 'role_name', key: 'role_id', children: 'children' }}
                  blockNode={true}
                  treeData={data}
                  selectable={false}
                  titleRender={(nodeData) =>
                    <>
                      <div className='role-item'>
                        <div className={`role-name ${currentRole === nodeData.role_id ? 'role_name_active' : ''}`} onClick={() => handleClick(nodeData)}>{nodeData.role_name}</div>
                        <EditModal mode='edit' btnProps={{ type: 'text' }} data={nodeData} refrensh={refrensh} />
                        <Popconfirm
                          title="是否删除该项"
                          onConfirm={() => handleDelete(nodeData)}
                          okText="确认"
                          cancelText="取消"
                        >
                          <Button danger type='text'>删除</Button>
                        </Popconfirm>
                      </div>
                    </>
                  }
                />
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={12}>
            <Roles role_id={currentRole} />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Role