import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Alert, Button } from 'antd'
import { ReactSortable } from "react-sortablejs"
import { ResultAdjustProps, SortableClassProps, XlsxData } from '../type.d'
import { writeXlsx } from '../tool'

type SortableClassExport = { getStudents: () => (XlsxData & { id: string })[] }
type SortableClassRef = React.MutableRefObject<SortableClassExport>

const SortableClass = forwardRef<SortableClassExport, SortableClassProps>(({ students, tableConfig, index }, ref) => {
  const [state, setState] = useState<(XlsxData & { id: string })[]>(students.map(i => {
    return {
      ...i,
      id: i.student_id
    }
  }))

  useImperativeHandle(ref, () => ({
    getStudents: () => {
      return state
    },
  }))

  return (
    <>
      <div className="header">
        <div className="class-name">{`第${index + 1}班`}</div>
        <div className="count">
          <div className="total-count">总人数：{state.length}</div>
          <div className="man-count">男生人数：{state.filter(i => i[tableConfig.sexIndex] === '男').length}</div>
          <div className="woman-count">女生人数：{state.filter(i => i[tableConfig.sexIndex] === '女').length}</div>
        </div>
      </div>
      <ReactSortable
        list={state}
        group="groupName"
        animation={200}
        delay={2}
        setList={setState}
      >
        {
          state.map(item => {
            const isSeparateClass = state.filter(i => {
              if (i[tableConfig.separateIndex] && item[tableConfig.separateIndex]) {
                return i[tableConfig.separateIndex] === item[tableConfig.separateIndex]
              }
            })

            return (
              <div
                className={isSeparateClass.length >= 2 ? 'sortable-students error-class' : 'sortable-students'}
                style={{ backgroundColor: item.together_color || '#fff' }}
                key={item.student_id}
              >
                {item[tableConfig.nameIndex]} - {item[tableConfig.sexIndex]} - {item[3]}
              </div>
            )
          })
        }
      </ReactSortable >
    </>
  )
})


const ResultAdjust: React.FC<ResultAdjustProps> = ({
  tableConfig,
  exportColumns,
  result
}) => {
  const [dataCopy, setDataCopy] = useState<XlsxData[][]>([])
  const refs = useRef<SortableClassRef[]>([])

  useEffect(() => {
    refs.current = Array.from({ length: result.length }, (_, index) => refs.current[index] || React.createRef())
    setDataCopy(result)
  }, [result])


  const exportBand = () => {
    const result: XlsxData[][] = []
    refs.current.forEach(value => {
      result.push(value.current.getStudents())
    })

    writeXlsx({ xlsxColumns: exportColumns, xlsxData: result })
  }

  return (
    <>
      <div className="result-adjust">
        <div className="control">
          <Alert message="颜色一致表示要分在一班，颜色为红色则表示不要分在一班。不做硬性导出要求。" type="info" />
          <Button type='primary' onClick={exportBand}>导出</Button>
        </div>
        <div className="class-list">
          {
            dataCopy.map((item, index) => {
              return (
                <div className="class" key={index}>
                  <SortableClass ref={refs.current[index]} students={item} tableConfig={tableConfig} index={index} />
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default ResultAdjust
