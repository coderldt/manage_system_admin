import './templateLayout.less'
interface TemplateLayout {
  Search?: React.ReactNode
  TableLeft?: React.ReactNode
  TableRight?: React.ReactNode
  Table?: React.ReactNode
}


const TemplateLayout: React.FC<TemplateLayout> = (props) => {
  const { Search, Table, TableLeft, TableRight } = props
  return (
    <>
      <div className="template-layout">
        <div className="template-search" >
          {
            Search
          }
        </div>
        <div className='template-content'>
          <div className='control'>
            <div className="template-control-left" >
              {
                TableLeft
              }
            </div>
            <div className="template-control-right" >
              {
                TableRight
              }
            </div>
          </div>
          <div className="template-table">
            {Table}
          </div>
        </div>
      </div>
    </>
  )
}

export default TemplateLayout