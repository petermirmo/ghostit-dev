import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from './actions'
import LoginPage from './pages/LoginPage'
import Content from './pages/ContentPage'

class Routes extends Component {
  render() {
    // TODO: Add a check that the user is logged in, if not, then redirect to path="/login"
    return (
      <BrowserRouter>
        <div>
          <Route path="/" exact={true} component={LoginPage} />
          <Route path="/content" exact={true} component={Content} />
        </div>
      </BrowserRouter>
    )
  }
}

export default connect(null, actions)(Routes)
