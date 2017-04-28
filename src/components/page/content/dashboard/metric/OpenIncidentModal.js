import React from 'react'
import moment from 'moment'
import { assign } from 'lodash'
import { ROOT_URL } from 'actions/config'
import DateRangePicker from '../../../../shared/DateRangePicker'
import AddExceptionModal from './AddExceptionModal'

import { showAlert, showPrompt } from '../../../../shared/Alert'
import { dateFormatter, getSeverityIcon, getIncidenttypeIcon } from '../../../../../shared/Global'
import { appendComponent, removeComponent } from '../../../../../util/Component'

import {
    showIncidentDetail,
    ackIncident,
    fixIncident,
    showIncidentRaw,
    showIncidentComments
} from 'shared/action/IncidentAction'

export default class OpenIncidentModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true,

      params: {
        text: '',
        fixed: '0',
        severity: ['High', 'Medium'],
        startTime: moment().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().endOf('year').format('YYYY-MM-DD HH:mm:ss')
      },

      severities: [
        { label: 'High', value: 'High'},
        { label: 'Medium', value: 'Medium'},
        { label: 'Low', value: 'Low'},
        { label: 'Audit', value: 'Audit'},
        { label: 'Ignore', value: 'Ignore'}
      ],

      selectedSeverity: ['High', 'Medium']
    }

    this.cells = [{
      'displayName': 'Status',
      'columnName': 'incidenttype',
      'cssClassName': 'text-center width-80',
      'customComponent': (props) => {
        return (<img width="24"
          src={`/images/${getIncidenttypeIcon(props.data)}`}
          data-tip={props.rowData.incidenttype || ''} />)
      }
    }, {
      'displayName': 'Severity',
      'columnName': 'incidentseverity',
      'cssClassName': 'text-center width-60',
      'customComponent': (props) => {
        return <span dangerouslySetInnerHTML={{__html: getSeverityIcon(props.data)}}/>
      }
    }, {
      'displayName': 'Date/Time',
      'columnName': 'starttimestamp',
      'cssClassName': 'text-center width-140',
      'customComponent': (props) => {
        let date = dateFormatter(props.data)
        return <span data-tip={props.data}>{date}</span>
      }
    }, {
      'displayName': 'Description Info',
      'columnName': 'descriptioninfo',
      'customComponent': (props) => {
        let str = props.data
        if (props.rowData.lastcomment) {
          str += `<br/><b>Reason:</b> ${props.rowData.lastcomment}`
        }

        return <span dangerouslySetInnerHTML={{__html: str }} />
      }
    }, {
      'displayName': 'Actions',
      'columnName': 'actions',
      'cssClassName': 'nowrap width-200',
      'customComponent': (props) => {
        const row = props.rowData
        return (
          <div>
            <a href="javascript:;" onClick={() => { ackIncident(row, this.reloadTable.bind(this)) }}>
              <img style={{height: '30px'}} title="Acknowledge"
                src={`/images/${row.acknowledged ? 'ack.png' : 'noack.png'}`} />
            </a>
            &nbsp;

            <a href="javascript:;" onClick={() => { fixIncident(this.context.sid, row, this.reloadTable.bind(this)) }}>
              <img style={{height: '30px'}} title="Acknowledge"
                src={`/images/${row.fixed ? 'ok.png' : 'notok.png'}`} />
            </a>
            &nbsp;

          </div>
        )
      }
    }]

    this.onFilterChange = this.onFilterChange.bind(this)
  }

  renderPicker() {
    return (
      <DateRangePicker onClickRange={this.onFilterChange} className="margin-md-left"
        default={moment().startOf('years').format('YYYY')} ref="dp">
        <i className="fa fa-caret-down margin-xs-left" />
      </DateRangePicker>
    )
  }

  render () {
    let picker = this.renderPicker();
    return (
      <IncidentsModalView
        show={this.state.open}
        header="Open Incidents"
        onHide={this.onHide.bind(this)}
        onClose={this.onClickClose.bind(this)}
        onFilter={this.onFilterChange}
        value={this.state.selectedSeverity.join(',')}
        options={this.state.severities}
        onChange={this.onChangeSeverity.bind(this)}
        params={this.state.params}
        cells={this.cells}
        picker={picker}
        url="/incidentstable/getOpenIncidents"
        onClick1={this.onClickFixAll.bind(this)}
        onClick2={this.onClickAddException.bind(this)}
        onClick3={this.onClickOpen.bind(this)}
      />
    )
  }

  onHide () {
    this.onClickClose()
  }

  closeModal (data) {
    this.setState({ open: false}, () => {
      this.props.onClose &&
            this.props.onClose(this, data)
    })
  }

  onClickClose () {
    this.closeModal()
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onChangeSeverity (selected) {
    this.setState({
      selectedSeverity: selected.map(item => item.value)
    }, () => {
      this.onFilterChange()
    })
  }

  onFilterChange () {
    let {params} = this.state
    const refs = this.refs
    params = assign(params, {
      text: refs.search.value,
      severity: this.state.selectedSeverity,
      fixed: refs.fixed.value,
      startTime: refs.dp.getStartDate().format('YYYY-MM-DD HH:mm:ss'),
      endTime: refs.dp.getEndDate().format('YYYY-MM-DD HH:mm:ss')
    })

    this.setState({ params })
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  updateTable () {
    this.refs.table &&
        this.refs.table.refresh()
  }

  reloadTable () {
    this.updateTable()
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onClickFixAll () {
    showPrompt('Please type comment for all incidents.', '', (text) => {
      if (text === null) return

      $.get(`${ROOT_URL}${Api.incidents.fixAllOpenIncidents}`, {
        comment: text
      }).done(res => {
        this.reloadTable()
      })
    })
  }

  onClickAddException () {
    const sel = this.refs.table.getSelected()
    if (!sel) return showAlert('Please select incident.')

    appendComponent(
            <AddExceptionModal incident={sel}
              onClose={removeComponent}/>
        )
  }

  onClickOpen () {
    const sel = this.refs.table.getSelected()
    if (!sel) return showAlert('Please select incident.')

    showIncidentDetail(sel)
  }

}

OpenIncidentModal.defaultProps = {
  onClose: null
}
