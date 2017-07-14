import React from 'react'
import { assign } from 'lodash'
import { reduxForm } from 'redux-form'

import ParamEditModal from './input/ParamEditModal'
import TagsView from './input/TagsView'

import CredPicker from 'containers/settings/credentials/CredsPickerContainer'
import MonitorWizardView from './MonitorWizardView'

class MonitorWizard extends React.Component {
  constructor (props) {
    super(props)

    // const stepItems = cloneDeep(config.steps)
    // if (this.showAgentType()) {
    //   stepItems[0].items = [...config.creds, ...stepItems[0].items]
    // }

    this.state = {
      monitors: props.monitors || []
    }
  }
  componentWillMount () {
    // const hasMonitors = this.state.currentDevice.steps.filter(s =>
    //     s.items.filter(i => i.type === 'monitors').length > 0
    //   ).length > 0
    //
    // if (hasMonitors) {
    //   this.props.fetchMonitorTemplates()
    // }

    if (!this.hasCreds()) {
      this.props.showDeviceCredsPicker(true)
    }
  }

  hasCreds () {
    const {selectedDevice, monitorConfig} = this.props

    if (this.showAgentType()) {
      const credTypes = monitorConfig.credentialTypes || []
      const creds = selectedDevice.credentials || []
      let found = true
      credTypes.forEach(type => {
        if (!creds.filter(p => p.type === type).length)
          found = false
      })
      return found
    }
    return true
  }

  showAgentType () {
    const {checkCreds, monitorConfig, selectedDevice, collectors} = this.props
    if (checkCreds) {
      if (selectedDevice.agent) return false
      const credTypes = monitorConfig.credentialTypes || []
      if (credTypes.length === 0) return false
      if (collectors.length > 2) return false
      return true
    }
    return false
  }

  handleFormSubmit (formProps) {
    const { extraParams, onFinish, editParams, canAddTags, monitorTags } = this.props
    const { monitors } = this.state
    let params = {}
    if (editParams) {
      editParams.forEach(p => {
        params[p.key] = p.value
      })
    }

    let props = assign(
      {},
      formProps,
      extraParams, {
        monitors: monitors.map(m => assign({}, m, {id: null})),
        params
      }
    )
    if (canAddTags) props.tags = monitorTags || []
    console.log(props)
    this.closeModal(true)
    onFinish && onFinish(null, props)
  }

  closeModal (data) {
    this.props.onClose && this.props.onClose(this, data)
  }
  onCloseCredPicker (selected) {
    if (selected) {
      const {selectedDevice} = this.props
      const props = {
        ...selectedDevice,
        credentials: [selected]
      }
      this.props.updateMapDevice(props)
    }
    this.props.showDeviceCredsPicker(false)
  }

  renderParamEditModal () {
    if (!this.props.paramEditModalOpen) return null
    return (
      <ParamEditModal/>
    )
  }

  renderTags () {
    if (!this.props.canAddTags) return null
    return (
      <TagsView {...this.props}/>
    )
  }

  renderCredPicker () {
    if (!this.props.deviceCredsPickerVisible) return null
    return (
      <CredPicker onClose={this.onCloseCredPicker.bind(this)}/>
    )
  }
  render () {
    const { handleSubmit } = this.props
    const header = this.props.title || 'Monitor'
    const paramEditModal = this.renderParamEditModal()
    return (
      <MonitorWizardView
        header={header}
        paramEditModal={paramEditModal}
        onHide={this.closeModal.bind(this)}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        tagsView={this.renderTags()}
        credPicker={this.renderCredPicker()}
      />
    )
  }
}

export default reduxForm({
  form: 'monitorWizardForm'
})(MonitorWizard)
