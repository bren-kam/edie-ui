import React from 'react'

class CpuTable extends React.Component {
  componentWillMount () {
    this.props.fetchMonitorCpu()
  }
  buildProgress (val) {
    let color = 'red'
    const textcolor = 'black'
    if (val < 70) color = 'green'
    else if (val < 90) color = '#fec835'

    return (
      <div className="progress" style={{height: '12px', position: 'relative'}}>
        <div className="progress-label" style={{fontSize: '9px', top: '1px', textAlign: 'center', position: 'absolute', width: '100%', color: textcolor}}>{val}%</div>
        <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style={{width: `${val}%`, backgroundColor: color}}/>
      </div>
    )
  }
  renderContent () {
    const {monitorCpu} = this.props
    if (!monitorCpu) return null
    const cpus = monitorCpu.dataobj
    return (cpus.length ? cpus : [cpus]).map((d, i) =>
      <div key={i} className="inline-block valign-top">
        <img src="/images/cpu.gif" width="80"/>
        <div className="inline">
          {this.buildProgress(d.Usage)}
        </div>
      </div>
    )
  }
  render () {
    return (
      <div className="inline-block">
        {this.renderContent()}
      </div>
    )
  }
}

export default CpuTable
