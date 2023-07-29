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
            <h2>你没有权限去该页面</h2>
            <h6>请去找你领导开通权限，再来尝试</h6>
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