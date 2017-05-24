import React, { Component } from 'react'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import { validate } from '../../../../modal/validation/NameValidation'

import {ROOT_URL} from 'actions/config'

export default class MapSaveModal extends Component {
  doAction (values) {
    document.location.href = `${ROOT_URL}/exportmap?mapid=${this.props.mapId}&name=${encodeURIComponent(values.name)}`
  }

  render () {
    let header = 'Export map'
    let content = [
      {name: 'Name'},
      {name: 'Description'}
    ]
    return (
      <SimpleModalContainer
        header={header}
        content={content}
        doAction={this.doAction.bind(this)}
        onClose={this.props.onClose}
        validate={validate}
      />
    )
  }
}
