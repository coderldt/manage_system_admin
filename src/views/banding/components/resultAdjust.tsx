import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Radio, Row, Select, Table, message } from 'antd'
import { ReactSortable, Sortable, Store } from "react-sortablejs"
import { MoveModalProps, ResultAdjustProps, SortableClassProps, XlsxData } from '../type.d'
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

const SortableClass: React.FC<SortableClassProps> = ({ students, tableConfig }) => {
  const [state, setState] = useState<(XlsxData & { id: string })[]>(students.map(i => {
    return {
      ...i,
      id: i.student_id
    }
  }))

  return (
    <>
      <table>
        <tr>
          <td>姓名</td>
          <td>性别</td>
          <td>电话</td>
        </tr>
      </table>
      <ReactSortable
        list={state}
        group="groupName"
        animation={200}
        delay={2}
        setList={setState}
      >
        {
          state.map(item => {
            return (
              <tr>
                <td>{item[tableConfig.nameIndex]}</td>
                <td>{item[tableConfig.sexIndex]}</td>
                <td>{item[3]}</td>
              </tr>
            )
          })
        }
        {/* {state.map((item) => (
          <div key={item.id}>{item[tableConfig.nameIndex]}</div>
        ))} */}
      </ReactSortable>
    </>
  )
}

const ResultAdjust: React.FC<ResultAdjustProps> = ({
  tableConfig,
  exportColumns,
  result
}) => {
  const [dataCopy, setDataCopy] = useState<XlsxData[][]>([])

  useEffect(() => {
    setDataCopy(result)
  }, [result])


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
                    <SortableClass students={item} tableConfig={tableConfig} />
                  </div>
                </Col>
              </>
            })
          }
        </Row>
      </div>
      <div>
        <Button type='primary' onClick={exportBand}>导出</Button>
      </div>
    </>
  )
}

export default ResultAdjust
