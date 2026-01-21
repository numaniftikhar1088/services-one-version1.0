import HttpClient from 'HttpClient'
import apiRoutes from '../../Routes/Routes.json'

const saveControlReportingRules = (queryModel: any) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.saveControlReportingRules}`,
    queryModel,
  )
}

const getControlReportingRules = (queryModel: any) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.getControlReportingRules}`,
    queryModel,
  )
}

const ControlReportingRuleService = {
  saveControlReportingRules,
  getControlReportingRules
}

export default ControlReportingRuleService