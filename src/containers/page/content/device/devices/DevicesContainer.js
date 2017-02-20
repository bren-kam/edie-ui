import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { addGroupDevice } from 'actions'

import Devices from 'components/page/content/device/devices/Devices'

@connect(
  state => ({
    device: state.dashboard.selectedDevice
  }), {
    addGroupDevice
  }
)
@withRouter
export default class DevicesContainer extends React.Component {
  render () {
    return (
      <Devices {...this.props} />
    )
  }
}
