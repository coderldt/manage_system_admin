import { Col, Row } from 'antd'
import NoPermission from '@/assets/images/401.gif'
import './error.less'

const NoFind = () => {
  return (
    <>
      <div className="errPage-container">
        <Row>
          <Col span="12">
            <h1 className="text-jumbo text-ginormous">
              Oops!
            </h1>
            <h2>页面找不到了</h2>
            <h6>请联系开发 XXXX 人员，反馈问题，谢谢</h6>
          </Col>
          <Col span="12">
            <img src={NoPermission} className="pan-img" />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default NoFind