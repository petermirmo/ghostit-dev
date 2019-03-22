import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import { connect } from "react-redux";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";

import LoaderSimpleCircle from "../../components/notifications/LoaderSimpleCircle";

import "./style.css";

class MySubscription extends Component {
  state = {
    invoices: undefined,
    databaseConnection: false
  };
  componentDidMount() {
    this._ismounted = true;
    this.getInvoices();
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  getInvoices = () => {
    axios.get("/api/user/invoices").then(res => {
      const { success, message, invoices } = res.data;
      if (success) this.setState({ invoices, databaseConnection: true });
      else this.setState({ databaseConnection: true });
    });
  };
  createInvoiceRows = invoices => {
    let invoiceRowDivs = [];

    for (let index in invoices) {
      let invoice = invoices[index];

      invoiceRowDivs.push(
        <GIContainer
          className="invoice-container-row x-fill py16 px32"
          key={index}
        >
          <div className="item">
            {new moment(invoice.date * 1000).format("LL")}
          </div>
          <div className="item " key={index + "index1"}>
            ${invoice.amount_due / 100}.00
          </div>
          <div className="item italic" key={index + "index2"}>
            {invoice.amount_due === invoice.amount_paid ? "Paid" : "Not Paid"}
          </div>
          <a
            download
            href={invoice.invoice_pdf}
            className="item button"
            key={index + "index4"}
          >
            Download Invoice
          </a>
        </GIContainer>
      );
    }

    return invoiceRowDivs;
  };

  render() {
    const { invoices, databaseConnection } = this.state;
    let invoiceRowDivs = [];
    if (invoices) invoiceRowDivs = this.createInvoiceRows(invoices);
    return (
      <Page title="Subscriptions">
        <GIContainer className="invoice-container x-fill full-center column mt64">
          {invoiceRowDivs.length !== 0 && invoiceRowDivs}
          {invoiceRowDivs.length === 0 && databaseConnection && (
            <GIText
              className="tac x-fill pa16"
              text="You do not pay Ghostit through our online services therefore we cannot display your invoices here!"
              type="h2"
            />
          )}
          {!databaseConnection && <LoaderSimpleCircle />}
        </GIContainer>
      </Page>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(MySubscription);
