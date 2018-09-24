import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import "./styles/";

class MySubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: undefined
    };
    this.getInvoices();
  }
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  getInvoices = () => {
    axios.get("/api/user/invoices").then(res => {
      const { success, message, invoices } = res.data;
      if (!success) alert(message);
      else this.setState({ invoices });
    });
  };
  createInvoiceRows = invoices => {
    let invoiceRowDivs = [];

    for (let index in invoices) {
      let invoice = invoices[index];

      invoiceRowDivs.push(
        <div className="invoice-container-row" key={index + "row"}>
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
        </div>
      );
    }

    return invoiceRowDivs;
  };

  render() {
    const { invoices } = this.state;
    let invoiceRowDivs;
    if (invoices) invoiceRowDivs = this.createInvoiceRows(invoices);
    return (
      <div  >
        <div className="invoice-container">{invoiceRowDivs}</div>
      </div>
    );
  }
}
export default MySubscription;
