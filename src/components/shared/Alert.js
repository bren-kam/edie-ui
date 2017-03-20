import React from 'react'
import Modal from 'react-bootstrap-modal'
import {appendComponent, removeComponent} from '../../util/Component'
import { Header, SubHeader } from '../modal/parts'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { inputStyle, underlineStyle, buttonStyle, buttonTextStyle } from '../../style/materialStyles'

const TYPE_ALERT = 'alert'
const TYPE_CONFIRM = 'confirm'
const TYPE_PROMPT = 'prompt'

export default class Alert extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
  }

  getChildContext () {
    return {
      muiTheme: getMuiTheme()
    }
  }

  onKeyUp (e) {
    if (e.keyCode === 13) {
      this.onClickSave()
    }
  }

  onHide () {
    this.onClickClose()
  }

  onClickSave () {
    this.closeAlert('ok', this.refs.input.value || '')
  }

  onClickClose () {
    this.closeAlert('cancel')
  }

  closeAlert (btn, result) {
    this.setState({ open: false }, () => {
      if (!this.props.onClose) return

      const {type} = this.props

      if (type === TYPE_ALERT) {
        this.props.onClose(this, btn)
      } else if (type === TYPE_PROMPT) {
        this.props.onClose(this, btn === 'ok' ? result : null)
      } else if (type === TYPE_CONFIRM) { this.props.onClose(this, btn) }
    })
  }

  render () {
    return (
      <Modal show={this.state.open} onHide={this.onHide.bind(this)}
        aria-labelledby="ModalHeader" className="bootstrap-dialog type-primary">
        <Header name={this.props.title} />
        <div className="modal-body bootstrap-dialog-message">
          <SubHeader name={this.props.message}/>
          <div className={`form-column ${this.props.type === TYPE_PROMPT ? '' : 'hidden'}`}>
            <TextField
              name="input"
              defaultValue={this.props.default}
              inputStyle={inputStyle}
              underlineFocusStyle={underlineStyle}
              onKeyUp={this.onKeyUp.bind(this)}
              ref="input"
            />
          </div>
          <div className="form-buttons alert-buttons">
            <FlatButton
              onClick={this.onClickSave.bind(this)}
              label="Ok"
              style={buttonStyle}
              labelStyle={buttonTextStyle}/>
            <FlatButton
              className={this.props.type === TYPE_ALERT ? 'hidden' : ''}
              onClick={this.onClickClose.bind(this)}
              label="Cancel"
              style={buttonStyle}
              labelStyle={buttonTextStyle}/>
          </div>
        </div>
      </Modal>
    )
  }
}

Alert.defaultProps = {
  title: 'Incident Manager',
  message: '',
  type: TYPE_ALERT,
  default: '',

  onClose: null
}

// /////////////////////////////////////////////////

function alertCallback (cb, modal, res) {
  setTimeout(() => {
    removeComponent(modal)
  }, 100)
  cb && cb(res)
}

export function showAlert (msg, width, cb) {
  appendComponent(
    <Alert message={msg}
      onClose={alertCallback.bind(this, cb)}
    />
  )
}

export function showConfirm (msg, cb) {
  appendComponent(
    <Alert message={msg}
      type={TYPE_CONFIRM}
      onClose={alertCallback.bind(this, cb)}
    />
    )
}

export function showPrompt (msg, initial, cb) {
  appendComponent(
    <Alert message={msg}
      default={initial}
      type={TYPE_PROMPT}
      onClose={alertCallback.bind(this, cb)}
    />
    )
}
