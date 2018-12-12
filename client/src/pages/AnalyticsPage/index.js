import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import LineChart from "../../components/LineChart/";

import "./style.css";

class Analytics extends Component {
  constructor(props) {
    super(props);

    this.state = { analyticsObjects: undefined, activeAnalytics: [] };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getAccountAnalytics();
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  getAccountAnalytics = () => {
    axios.get("/api/ai/analytics/accounts").then(res => {
      const { analyticsObjects } = res.data;
      if (this._ismounted) this.setState({ analyticsObjects });
    });
  };

  render() {
    let { accounts } = this.props;
    let { facebookPosts, analyticsObjects } = this.state;
    let dataPointArrays = [];
    let dataLinesInformation = [];

    if (analyticsObjects) {
      let analyticsObject = analyticsObjects[3];
      if (analyticsObject) {
        for (let index in analyticsObject.analytics) {
          let dataPointArray = [];

          dataLinesInformation.push({
            description: analyticsObject.analytics[index].description,
            title: analyticsObject.analytics[index].title
          });
          for (let index2 in analyticsObject.analytics[index].monthlyValues) {
            for (let index3 in analyticsObject.analytics[index].monthlyValues[
              index2
            ].values) {
              if (
                analyticsObject.analytics[index].monthlyValues[index2].values[
                  index3
                ].value[0]
              )
                dataPointArray.push(
                  analyticsObject.analytics[index].monthlyValues[index2].values[
                    index3
                  ].value[0].value
                );
              else dataPointArray.push(0);
            }
          }
          dataPointArrays.push(dataPointArray);
        }
      }
    }

    let singleDataArray = [];
    if (dataPointArrays[0]) singleDataArray[0] = dataPointArrays[9];

    if (this.props.user.role !== "admin") {
      return <div>Under Construction</div>;
    }

    return (
      <div className="flex">
        <div className="flex column line-chart-navigation-container">
          {dataLinesInformation.map((object, index) => (
            <div
              className="line-chart-navigation-item button ma4 pa4"
              onClick={() => {}}
              key={index + "item"}
            >
              {object.title}
            </div>
          ))}
        </div>
        <div className="line-chart-container">
          <LineChart
            {...{
              lines: singleDataArray,
              colors: ["#7B43A1", "#F2317A", "#FF9824", "#58CF6C"],
              labels: ["Cats", "Dogs", "Ducks", "Cows"],
              axis: [
                "October",
                "November",
                "December",
                "January",
                "February",
                "Marsh"
              ]
            }}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    user: state.user
  };
}
export default connect(mapStateToProps)(Analytics);
