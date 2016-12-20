import React from 'react'
import {InputField} from 'react-serial-forms'

export default class Password extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        let config = this.props.config
        let values = this.props.values

        let defaultValue = null

        if (config.name && values[config.name] != undefined)
            defaultValue = values[config.name]

        return (
            <InputField type="password"
                   className={"form-control"}
                   name={config.name}
                   defaultValue={defaultValue}
                   validation={config.required ? "required" : null}/>
        )
    }
}

Password.defaultProps = {
    config: {},
    values: {},
}