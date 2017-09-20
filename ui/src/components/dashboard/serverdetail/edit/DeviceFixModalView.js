import React from 'react'
import {Form} from 'redux-form'

import { Modal, CardPanel } from 'components/modal/parts'

export default class DeviceFixModalView extends React.Component {
  render () {
    const {onHide, msg, inputs, onSubmit} = this.props
    return (
      <Modal title="Fix" onRequestClose={onHide}>
        <CardPanel>
          {msg}
          <Form onSubmit={onSubmit}>
            {inputs}
          </Form>
        </CardPanel>
      </Modal>
    )
  }
}
