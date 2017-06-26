import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import {parse} from 'query-string'

class Signin extends Component {

  handleFormSubmit ({ email, password }) {
    const { signUser, location, history } = this.props
    const params = parse(location.search)
    signUser({ email, password }, params['redirect'], history)
  }

  renderAlert () {
    let { errorMessage } = this.props
    if (errorMessage) {
      return (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )
    }
  }

  renderInput (field) {
    return (
      <div>
        <input className={`form-control ${field.className}`}
          {...field.input}
          type={field.type}
          placeholder={field.label}
        />
      </div>
    )
  }

  render () {
    const { handleSubmit } = this.props
    return (
      <div className="login">
        <div className="heading">
          <h1>Incident Manager</h1>
          <p>Version 2017.2</p>
        </div>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <div className="box">
            <div className="logo"><img src="/images/logo.png" /></div>
            <div className="form">
              <div className="field"><img src="/images/user_icon.png" /></div>
              <Field name="email" component={this.renderInput} type="text" label="Username" className="text_field"/>

              <div className="line" />

              <div className="field"><img src="/images/pass_icon.png"/></div>
              <Field name="password" component={this.renderInput} type="password" label="Password" className="text_field" />

            </div>
            <button type="submit" style={{border: 'none', padding: 0, background: 'none'}}>
              <img src="/images/log_in_btn.png"/>
            </button>

            { this.renderAlert() }
          </div>
        </form>
        <div className="copyright_text">
          Copyright 2017 SecuRegion Ltd. All Rights Reserved.
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'signin'
})(Signin)
