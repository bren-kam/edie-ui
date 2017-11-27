import React from 'react'
import {IconButton, SelectField, MenuItem} from 'material-ui'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import {findIndex} from 'lodash'
import {slugify} from 'shared/Global'

import MainDashboardView from './MainDashboardView'
import ServerDashboardView from './ServerDashboardView'
import BoardListModal from './BoardListModal'
import WorkflowDashboardView from './WorkflowDashboardView'
import AppsDashboardView from './AppsDashboardView'

export default class MainDashboard extends React.Component {
  componentWillMount () {
    this.props.selectGaugeBoard(null)
    this.props.fetchGaugeBoards()
    this.props.fetchGauges()
    this.props.fetchSysSearchOptions()
    this.props.fetchWorkflows()
    this.props.fetchDevicesGroups()
    this.props.fetchMonitorGroups()
    this.props.fetchMonitorTemplates()
    this.props.fetchCredentials()
    this.props.fetchCollectors()
    this.props.fetchDeviceTemplates()
  }
  componentWillUpdate (nextProps) {
    const {gaugeBoards} = nextProps
    let {id} = this.props.match.params
    if ((!this.props.gaugeBoards.length || !nextProps.match.params.id) && gaugeBoards.length) {
      let board
      if (id && nextProps.match.params.id) {
        board = this.findBoard(gaugeBoards, id)
      }

      if (!board) board = gaugeBoards.filter(p => p.type !== 'system')[0]
      nextProps.selectGaugeBoard(board.id, slugify(board.name), nextProps.history)
    }
  }
  findBoard (boards, slug) {
    let found
    boards.every(p => {
      if (slugify(p.name) === slug) {
        found = p
        return false
      }
      return true
    })
    return found
  }
  getSelectedId () {
    const {id} = this.props.match.params
    const board = this.findBoard(this.props.gaugeBoards, id)
    if (board) return board.id
    return id
  }
  getSelected () {
    const index = findIndex(this.props.gaugeBoards, {id: this.getSelectedId()})
    if (index < 0) return null
    return this.props.gaugeBoards[index]
  }

  isServerDashboard (board) {
    return board && board.type === 'system' && board.name === 'Servers'
  }
  onChangeBoard (e, index, value) {
    const gaugeBoards = this.getBoards()
    const url = slugify(gaugeBoards[index].name)
    this.props.selectGaugeBoard(value, url, this.props.history, true)
  }
  onClickAdd () {
    // showPrompt('Please type name.', '', name => {
    //   if (!name) return
    //   this.props.addGaugeBoard({
    //     name
    //   })
    // })
    this.props.showGaugeBoardsModal(true)
  }
  onClickSetDefault () {
    const board = this.getSelected()
    if (!board) return null
    this.props.setDefaultGaugeBoard(board)
  }
  getBoards () {
    return this.props.gaugeBoards.filter(p => p.type !== 'system')
  }
  renderContent () {
    const board = this.getSelected()
    if (!board) return null
    if (board.type === 'system') {
      if (board.name === 'Servers') {
        return (
          <ServerDashboardView board={board} {...this.props}/>
        )
      } else if (board.name === 'Workflows') {
        return (
          <WorkflowDashboardView board={board} {...this.props}/>
        )
      } else if (board.name === 'Apps') {
        return (
          <AppsDashboardView board={board} {...this.props}/>
        )
      }
    }
    return (
      <MainDashboardView board={board} {...this.props}/>
    )
  }
  renderBoardsModal () {
    if (!this.props.gaugeBoardsModalOpen) return
    return (
      <BoardListModal {...this.props}/>
    )
  }

  renderTopbar () {
    const board = this.getSelected()
    if (!board) return null
    if (board.type === 'system') return null
    return (
      <div className="padding-lg-left" style={{height: 90}}>
        <SelectField
          floatingLabelText="Dashboard" value={this.getSelectedId()} onChange={this.onChangeBoard.bind(this)}
          className="valign-top"
          style={{width: 140}}>
          {this.getBoards().map(p =>
            <MenuItem key={p.id} value={p.id} primaryText={p.name}/>
          )}
        </SelectField>
        <IconButton onTouchTap={this.onClickAdd.bind(this)} className="valign-bottom"><AddCircleIcon /></IconButton>
      </div>
    )
  }
  render () {
    return (
      <div className="tabs-custom flex-vertical flex-1">
        {this.renderTopbar()}

        <div className="flex-vertical flex-1">
          {this.renderContent()}
          {this.renderBoardsModal()}
        </div>
      </div>
    )
  }
}
