import React, { useEffect, useState } from 'react'
import { Button, Col, Empty, Form, Modal, Radio, Row, Select, Table, Upload, message } from 'antd'
import { MoveModalProps, ResultAdjustProps, StudentColunm, TableConfig } from './type.d'
const { Column } = Table

const MoveForm: React.FC<MoveModalProps> = (params) => {
  const { student, currentClass, tableConfig, students, otherClass } = params
  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
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
              render={(_, record) => (
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

  function findClassByStudentId(studentId: string | number) {
    const info: Pick<MoveModalProps, 'currentClass' | 'students' | 'student' | 'otherClass'> = {
      currentClass: 0,
      student: {},
      otherClass: [],
      students: []
    }


    dataCopy.forEach((studentClass, index) => {
      const studentDetail = studentClass.find(i => i.student_id === studentId)
      console.log('🚀 ~ file: resultAdjust.tsx:105 ~ dataCopy.forEach ~ studentClass:', studentClass, studentDetail)
      if (studentDetail) {
        info.student = studentDetail
        info.currentClass = index + 1
        if (studentDetail[tableConfig.togetherIndex]) {
          info.students = studentClass.filter(i => i.student_id !== studentDetail.student_id && i[tableConfig.togetherIndex] === studentDetail[tableConfig.togetherIndex])
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

  function handleMove(record: StudentColunm) {
    const studentInfo = findClassByStudentId(record.student_id)
    console.log('🚀 ~ file: resultAdjust.tsx:124 ~ handleMove ~ studentInfo:', studentInfo)
    // setMoveModelData({
    //   ...studentInfo,
    //   students: studentInfo.students.map(student => ({
    //     ...student,
    //     isMove: '1'
    //   })),
    //   targetClass: 0,
    //   tableConfig: tableConfig
    // })
    // setOpen(true)
  }

  useEffect(() => {
    setDataCopy(result)
  }, [result])

  // 弹窗
  const [open, setOpen] = useState(false)
  const [moveModelData, setMoveModelData] = useState<MoveModalProps>({
    currentClass: 0,
    student: {},
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
    const currnetClass = moveModelData.currentClass
    const targetClass = moveModelData.targetClass

    todoSwitch.forEach(student => {
      dataCache[currnetClass] = dataCopy[currnetClass].filter(i => i.student_id !== student.student_id)
      dataCache[targetClass].push(student)
    })

    setDataCopy(dataCache)
  }
  const close = () => {
    setOpen(false)
  }

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
                    {/* columns={tableColumn} */}
                    <Table
                      bordered
                      dataSource={item}
                      scroll={{ y: 400 }}
                      pagination={false}
                      rowKey="student_id"
                    >
                      <Column title="姓名" dataIndex={tableConfig.nameIndex} key={tableConfig.nameIndex} />
                      <Column title="电话" dataIndex={3} key={3} />
                      <Column
                        title="操作"
                        dataIndex="x"
                        key="x"
                        render={(_, record) => (
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
    </>
  )
}

export default ResultAdjust
