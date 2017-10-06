import React from 'react'
import ReactDOM from 'react-dom'
import {RefreshIndicator} from 'material-ui'

const loadingStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)'
}

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(80,80,80,0.5)',
  zIndex: 10
}

export default class RefreshOverlay extends React.Component {
  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.containerDiv).focus();
  }
  render () {
    return (
      <div style={overlayStyle}>
        <div style={loadingStyle} tabIndex="0" ref="containerDiv">
          <RefreshIndicator
            size={50}
            left={0}
            top={0}
            status="loading"
            style={{display: 'inline-block', position: 'relative'}}
          />
        </div>
      </div>
    )
  }
}
