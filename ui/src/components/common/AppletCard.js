import React from 'react'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import EditIcon from 'material-ui/svg-icons/image/edit'

const editButtonStyle = {
  position: 'absolute',
  right: 15,
  bottom: 8
}

export default class AppletCard extends React.Component {
  render () {
    const {name, desc, img, color, className, onClick, onClickDelete, onClickEdit} = this.props
    return (
      <li className={`web-applet-card small ${className}`} onClick={onClickDelete ? null : onClick}>
        <div className="applet-card-body " style={{background: color}}>
          <div className="content">
            <div className="card-top">
              <img src={img} alt="" onClick={onClick}/>
              <div className="pull-right" style={{marginRight: -10, marginTop: -10}}>
                {onClickDelete && <CloseIcon size={32} color="white" onTouchTap={onClickDelete}/>}
              </div>
            </div>
            <span className="title" onClick={onClick}>
              {desc}&nbsp;
            </span>
            <p className="author" onClick={onClick}>
              by&nbsp;<span><b>Securegion</b></span>&nbsp;
              <img alt="Verified" src="/resources/images/common/wizard/verified.svg" />
            </p>
          </div>
          <div className="meta" onClick={onClick}>
            {name}&nbsp;
            {onClickEdit && <div style={editButtonStyle}><EditIcon size={32} color="white" onTouchTap={onClickEdit}/></div>}
          </div>
        </div>
      </li>
    )
  }
}
