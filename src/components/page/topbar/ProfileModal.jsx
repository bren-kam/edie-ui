import React from 'react'
import Modal from 'react-bootstrap-modal'
import {
    Button,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { assign } from 'lodash'
import $ from 'jquery'

import { showAlert } from 'components/shared/Alert.jsx'
import { fetchUserInfo, updateUserProfile, closeProfileModal } from 'actions/index'


const renderInput = field => (
    <div className="row margin-md-bottom">
        <label className="control-label col-md-3 text-right">{field.label}</label>
        <div className="col-md-9">
            <input {...field.input} type={field.type} className="form-control" disabled={field.disabled}/>
        </div>
    </div>
)

class ProfileModal extends React.Component {
    constructor(props) {
        super(props)

        const {user} = props

        this.state = {
            imgSrc: '',
            // defaultmap: props.user.defaultmap,

            maps: []
        }
    }

    componentWillMount() {
        this.props.fetchUserInfo()
    }

    render() {
        let {user, handleSubmit} = this.props

        return (
            <Modal show={true} onHide={this.onHide.bind(this)}
                   aria-labelledby="ModalHeader" className="bootstrap-dialog type-primary">

                <div className="modal-header">
                    <h4 className="modal-title bootstrap-dialog-title">
                        Profile
                    </h4>
                    <div className="bootstrap-dialog-close-button">
                        <button className="close"
                                onClick={this.onClickClose.bind(this)}>×</button>
                    </div>
                </div>

                <div className="modal-body bootstrap-dialog-message">

                    {this.renderForm()}
                </div>
            </Modal>
        )
    }

    renderForm() {
        let {user, handleSubmit} = this.props
        if (!user) return null

        return (
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

                <div className="row margin-md-bottom text-center">
                    <div className='fileinput-button'>
                        <img className="img-circle profile-image" src={this.state.imgSrc || ("/externalpictures?name=" + user.image)} width="128" height="128"/>
                        <input type="file" ref="file" onChange={this.onChangeImage.bind(this)}/>
                    </div>

                </div>


                <Field name="username" component={renderInput} type="text" label="User Name" disabled={true}/>
                <Field name="fullname" component={renderInput} type="text" label="Full Name"/>
                <Field name="password" component={renderInput} type="password" label="Password"/>
                <Field name="email" component={renderInput} type="text" label="Email"/>
                <Field name="phone" component={renderInput} type="text" label="Phone"/>

                <div className="row margin-md-bottom">
                    <label className="control-label col-md-3  text-right">Default
                        Map</label>
                    <div className="col-md-9">
                        <select className="form-control" ref="defaultmap"
                                onChange={this.onChangeMap.bind(this)}>{
                            this.props.maps.map(item =>
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            )
                        }</select>
                    </div>
                </div>

                <div className="row margin-md-bottom">
                    <label className="control-label col-md-3  text-right">Role</label>
                    <div className="col-md-9">
                        <select className="form-control"
                                value={(user.role || '').toLowerCase()}
                                disabled="disabled">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="row margin-md-bottom">
                    <label className="control-label col-md-3  text-right">Enabled</label>
                    <div className="col-md-9 checkbox" style={{marginTop: "8px"}}>
                        <label> <input type="checkbox"
                                       ref="enabled" disabled="disabled" defaultChecked={user.enabled == true}/>
                        </label>
                    </div>
                </div>

                <div className="text-right p-none">
                    <Button className="btn-primary btn-sm" type="submit">Save</Button>
                    <Button className="margin-sm-left btn-sm"
                            onClick={this.onClickClose.bind(this)}>Cancel</Button>
                </div>
            </form>
        )
    }

    onHide() {
        this.onClickClose()
    }

    closeModal(data) {
        this.props.closeProfileModal()
    }

    onClickClose() {
        this.closeModal()
    }


    handleFormSubmit(values) {
        const {user} = this.props

        this.uploadUserImage(image => {
            let props = assign({}, user, values, {
                mapids: [this.refs.defaultmap.value],
            })
            if (image) props.image = image

            console.log(props)
            this.props.updateUserProfile(props)
        })


    }
    //////////////////////////////////////////////////////////

    uploadUserImage(cb) {


        let input = this.refs.file

        if (!input.files || !input.files.length) return cb()

        let file = input.files[0]

        let formData = new FormData()
        formData.append('file', file, input.value.split(/(\\|\/)/g).pop())

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,

            success: (data, textStatus, jqXHR) => {
                const img = data.filename
                cb(img);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                showAlert("Failed to upload.")
            }
        })
    }

    //////////////////////////////////////////////////////////

    onChangeImage(e) {
        const input = e.target;
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = v => {
                this.setState({
                    imgSrc: v.target.result
                })
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    onChangeMap(e) {
        this.setState({
            defaultmap: e.target.value
        })
    }
}

ProfileModal.defaultProps = {
}

ProfileModal = reduxForm({
    form: 'userProfileForm'
})(ProfileModal)

function mapStateToProps(state) {
    const user = state.dashboard.userInfo
    return {
        user,
        maps: state.dashboard.maps,
        initialValues: user
    }
}

export default connect(mapStateToProps, { fetchUserInfo,updateUserProfile, closeProfileModal })(ProfileModal)