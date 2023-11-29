import React, { useState } from 'react'
import { Button, Empty, Table, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd/es/upload'
import { findSepadTogeSexIndex, readXlsx } from './tool'
import { SearchForm, StudentData, StudentColunm, UploadFileProps } from './type.d'

const UploadFile: React.FC<UploadFileProps> = ({
  xlsxColumns,
  xlsxData,
  saveTableData
}) => {
  const handleChange: UploadProps['onChange'] = async (e) => {
    const { xlsxColumns, xlsxData } = await readXlsx(e.file)

    saveTableData(xlsxColumns, xlsxData.map((i, index) => ({ ...i, 'student_id': `student_${index}` })))
  }

  return (
    <>
      <div className="first-upload">
        <Upload
          showUploadList={false}
          onChange={handleChange}
          beforeUpload={() => false} // 取消默认自动上传
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <h3 className='title'>数据预览</h3>
        {
          xlsxData.length
            ? <Table
              bordered
              columns={xlsxColumns}
              scroll={{ y: 'calc(100vh - 425px)' }}
              dataSource={xlsxData}
              pagination={false}
              rowKey="id"
            />
            : <Empty />
        }
      </div>
    </>
  )
}

export default UploadFile
