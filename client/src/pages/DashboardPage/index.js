import React, { Component } from "react";

import Page from "../../components/containers/Page";

import Dashboard from "../../components/dashboard";
class DashboardPage extends Component {
  render() {
    return (
      <Page className="column align-center py64 px64">
        <Dashboard />
      </Page>
    );
  }
}

export default DashboardPage;
