import React from 'react'
import Modal from 'react-bootstrap-modal'
import {
    Button,
} from 'react-bootstrap'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { assign } from 'lodash'
import { showAlert } from 'components/shared/Alert.jsx'

import { fetchCredentials, addCredentials, updateCredentials, closeCredentialsModal } from 'actions/index'

const renderInput = field => (
    <div className="row margin-md-bottom">
        <label className="control-label col-md-3">{field.label}</label>
        <div className="col-md-9">
            <input {...field.input} type={field.type} className="form-control"/>
        </div>
    </div>
)

class CredentialModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true
        }
    }

    render() {

        const { handleSubmit } = this.props

        return (
            <Modal show={this.state.open} onHide={this.onHide.bind(this)}
                   aria-labelledby="ModalHeader" className="bootstrap-dialog type-primary">

                <div className="modal-header">
                    <h4 className="modal-title bootstrap-dialog-title">
                        Credentials
                    </h4>
                    <div className="bootstrap-dialog-close-button">
                        <button className="close"
                                onClick={this.onClickClose.bind(this)}>×</button>
                    </div>
                </div>

                <div className="modal-body bootstrap-dialog-message">

                    <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                        <Field name="name" component={renderInput} type="text" label="Name"/>
                        <Field name="username" component={renderInput} type="text" label="User Name"/>
                        <Field name="password" component={renderInput} type="text" label="Password"/>
                        <Field name="description" component={renderInput} type="text" label="Description"/>

                        <div className="text-right">
                            <Button className="btn-primary btn-sm" type="submit">Save</Button>
                            <Button className="btn-sm margin-sm-left"
                                    onClick={this.onClickClose.bind(this)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        )
    }

    onHide() {
        this.onClickClose()
    }

    closeModal() {
        this.props.closeCredentialsModal()
    }

    onClickClose() {
        this.closeModal()
    }


    handleFormSubmit(values) {
        const { editCredentials } = this.props

        let props = assign({}, editCredentials, values)

        if (!props.name) return showAlert("Please type name.")

        if ( editCredentials ) {
            this.props.updateCredentials(props)
        } else {
            this.props.addCredentials(props)
        }
    }
}

CredentialModal.defaultProps = {
    credentials: null
}

CredentialModal = reduxForm({
    form: 'credentialsEditForm'
})(CredentialModal)

function mapStateToProps(state) {
    return {
        editCredentials: state.settings.editCredentials,
        initialValues: state.settings.editCredentials
    }
}

const actions = {
    fetchCredentials,
    addCredentials, updateCredentials,
    closeCredentialsModal
}

export default connect(mapStateToProps, actions)(CredentialModal)