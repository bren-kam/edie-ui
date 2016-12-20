import React from 'react'
import { connect } from 'react-redux'

import { mainMenu, deviceMenu, contentType } from '../Config.jsx'

class Sidebar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tooltipTop: 0,
            tooltipText: '',
        }
    }

    componentDidMount() {
        this.initMenuItemHover()
    }

    componentWillUnmount() {
        this.destoryMenuItemHover()
    }

    render() {

        const {device, pageId, pageType} = this.props
        const group = device && device.type == 'group'

        return (
            <aside className="sidebar sidebar-default">
                <div className="sidebar-minimize">
                    <a href="javascript:;"
                       style={{color:"white"}} onClick={this.onClickToggleSidebar.bind(this)}>
                        <i className="fa fa-lg fa-fw fa-bars"></i>
                    </a>
                </div>
                <nav ref="nav">
                    <ul className="nav nav-pills nav-stacked" style={{display: contentType.Main == pageType ? "block" : "none"}}>

                        {mainMenu.map((item, index) =>
                            <li key={index}
                                className={pageId == item.id ? "active open" : ""}
                                onClick={this.onClickMainMenu.bind(this, index)}>

                                <a href="javascript:;">
                                    <i className={"fa fa-lg fa-fw " + item.icon}></i>{item.title}
                                </a>
                            </li>
                        )}

                    </ul>


                    <ul className="nav nav-pills nav-stacked"
                        style={{display: contentType.Device == pageType ? "block" : "none"}}>

                        {deviceMenu.map((item, index) => {
                                if (item.group && !group) return null
                                return (
                                    <li key={index} className={pageId == item.id ? "active open" : ""}
                                        onClick={this.onClickDeviceMenu.bind(this, index)}>
                                        <a href="javascript:;">
                                            <i className={"fa fa-lg fa-fw " + item.icon}></i>{item.title}
                                        </a>
                                    </li>
                                )
                            }
                        )}
                    </ul>
                </nav>
                <h5 className="sidebar-header hidden">Incidents</h5>
                <div style={{padding: "0 10px 10px 10px"}} className="padding-sm graph-stack hidden">
                    <span className="graph-title">Incidents By Type</span>
                    <div id="maingraph" style={{background: "white"}}></div>

                    <span className="graph-title">Incidents By IP</span>
                    <div id="maingraph2" style={{background:"white"}}></div>
                </div>

                <div className={"sidebar-tooltip" + (this.state.tooltipText ? '' : ' hidden')}
                     style={{top: this.state.tooltipTop + 'px'}}
                     ref="tooltipBody">

                    <div className="forceIcon">
                        <i className="fa fa-caret-left fa-2x"></i>
                    </div>
                    <span>{this.state.tooltipText}</span>

                </div>
            </aside>
        );
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    initMenuItemHover() {
        const nav = this.refs.nav
        $(nav).on('mouseover', 'li', (e) => {
            if (!$('body').hasClass('sidebar-condensed')) return

            let li = $(e.target).closest('li')

            this.setState({
                tooltipTop: li.position().top + 5,
                tooltipText: li.find('a').text()
            })
        })

        $(nav).on('mouseout', 'li', (e) => {
            this.setState({ tooltipText: '' })
        })

        $(nav).on('touchend', 'li', (e) => {
            this.setState({ tooltipText: '' })
        })
    }

    destoryMenuItemHover() {
        const nav = this.refs.nav
        $(nav).off('mouseover', 'li')
        $(nav).off('mouseout', 'li')
        $(nav).off('touchend', 'li')
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onClickToggleSidebar() {
        $('body').toggleClass('sidebar-condensed')
    }


    onClickDeviceMenu(index) {
        this.setState({ tooltipText: '' })
        this.props.onClickItem(contentType.Device, deviceMenu[index])

    }

    onClickMainMenu(index) {
        this.setState({ tooltipText: '' })
        this.props.onClickItem(contentType.Main, mainMenu[index])
    }

    onMapDeviceClicked(device) {
        // this.setState({device}, () => {
        //     var menuItems = $('#tab-device li').not(':eq(0)');
        //     menuItems.removeClass('active');
        //
        //     $('.btn-main').click()
        // })
    }
}

Sidebar.defaultProps = {
    device: null,
    pageId: 'dashboard',
    pageType: 'main',
}

export default connect()(Sidebar)