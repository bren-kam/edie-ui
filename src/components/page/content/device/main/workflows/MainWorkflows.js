import React from 'react'
import {
  ButtonGroup, Button
} from 'react-bootstrap'

import { ResponsiveInfiniteTable } from '../../../../../shared/InfiniteTable'
import MainTabs from '../MainTabs'
import TabPage from '../../../../../shared/TabPage'
import TabPageBody from '../../../../../shared/TabPageBody'
import TabPageHeader from '../../../../../shared/TabPageHeader'

import MainWorkflowModalContainer from '../../../../../../containers/page/content/device/main/workflows/MainWorkflowModalContainer'

export default class MainWorkflows extends React.Component {
  constructor (props) {
    super(props)

    const {device} = this.props

    this.state = {
      url: Api.workflow.getWorkflowsForDevice, // eslint-disable-line no-undef
      params: {
        id: device.id
      }
    }

    this.cells = [{
      'displayName': 'Category',
      'columnName': 'category'
    }, {
      'displayName': 'Name',
      'columnName': 'name'
    }, {
      'displayName': 'Severity',
      'columnName': 'severity'
    }, {
      'displayName': 'Description',
      'columnName': 'desc'
    }]
  }

  componentWillMount () {
    console.log(this.props)
    this.props.fetchDeviceWorkflows(this.state.params)
  }

  onClickAdd () {
    this.props.openDeviceWorkflowModal()
  }

  renderTable () {
    return (
      <ResponsiveInfiniteTable
        id="rule1"
        cells={this.cells}
        ref="table"
        rowMetadata={{'key': 'idrulesNew'}}
        selectable
        // onRowDblClick={this.onRowDblClick.bind(this)}

        useExternal={false}
        data={this.props.workflows}
      />
    )
  }

  renderWorkflowModal () {
    if (!this.props.workflowModalOpen) return null
    return <MainWorkflowModalContainer />
  }

  render () {
    const {device} = this.props
    return (
      <TabPage>
        <TabPageHeader title={device.name}>
          <div className="text-center margin-md-top">
            <div className="pull-right">
              <ButtonGroup>

                <Button onClick={this.onClickAdd.bind(this)}>Add</Button>
                <Button>Edit</Button>
                <Button>Remove</Button>

              </ButtonGroup>
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={MainTabs(device.id)} tab={1}>
          {this.renderTable()}
          {this.renderWorkflowModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}
