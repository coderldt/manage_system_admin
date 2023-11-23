import React, { useEffect, useState } from 'react'
import { Button, Col, Empty, Modal, Row, Table, Upload, message } from 'antd'
import { MoveModalProps, ResultAdjustProps, StudentColunm } from './type.d'

const MoveModal: React.FC<MoveModalProps> = ({ classIndex, studentIndex, tableConfig, data }) => {
  const [open, setOpen] = useState(false)
  const [moveStudent, setMoveStudent] = useState({})
  const [togetherList, setTogetherList] = useState([])

  const show = () => {
    const moveStudent = data[classIndex][studentIndex]
    const togetherIndex = moveStudent[tableConfig.togetherIndex]
    if (data[classIndex].filter())

      setOpen(true)
  }

  const close = () => {
    setOpen(false)
  }

  const handleOk = () => { }

  return (
    <>
      <Modal
        title="Title"
        width={'90vw'}
        open={open}
        onOk={handleOk}
        onCancel={close}
      >
        <div className="target-student">移动的学生{data[classIndex][studentIndex][tableConfig.nameIndex]}</div>
        <div className="desc"></div>

      </Modal>
    </>
  )
}

const ResultAdjust: React.FC<ResultAdjustProps> = ({
  tableConfig,
  result
}) => {
  const [dataCopy, setDataCopy] = useState<StudentColunm[][]>([])

  const [tableColumn, setTableColunm] = useState([
    {
      title: '姓名',
      dataIndex: String(tableConfig.nameIndex),
      key: String(tableConfig.nameIndex),
    },
    {
      title: '电话',
      dataIndex: 3,
      key: 3,
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Button onClick={() => handleMove(record)}>移动</Button>
      ),
    },
  ])

  const handleMove = (record: StudentColunm) => {
    console.log(record, 'record')

  }

  useEffect(() => {
    setDataCopy(result)
  }, [result])

  return (
    <>
      <div className="result-adjust">
        <Row gutter={20}>
          {
            dataCopy.map((item, index) => {
              return <>
                <Col xs={24} sm={24} md={12} lg={12} xl={8} key={index}>
                  <div className="class">
                    <div className="class-name">{`第${index + 1}班`}</div>
                    <div className="count">
                      <div className="total-count">总人数：{item.length}</div>
                      <div className="man-count">男生人数：{item.filter(i => i[tableConfig.sexIndex] === '男').length}</div>
                      <div className="woman-count">女生人数：{item.filter(i => i[tableConfig.sexIndex] === '女').length}</div>
                    </div>
                    <Table
                      bordered
                      columns={tableColumn}
                      dataSource={item}
                      scroll={{ y: 400 }}
                      pagination={false}
                      rowKey="id"
                    />
                  </div>
                </Col>
              </>
            })
          }
        </Row>
      </div>
    </>
  )
}

export default ResultAdjust
