import React, { Component } from "react";
import PayDiv from "./PayDiv";

import "./styles/";

class SubscribePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      annualBilling: true,
      plan: {
        name: "Professional",
        monthlyCost: 47,
        yearlyCost: 480
      }
    };
  }

  render() {
    const { annualBilling, plan } = this.state;

    let { monthlyCost } = plan;
    let amountDue = plan.monthlyCost;

    if (annualBilling) {
      monthlyCost = plan.yearlyCost / 12;
      amountDue = plan.yearlyCost;
    }

    return (
      <div  >
        <div className="plans-page-container">
          <div className="checkout-container">
            <div className="checkout-title">Checkout</div>

            <div className="checkout-row-container">
              <div className="checkout-plan-label">Plan</div>
              <div className="checkout-plan">{plan.name}</div>
            </div>

            <div className="pay-div-container">
              <div className="payment-length-container">
                <div
                  className={
                    annualBilling
                      ? "payment-length-option active"
                      : "payment-length-option"
                  }
                  onClick={() => this.setState({ annualBilling: true })}
                >
                  ANNUAL BILLING
                </div>
                <div
                  className={
                    !annualBilling
                      ? "payment-length-option active"
                      : "payment-length-option"
                  }
                  onClick={() => this.setState({ annualBilling: false })}
                >
                  MONTHLY BILLING
                </div>
              </div>

              <div className="checkout-row-container">
                <div className="checkout-payment-monthly-label">
                  Total Monthly Payment
                </div>
                <div className="checkout-payment-monthly">${monthlyCost}</div>
              </div>

              <div className="checkout-row-container">
                <div className="checkout-payment-total-due-label">
                  TOTAL DUE
                </div>
                <div className="checkout-payment-total-due">${amountDue}</div>
              </div>

              <PayDiv annualBilling={annualBilling} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SubscribePage;
