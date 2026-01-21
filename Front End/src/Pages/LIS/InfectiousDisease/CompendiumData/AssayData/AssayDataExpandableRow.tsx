import React, { memo } from 'react'
import Row from './Row'
import PanelAndReportingRule from './PanelAndReportingRule'

const AssayDataExpandableRow: React.FC<{}> = () => {
  return (
    <div className=' table-expend-sticky'>
    <div className="row">
      <div className="col-lg-12 bg-white px-lg-14 pb-6">
        <PanelAndReportingRule id={Row} />
      </div>
    </div>
    </div>
  )
}
export default memo(AssayDataExpandableRow)
