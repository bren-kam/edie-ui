import React from 'react'
import 'bootstrap-daterangepicker/daterangepicker.css'
import ReactDateRangePicker from 'react-bootstrap-datetimerangepicker'
import moment from 'moment'
import {keys, assign, isString, isNumber} from 'lodash'
import {dateFormat} from 'shared/Global'

const locale = {
  format: dateFormat,
  separator: ' - ',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  weekLabel: 'W',
  customRangeLabel: 'Custom Range',
  daysOfWeek: moment.weekdaysMin(),
  monthNames: moment.monthsShort(),
  firstDay: moment.localeData().firstDayOfWeek()
}

export default class DateRangePicker2 extends React.Component {
  constructor (props) {
    super(props)

    let today = moment()
    let yesterday = moment().add(-1, 'days')

    let rangeConfig = {
      [moment().add('-1', 'years').format('YYYY')]: [
        moment().add('-1', 'years').startOf('year'),
        moment().add('-1', 'years').endOf('year')
      ],
      [moment().startOf('years').format('YYYY')]: [
        moment().startOf('year'),
        moment().endOf('year')
      ],
      [moment().add('-1', 'months').format('MMMM')]: [
        moment().add(-1, 'months').startOf('month'),
        moment().add(-1, 'months').endOf('month')
      ],
      [moment().startOf('month').format('MMMM')]: [
        moment().startOf('month'),
        moment().endOf('month')
      ],
      'Last 30 Days': [
        moment().add(-30, 'days').startOf('day'),
        today.endOf('days')
      ],
      'Last 7 Days': [
        moment().add(-6, 'days').startOf('day'),
        today.endOf('days')
      ],
      'Since Yesterday': [
        yesterday.startOf('day'),
        today.endOf('day')
      ],
      'Yesterday': [
        yesterday.startOf('day'),
        yesterday.endOf('day')
      ],
      'Today': [
        today.startOf('day'),
        today.endOf('day')
      ]
    }
    this.state = {
      rangeConfig
    }
  }

  onApply (e, dp) {
    this.props.onApply && this.props.onApply({
      startDate: dp.startDate.startOf('day'),
      endDate: dp.endDate.endOf('day')
    })
  }

  render () {
    const {rangeConfig} = this.state
    let { className, startDate, endDate, children, renderer, style } = this.props

    const momentStartDate = isString(startDate) ? moment(startDate, dateFormat) : (isNumber(startDate) ? moment(startDate) : startDate)
    const momentEndDate = isString(endDate) ? moment(endDate, dateFormat) : (isNumber(endDate) ? moment(endDate) : endDate)

    const startDateStr = momentStartDate.format(dateFormat)
    const endDateStr = momentEndDate.format(dateFormat)

    let label = ''

    keys(rangeConfig).forEach(key => {
      if (rangeConfig[key][0].format(dateFormat) === startDateStr &&
        rangeConfig[key][1].format(dateFormat) === endDateStr) {
        label = key
      }
    })

    if (!label) label = `${startDateStr} - ${endDateStr}`
    return (
      <ReactDateRangePicker
        timePicker
        timePicker24Hour
        showDropdowns
        timePickerSeconds
        autoUpdateInput
        linkedCalendars={false}
        locale={locale}

        ranges={rangeConfig}

        startDate={momentStartDate}
        endDate={momentEndDate}

        style={assign({}, style, {display: 'inline-block'})}
        className={className}

        onApply={this.onApply.bind(this)}
      >
        <a href="javascript:;" className={renderer ? 'hidden' : ''}>{label}</a>
        {renderer ? renderer(label) : null}
        {children}
      </ReactDateRangePicker>
    )
  }
}
