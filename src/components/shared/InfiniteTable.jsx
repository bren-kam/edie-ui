import React from 'react'
import ReactDOM from 'react-dom'
import Griddle from 'griddle-react'
import { concat, assign, isEqual } from 'lodash'
import Dimensions from 'react-dimensions'

import $ from 'jquery'

class InfiniteTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 0,
            isLoading: false,
            maxPages: 0,
            externalSortColumn:null,
            externalSortAscending:true,
            results: [],
            total: 0,

            selected: []
        }

        this.defaultRowMetaData = {
            "bodyCssClassName": this.getBodyCssClassName.bind(this)
        }

        this.lastRequest = null
    }

    componentDidMount() {
        if (this.props.useExternal)
            this.getExternalData()


        this.domNode = ReactDOM.findDOMNode(this.refs.griddle)
        $(this.domNode).on('dblclick', 'tbody tr', (e) => {
            const index = $(e.target).closest('tr').index() - 1
            const data = this.getCurrentData()
            if (data && data[index]) {
                var row = { props: { data: data[index]}}
                this.onRowClick(row)
                this.onRowDblClick(row)
            }

        })
    }

    componentWillUnmount() {
        $(this.domNode).off('dblclick')
        if (this.lastRequest) {
            this.lastRequest.abort()
            this.lastRequest = null
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {url, params} = this.props
        if (url != prevProps.url || !isEqual(params, prevProps.params)) {
            this.refresh()
        }
    }

    getCurrentData() {
        return this.props.useExternal ? this.state.results : this.props.data
    }

    getExternalData(page, clear) {
        page = clear ? 1 : (page||1)

        const {url, params, pageSize} = this.props

        let urlParams = assign({
            draw: 1,
            start: (page - 1) * pageSize,
            length: pageSize || 10,
        }, params)

        this.setState({
            isLoading: true
        });

        this.lastRequest = $.get(url, urlParams).done(res => {

            let state = {
                results: concat((clear ? [] : this.state.results), res.data),
                currentPage: page - 1,
                maxPages: Math.round(res.recordsTotal / pageSize),
                total: res.recordsTotal,
                isLoading: false,
            }

            this.setState(state)
        })

        return this.lastRequest
    }

    setPage(index){
        //This should interact with the data source to get the page at the given index
        index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1
        this.getExternalData(index)
    }

    setPageSize(size){

    }

    getBodyCssClassName(data) {
        if (!this.props.selectable) return ""
        if (this.state.selected.indexOf(data[this.props.rowMetadata.key]) >= 0) return "selected"
        return ""
    }

    getTotalCount() {
        return this.state.useExternal ? this.state.total : this.props.data.length
    }

    render() {
        let rowMetadata = assign({}
            , this.defaultRowMetaData
            , this.props.rowMetadata || {})

        return (
            <Griddle
                id={this.props.id}
                useExternal={this.props.useExternal}

                enableSort={false}
                enableInfiniteScroll={true}

                columns={this.props.cells.map(item => item.columnName)}
                columnMetadata={this.props.cells}
                rowMetadata={rowMetadata}

                externalSetPage={this.setPage.bind(this)}
                externalSetPageSize={this.setPageSize.bind(this)}
                externalMaxPage={this.state.maxPages}
                externalChangeSort={function(){}}
                externalSetFilter={function(){}}
                externalCurrentPage={this.state.currentPage}
                externalSortColumn={this.state.externalSortColumn}
                externalSortAscending={this.state.externalSortAscending}
                externalLoadingComponent={() => <div>Loading...</div>}
                externalIsLoading={this.state.isLoading}

                results={this.getCurrentData()}
                resultsPerPage={this.props.pageSize}

                tableClassName="table table-hover"

                useFixedHeader={false}
                noDataMessage={this.props.noDataMessage}
                bodyHeight={this.props.containerHeight || this.props.bodyHeight}
                useGriddleStyles={false}

                onRowClick={this.onRowClick.bind(this)}

                onRowDblClick={this.onRowDblClick.bind(this)}

                ref="griddle"
            />
        )

    }

    onRowClick(row) {
        if (!this.props.selectable) return
        this.setState({
            selected: [row.props.data[this.props.rowMetadata.key]]
        })
    }

    onRowDblClick(row) {
        if (!this.props.selectable) return
        this.setState({
            selected: [row.props.data[this.props.rowMetadata.key]]
        }, () => {
            this.props.onRowDblClick &&
            this.props.onRowDblClick(this.getSelected())
        })
    }

    getSelectedIndex() {
        let found = -1
        const results = this.getCurrentData()
        results.forEach((item, i) => {
            if (this.state.selected.indexOf(item[this.props.rowMetadata.key]) >= 0) {
                found = i
                return false
            }
        })
        return found
    }
    getSelected() {
        let found = null
        const results = this.getCurrentData()
        results.forEach(item => {
            if (this.state.selected.indexOf(item[this.props.rowMetadata.key]) >= 0) {
                found = item
                return false
            }
        })
        return found
    }

    refresh() {
        // this.setState({
        //     results: [],
        //     currentPage: 0,
        //     maxPages: 0,
        // }, () => {
        //     this.getExternalData()
        // })
        if (this.props.useExternal)
            this.getExternalData(1, true)
    }
}

InfiniteTable.defaultProps = {
    id: null,
    url: '',
    params: null,
    cells: [],
    useExternal: true,
    data: [],

    pageSize: 50,
    rowMetadata: {},
    bodyHeight: 100,

    selectable: false,
    noDataMessage: "",
}

export const ResponsiveInfiniteTable = Dimensions()(InfiniteTable)
export default InfiniteTable