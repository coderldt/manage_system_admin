import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Radio, Row, Select, Table, message } from 'antd'
import { MoveModalProps, ResultAdjustProps, XlsxData } from '../type.d'
import { writeXlsx } from '../tool'
const { Column } = Table

const MoveForm: React.FC<MoveModalProps> = (params) => {
  const { student, tableConfig, students, otherClass } = params
  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item
          label="移动学生"
        >
          {
            `${student[tableConfig.nameIndex]}-${student[tableConfig.sexIndex]}`
          }
        </Form.Item>

        <Form.Item
          label="相关联(在一班)学生"
        >
          <Table
            bordered
            dataSource={students.filter(i => i.student_id !== student.student_id)}
            scroll={{ y: 400 }}
            pagination={false}
            rowKey="student_id"
          >
            <Column title="姓名" dataIndex={tableConfig.nameIndex} key={tableConfig.nameIndex} />
            <Column title="性别" dataIndex={tableConfig.sexIndex} key={tableConfig.sexIndex} />
            <Column
              title="是否一起转移"
              dataIndex="x"
              key="x"
              render={(_, record: XlsxData & { isMove: '1' | '0' }) => (
                <>
                  <Radio.Group defaultValue='1' onChange={(e) => { record.isMove = e.target.value }}>
                    <Radio value="1"> 是 </Radio>
                    <Radio value="0"> 否 </Radio>
                  </Radio.Group>
                </>
              )}
            />
          </Table>
        </Form.Item>

        <Form.Item
          label="转移班级"
        >
          <Select
            defaultValue=""
            onChange={(val) => { params.targetClass = Number(val) }}
            options={otherClass.map(i => ({ value: i, label: i }))}
          />
        </Form.Item>
      </Form>
    </>
  )
}

const ResultAdjust: React.FC<ResultAdjustProps> = ({
  tableConfig,
  exportColumns,
  result
}) => {
  const [dataCopy, setDataCopy] = useState<XlsxData[][]>([])

  function findClassByStudentId(studentId: string) {
    const info: Pick<MoveModalProps, 'currentClass' | 'students' | 'student' | 'otherClass'> = {
      currentClass: 0,
      student: {
        student_id: ''
      },
      otherClass: [],
      students: []
    }


    dataCopy.forEach((studentClass, index) => {
      const studentDetail = studentClass.find(i => i.student_id === studentId)
      if (studentDetail) {
        info.student = studentDetail
        info.currentClass = index + 1
        if (studentDetail[tableConfig.togetherIndex]) {
          info.students = studentClass.
            filter(i => i.student_id !== studentDetail.student_id && i[tableConfig.togetherIndex] === studentDetail[tableConfig.togetherIndex])
            .map(i => ({ ...i, isMove: '1' }))
        }
      }
    })

    for (let index = 0; index < dataCopy.length; index++) {
      if (index + 1 !== info.currentClass) {
        info.otherClass.push(index + 1)
      }
    }

    return info
  }

  function handleMove(record: XlsxData) {
    const studentInfo = findClassByStudentId(record.student_id)
    setMoveModelData({
      ...studentInfo,
      targetClass: 0,
      tableConfig: tableConfig
    })
    setOpen(true)
  }

  useEffect(() => {
    setDataCopy(result)
  }, [result])

  // 弹窗
  const [open, setOpen] = useState(false)
  const [moveModelData, setMoveModelData] = useState<MoveModalProps>({
    currentClass: 0,
    student: {
      student_id: ''
    },
    students: [],
    tableConfig: {
      separateIndex: 0,
      togetherIndex: 0,
      sexIndex: 0,
      nameIndex: 0,
    },
    otherClass: [],
    targetClass: 0,
  })
  const handleOk = () => {
    if (!moveModelData.targetClass) {
      return message.error('转移班级不能为空')
    }
    const dataCache = JSON.parse(JSON.stringify(dataCopy))
    const todoSwitch = [moveModelData.student, ...moveModelData.students.filter(i => i.isMove === '1')]
    const currnetClass = moveModelData.currentClass - 1
    const targetClass = moveModelData.targetClass - 1

    const data: XlsxData[] = []
    dataCopy[currnetClass].forEach(student => {
      const index = todoSwitch.findIndex(i => i.student_id === student.student_id)
      if (index === -1) {
        data.push(student)
      }
    })
    dataCache[currnetClass] = data
    todoSwitch.forEach(student => {
      dataCache[targetClass].push(student)
    })


    setDataCopy(dataCache)
    message.success('转移班级成功')

    close()
  }
  const close = () => {
    setOpen(false)
  }

  const exportBand = () => {
    writeXlsx({ xlsxColumns: exportColumns, xlsxData: dataCopy })
  }

  return (
    <>
      <div className="result-adjust">
        <Row gutter={20}>
          {
            dataCopy.map((item, index) => {
              return <>
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                  <div className="class" key={index}>
                    <div className="class-name">{`第${index + 1}班`}</div>
                    <div className="count">
                      <div className="total-count">总人数：{item.length}</div>
                      <div className="man-count">男生人数：{item.filter(i => i[tableConfig.sexIndex] === '男').length}</div>
                      <div className="woman-count">女生人数：{item.filter(i => i[tableConfig.sexIndex] === '女').length}</div>
                    </div>
                    <Table
                      bordered
                      dataSource={item}
                      scroll={{ y: 400 }}
                      pagination={false}
                      rowKey="student_id"
                    >
                      <Column title="姓名" dataIndex={tableConfig.nameIndex} key={tableConfig.nameIndex} />
                      <Column title="性别" dataIndex={tableConfig.sexIndex} key={tableConfig.sexIndex} />
                      <Column title="电话" dataIndex={3} key={3} />
                      <Column
                        title="操作"
                        dataIndex="x"
                        key="x"
                        render={(_, record: XlsxData) => (
                          <>
                            <Button onClick={() => handleMove(record)}>移动</Button>
                          </>
                        )}
                      />
                    </Table>
                  </div>
                </Col>
              </>
            })
          }
        </Row>

        <Modal
          title="移动学生"
          width={'90vw'}
          open={open}
          onOk={handleOk}
          onCancel={close}
        >
          {
            MoveForm(moveModelData)
          }
        </Modal>
      </div>
      <div>
        <Button type='primary' onClick={exportBand}>导出</Button>
      </div>
    </>
  )
}

export default ResultAdjust
