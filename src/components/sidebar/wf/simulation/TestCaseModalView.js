import React from 'react'
import {Field} from 'redux-form'
import AddIcon from '@material-ui/icons/AddCircle'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CopyIcon from '@material-ui/icons/ContentCopy'
import {Button} from '@material-ui/core'
import beautify from 'json-beautify'

import {
  FormInput,
  Modal,
  CardPanel
} from 'components/modal/parts'
import {messageTypes} from 'shared/SimulationMessages'

export default class TestCaseModalView extends React.Component {
  render () {
    const {onSubmit, onClickClose, messages,
      onClickAddMsg, onClickEditMsg, onClickDeleteMsg, onClickCopyMsg,
      onClickPost,
      noModal} = this.props

    const content = (
      <div>
        <Field
          name="name"
          component={FormInput}
          floatingLabel="Name"
          className="hidden"
        />
        <Field
          name="description"
          component={FormInput}
          floatingLabel="Description"
          className="margin-md-top hidden"
          fullWidth
        />
        <div style={{overflow: 'auto', maxHeight: 400}}>
          <table className="table table-hover">
            <thead>
            <tr>
              <th>
                <span>Message</span>
                {/*<AddIcon className="link valign-middle margin-md-left" onClick={onClickAddMsg}/>*/}
              </th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {messages.map((p, i) =>
              <tr key={i}>
                <td>{beautify(p, null, 2, 60)}</td>
                <td>
                  <CopyIcon className="link" onClick={() => onClickCopyMsg(p)}/>
                  <EditIcon className="link" onClick={() => onClickEditMsg(p)}/>
                  <DeleteIcon className="link" onClick={() => onClickDeleteMsg(i)}/>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    )

    if (noModal) {
      return (
        <div>
          <div style={{background: '#dadada', paddingLeft: 10}}>
            <div style={{height: 48}} className="flex-horizontal flex-vcenter">
              {messageTypes.map((p, i) =>
                <div className="margin-md-right" key={i}>
                  <img src={`/images/${p.img}`} width={32} height={32}/>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={onSubmit}>
            {content}


            <div className="text-right">
              {onClickPost && <Button variant="contained" color="primary" onClick={onClickPost} className="margin-md-right">Post</Button>}
              {/*<Button variant="contained" type="submit">Save</Button>*/}
            </div>
          </form>
          {this.props.children}
        </div>
      )
    }

    return (
      <Modal title="Test Case" onRequestClose={onClickClose}>
        <form onSubmit={onSubmit}>
          <CardPanel title="Test Case">
            {content}
          </CardPanel>
          {/*<SubmitBlock name="Save"/>*/}
        </form>
        {this.props.children}
      </Modal>
    )
  }
}