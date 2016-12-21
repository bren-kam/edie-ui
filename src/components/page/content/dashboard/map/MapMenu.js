import React from 'react'
import {connect} from 'react-redux'
import {assign} from 'lodash'

import { appendComponent, removeComponent } from '../../../../../util/Component'

import MapSelect from './MapSelect.js'
import MapSaveModal from './MapSaveModal.js'
import MapImportModal from './MapImportModal.js'
import { showAlert, showPrompt, showConfirm } from '../../../../../components/shared/Alert'

import { addMap, updateMap, deleteMap, openMapImportModal } from '../../../../../actions/index'

class MapMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mapExportModalVisible: false,
        }
    }

    render() {
        return (
            <div style={{position: "absolute", left: "7px", top: "15px"}}>
                <MapSelect ref="select"/>

                <ul className="nav nav-tabs" style={{background: "transparent", display: "inline-block"}}>
                    <li className="dropdown">
                        <a href="javascript:;" className="option p-none" onClick={this.onClickAdd.bind(this)}>
                            <i className="fa fa-plus-square" title="Add Map"></i>
                            <b className="caret" style={{position: "absolute", left: "44%", top: "23px"}}></b>
                        </a>
                        <ul className="dropdown-menu">
                            <li>
                                <a href="javascript:;" className="option" onClick={this.onClickRename.bind(this)}>
                                    <i className="fa fa-edit margin-md-right"></i>Rename Map
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;" className="option" onClick={this.onClickDelete.bind(this)}>
                                    <i className="fa fa-trash-o margin-md-right"></i>Delete Map
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;" className="option" onClick={this.onClickSave.bind(this)}>
                                    <i className="fa fa-save margin-md-right"></i>Export Map
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;" className="option" onClick={this.onClickImport.bind(this)}>
                                    <i className="fa fa-upload margin-md-right"></i>Import Map
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>

                {this.renderMapExportModal()}
                {this.renderMapImportModal()}
            </div>
        )
    }

    renderMapExportModal() {
        if (!this.state.mapExportModalVisible) return
        return (
            <MapSaveModal mapId={this.props.selectedMap.id}
                          onClose={() => { this.setState({ mapExportModalVisible: false }) }}/>
        )
    }

    renderMapImportModal() {
        if (!this.props.mapImportModalVisible) return
        return (
            <MapImportModal />
        )
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onClickAdd() {

        showPrompt("Please input map name.", "New Map", name =>{
            if (!name) return;

            this.props.addMap({name})
        });
    }

    onClickDelete() {
        const {selectedMap} = this.props
        if(!selectedMap) return showAlert('Please choose a map to delete.')

        showConfirm("Are you sure that you want to delete the map?", btn => {
            if(btn != 'ok') return

            this.props.deleteMap(selectedMap)
        });
    }

    onClickSave() {
        if (!this.props.selectedMap) return showAlert("Please choose map.")
        this.setState({
            mapExportModalVisible: true
        })
    }

    onClickImport() {
        this.props.openMapImportModal()
    }

    onClickRename() {
        const { selectedMap } = this.props

        console.log(selectedMap)

        if(!selectedMap) {
            showAlert('Please choose a map.');
            return;
        }

        showPrompt('Please type name.', selectedMap.name, (name) => {
            if (!name) return
            this.props.updateMap(assign({}, selectedMap, {name}))
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

function mapStateToProps(state) {
    const {maps, selectedMap, mapImportModalVisible} = state.dashboard
    return {maps, selectedMap, mapImportModalVisible}
}

export default connect(mapStateToProps, { addMap, updateMap, deleteMap, openMapImportModal })(MapMenu)