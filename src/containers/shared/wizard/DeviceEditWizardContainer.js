import React from 'react'
import DeviceEditWizard from '../../../components/shared/wizard/DeviceEditWizard'
import { connect } from 'react-redux'
import {
  openTplImageModal,
  closeTplImageModal,
  fetchImages,
  uploadImage,
  submitForm
} from 'actions'

@connect(
  state => ({
    initialValues: state.dashboard.selectedDevice,

    tplImageModalVisible: state.settings.tplImageModalVisible,
    selectedTplImage: state.settings.selectedTplImage,

    images: state.dashboard.images
  }), {
    openTplImageModal,
    closeTplImageModal,
    fetchImages,
    uploadImage,
    submitForm
  }
)
export default class DeviceEditWizardContainer extends React.Component {
  render () {
    return (
      <DeviceEditWizard {...this.props} />
    )
  }
}

DeviceEditWizard.defaultProps = {
  deviceType: '',

  extraParams: {},
  configParams: {},

  onSaved: null,
  onFinish: null,

  tabs: [{
    title: 'General',
    include: ['name', 'agentid', 'ipaddress', 'wanip', 'lanip', 'hostname', 'port', 'dbtype', 'sql', 'disabled', 'image', 'url'],
    width: 4
  }, {
    title: 'Info',
    include: ['info'],
    width: 4
  }, {
    title: 'Advanced',
    id: 'tab-devinfo-advanced',
    include: ['server_url', 'deviceid', 'devicetype', 'response', 'checkinterval', 'status', 'basicchecks', 'externalIP'],
    extra: [{
      name: 'id',
      title: 'DeviceId'
    }, {
      name: 'devicetype',
      title: 'DeviceType'
    }],
    width: 4
  }, {
    title: 'Credentials',
    include: ['credentialid'],
    width: 12
  }]
}
