import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AmCharts from "@amcharts/amcharts3-react";

import LineChart from "../../components/LineChart/";

import "./styles/";

var opt = {
  data: [
    [97, 92, 89, 30, 72],
    [43, 62, 84, 98, 3],
    [23, 88, 52, 14, 4],
    [76, 9, 1, 67, 84]
  ],
  colors: ["#7B43A1", "#F2317A", "#FF9824", "#58CF6C"],
  labels: ["Cats", "Dogs", "Ducks", "Cows"],
  axis: ["October", "November", "December", "January", "February", "Marsh"]
};

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.getPosts();
    this.state = {};
  }

  componentDidMount() {
    this.getAccountAnalytics();
  }

  getAccountAnalytics = () => {
    axios.get("/api/ai/analytics/accounts").then(res => {
      const { analyticsObjects } = res.data;
      this.setState({ analyticsObjects });
    });
  };

  getPostAnalytics = () => {
    axios.get("/api/ai/analytics/posts").then(res => {
      const { analyticsObjects } = res.data;
      console.log(res.data);
    });
  };

  requestAllFacebookPageAnalytics = () => {
    axios.get("/api/facebook/page/analytics/all").then(res => {
      const { success } = res.data;
      if (!success) {
        alert(res.data.message);
        return;
      } else {
        this.getAccountAnalytics();
      }
    });
  };

  requestAllFacebookPostAnalytics = () => {
    axios.get("/api/facebook/post/analytics/all").then(res => {
      const { success } = res.data;
      if (!success) {
        if (res.data.message) alert(res.data.message);
        return;
      } else {
      }
    });
  };

  getPosts = () => {
    let facebookPosts = [];
    axios.get("/api/posts").then(res => {
      let { posts } = res.data;

      for (let index in posts) {
        if (posts[index].socialType === "facebook") {
          facebookPosts.push(posts[index]);
        }
      }
      this.setState({
        facebookPosts
      });
    });
  };

  displayFBAnalyticsObj = obj => {
    const { showMetricsArray, activeMonthIndexArray } = this.state;
    let metricArray = [];
    for (let i = 0; i < obj.analytics.length; i++) {
      const metric = obj.analytics[i];
      metricArray.push(
        <div className="metric-container" key={i + "metricObj"}>
          <h2>{metric.title}</h2>
          <div
            className="show-metric-toggle button"
            onClick={() => {
              this.setState(prevState => {
                return {
                  showMetricsArray: [
                    ...prevState.showMetricsArray.slice(0, i),
                    prevState.showMetricsArray[i] ? false : true,
                    ...prevState.showMetricsArray.slice(i + 1)
                  ],
                  activeMonthIndexArray: [
                    ...prevState.activeMonthIndexArray.slice(0, i),
                    prevState.activeMonthIndexArray[i] === undefined
                      ? 0
                      : prevState.activeMonthIndexArray[i],
                    ...prevState.activeMonthIndexArray.slice(i + 1)
                  ]
                };
              });
            }}
          >
            Toggle
          </div>
          {showMetricsArray[i] && (
            <div className="metric-graph-container">
              <FontAwesomeIcon
                icon={faAngleLeft}
                size="1x"
                className="left-arrow button common-transition"
                onClick={() => {
                  this.setState(prevState => {
                    return {
                      activeMonthIndexArray: [
                        ...prevState.activeMonthIndexArray.slice(0, i),
                        prevState.activeMonthIndexArray[i] === 0
                          ? 0
                          : prevState.activeMonthIndexArray[i] - 1,
                        ...prevState.activeMonthIndexArray.slice(i + 1)
                      ]
                    };
                  });
                }}
              />
              {" " +
                metric.monthlyValues[activeMonthIndexArray[i]].month +
                "-" +
                metric.monthlyValues[activeMonthIndexArray[i]].year +
                " "}
              <FontAwesomeIcon
                icon={faAngleRight}
                size="1x"
                className="right-arrow button common-transition"
                onClick={() => {
                  this.setState(prevState => {
                    return {
                      activeMonthIndexArray: [
                        ...prevState.activeMonthIndexArray.slice(0, i),
                        prevState.activeMonthIndexArray[i] ===
                        metric.monthlyValues.length - 1
                          ? prevState.activeMonthIndexArray[i]
                          : prevState.activeMonthIndexArray[i] + 1,
                        ...prevState.activeMonthIndexArray.slice(i + 1)
                      ]
                    };
                  });
                }}
              />
              {this.monthToGraph(
                metric.monthlyValues[activeMonthIndexArray[i]]
              )}
            </div>
          )}
        </div>
      );
    }
    return metricArray;
  };

  monthToGraph = monthObj => {
    const dataProvider = [];
    for (let i = 0; i < monthObj.values.length; i++) {
      let dayObj = monthObj.values[i];
      if (dayObj.value.length === 0) {
        dataProvider.push({ day: dayObj.day, value: 0 });
      } else if (dayObj.value.length === 1) {
        dataProvider.push({ day: dayObj.day, value: dayObj.value[0].value });
      } else {
        return undefined;
      }
    }
    if (dataProvider.length === 0) {
      return undefined;
    }
    const config = {
      type: "serial",
      categoryField: "day",
      graphs: [
        {
          valueField: "value",
          type: "line",
          bullet: "round",
          balloonText: "[[category]]: <b>[[value]]</b>"
        }
      ],
      dataProvider
    };
    return (
      <AmCharts.React
        style={{ width: "100%", height: "340px" }}
        options={config}
      />
    );
  };

  getValuesFromFBDayObj = dayObj => {
    if (dayObj.value.length === 0) {
      return "-";
    } else {
      let result = "";
      for (let i = 0; i < dayObj.value.length; i++) {
        const value = dayObj.value[i];
        if (value.key === "value") {
          result += value.value + " ";
        } else {
          result += '"' + value.key + '"' + ":" + value.value + " ";
        }
      }
      return result;
    }
  };

  render() {
    let { accounts } = this.props;
    let { facebookPosts, analyticsObjects, activeAnalyticsIndex } = this.state;

    if (this.props.user.role !== "admin") {
      return <div>Under Construction</div>;
    }

    return (
      <div className="wrapper" style={this.props.margin}>
        {this.props.user.role === "admin" &&
          false && (
            <div className="test-container">
              <div
                onClick={() => this.requestAllFacebookPageAnalytics()}
                className="here"
              >
                Request FB Page Analytics
              </div>
              <div
                onClick={() => this.requestAllFacebookPostAnalytics()}
                className="here"
              >
                Request FB Post Analytics
              </div>
              <div onClick={() => this.getPostAnalytics()} className="here">
                Console log FB Post Analytics
              </div>
            </div>
          )}
        {this.props.user.role === "admin" &&
          false &&
          analyticsObjects && (
            <div className="test-container">
              {analyticsObjects.map((obj, index) => {
                return (
                  <div
                    className="here"
                    key={index + "account"}
                    onClick={() =>
                      this.setState({
                        activeAnalyticsIndex: index,
                        showMetricsArray: [],
                        activeMonthIndexArray: []
                      })
                    }
                  >
                    {obj.accountName ? obj.accountName : "Unknown Name"}
                  </div>
                );
              })}
            </div>
          )}
        {activeAnalyticsIndex !== undefined &&
          false && (
            <div className="analytics-display">
              {this.displayFBAnalyticsObj(
                analyticsObjects[activeAnalyticsIndex]
              )}
            </div>
          )}
        <LineChart {...opt} area={true} />
        <LineChart {...opt} dots={true} lines={true} />
        <LineChart
          {...opt}
          width={600}
          height={50}
          stroke={2}
          radius={6}
          dots={true}
          grid={false}
          hideLabels={true}
        />
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
