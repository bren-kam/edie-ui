import React from 'react'
import {RaisedButton} from 'material-ui'

import InfiniteTable from 'components/common/InfiniteTable'
import { showAlert, showConfirm } from 'components/common/Alert'

import CredentialModal from './CredentialModal'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

import UserTabs from '../users/UserTabs'

export default class Credentials extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }

    this.cells = [{
      'displayName': 'Name',
      'columnName': 'name'
    }, {
      'displayName': 'Description',
      'columnName': 'description'
    }, {
      'displayName': 'User Name',
      'columnName': 'username'
    }]
  }

  componentWillMount () {
    this.props.fetchCredentials()
  }

  renderContent () {
    return (
      <InfiniteTable
        cells={this.cells}
        ref="credentials"
        rowMetadata={{'key': 'id'}}
        selectable
        onRowDblClick={this.onEditCred.bind(this)}

        useExternal={false}
        data={this.props.credentials}
      />
    )
  }

  renderCredentialsModal () {
    if (!this.props.credentialsModalVisible) return null
    return (
      <CredentialModal {...this.props}/>
    )
  }

  getTable () {
    return this.refs.credentials
  }

  onAddCred () {
    this.props.openCredentialsModal()
  }

  onEditCred () {
    let selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please choose credentials.')

    this.props.openCredentialsModal(selected)
  }

  onRemoveCred () {
    let selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please choose credentials.')

    showConfirm('Are you sure? Click OK to remove.', (btn) => {
      if (btn !== 'ok') return

      this.props.removeCredentials(selected)
    })
  }
  render () {
    return (
      <TabPage>
        <TabPageHeader title="Settings">
          <div className="text-center margin-md-top">
            <div className="pull-right">
              <RaisedButton label="Add" onTouchTap={this.onAddCred.bind(this)}/>&nbsp;
              <RaisedButton label="Edit" onTouchTap={this.onEditCred.bind(this)}/>&nbsp;
              <RaisedButton label="Remove" onTouchTap={this.onRemoveCred.bind(this)}/>&nbsp;
              <UserTabs router={this.props.router}/>&nbsp;
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={5} history={this.props.history} location={this.props.location}>
          {this.renderContent()}
          {this.renderCredentialsModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}
