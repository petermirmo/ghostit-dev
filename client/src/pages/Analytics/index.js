import React, { Component } from "react";

import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";
import Dropdown from "../../components/views/Dropdown";
import LineChart from "../../components/LineChart/";

import NavigationLayout from "../../components/navigations/NavigationLayout";

import {
  calculateNumberOfYearsForGraphDropdown,
  canDisplayMonth,
  getAccountAnalytics,
  getCorrectMonthOfData,
  getDataLinesFromAnalytics,
  getLatestAnalyticValue
} from "./util";
import { graphTypes, months, postingTypes } from "../../constants";
import { capitolizeFirstChar } from "../../componentFunctions";
import { getPostColor, getPostIconRound } from "../../componentFunctions";

import "./style.css";

class Analytics extends Component {
  state = {
    activeAnalyticsIndex: 0,
    activeAnalyticsSocialType: 0,
    activeGraphYear: Number(new moment().format("YYYY")),
    activeGraphMonthIndex: Number(new moment().format("MM")) - 1,
    analyticsObjects: undefined,
    graphType: 0
  };

  componentDidMount() {
    const { activeAnalyticsSocialType } = this.state;

    getAccountAnalytics(stateObj => {
      this.handleChange({
        ...getDataLinesFromAnalytics(
          activeAnalyticsSocialType,
          stateObj.analyticsObjects
        ),
        ...stateObj
      });
    });
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  render() {
    const {
      activeAnalyticsIndex,
      activeAnalyticsSocialType,
      activeGraphYear,
      activeGraphMonthIndex,
      analyticsInformationList = [],
      analyticsObjects = [],
      dataPointArrays = [],
      graphType
    } = this.state;
    const { accounts } = this.props;

    const { analyticsDropdownYears } = calculateNumberOfYearsForGraphDropdown(
      analyticsObjects[activeAnalyticsSocialType]
    );

    const { dataPointsInMonth, horizontalTitles } = getCorrectMonthOfData(
      activeGraphYear,
      activeGraphMonthIndex,
      graphType,
      dataPointArrays[activeAnalyticsIndex]
    );

    return (
      <Page className="column x-fill" title="Analytics">
        <NavigationLayout
          className="x-fill"
          data={postingTypes.map((category, index) => {
            return (
              <GIContainer
                className="navigation-button border full-center fill-flex clickable py16"
                onClick={() =>
                  this.handleChange({ activeAnalyticsSocialType: index })
                }
              >
                <GIContainer className="round-icon round full-center">
                  <FontAwesomeIcon
                    color="var(--white-theme-color)"
                    icon={getPostIconRound(category.name)}
                  />
                </GIContainer>
                <GIText
                  className="tac ml8"
                  text={capitolizeFirstChar(category.name)}
                  type="h3"
                />
              </GIContainer>
            );
          })}
        />
        <GIContainer className="mt32">
          <GIContainer className="fill-flex full-center column common-shadow-green green-fade br8 pa16 ml32 mr8">
            <GIContainer className="round-icon mb8">
              <img
                alt=""
                src={require("../../svgs/icons/profile.svg")}
                className="fill-parent"
              />
            </GIContainer>
            <GIText
              className="tac white quicksand"
              text={getLatestAnalyticValue(
                activeAnalyticsSocialType,
                analyticsObjects,
                0,
                true
              )}
              type="h2"
            />
            <GIText className="tac white bold" text="New Visitors" type="h6" />
            <GIText
              className="tac white fs-thirteen"
              text="Last 30 Days"
              type="p"
            />
          </GIContainer>
          <GIContainer className="fill-flex full-center column common-shadow-purple purple-fade br8 pa16 mx8">
            <GIContainer className="round-icon mb8">
              <img
                alt=""
                src={require("../../svgs/icons/profile-with-plus.svg")}
                className="fill-parent"
              />
            </GIContainer>
            <GIText
              className="tac white quicksand"
              text={getLatestAnalyticValue(
                activeAnalyticsSocialType,
                analyticsObjects,
                1,
                true
              )}
              type="h2"
            />
            <GIText className="tac white bold" text="New Followers" type="h6" />
            <GIText
              className="tac white fs-thirteen"
              text="Last 30 Days"
              type="p"
            />
          </GIContainer>
          <GIContainer className="fill-flex full-center column common-shadow-light common-border br8 pa16 mx8">
            <GIContainer className="round-icon mb8">
              <img
                alt=""
                src={require("../../svgs/icons/thumbs-up.svg")}
                className="fill-parent"
              />
            </GIContainer>
            <GIText className="tac quicksand" text="4.1K" type="h1" />
            <GIText className="tac bold" text="Total Likes" type="h6" />
            <GIText className="tac fs-thirteen" text="Last 30 Days" type="p" />
          </GIContainer>
          <GIContainer className="fill-flex full-center column common-shadow-light common-border br8 pa16 mx8">
            <GIContainer className="round-icon mb8">
              <img
                alt=""
                src={require("../../svgs/icons/message.svg")}
                className="fill-parent"
              />
            </GIContainer>
            <GIText className="tac quicksand" text="1.4K" type="h1" />
            <GIText className="tac bold" text="Total Comments" type="h6" />
            <GIText className="tac fs-thirteen" text="Last 30 Days" type="h2" />
          </GIContainer>
          <GIContainer className="fill-flex full-center column common-shadow-orange orange-fade br8 pa16 ml8 mr32">
            <GIContainer className="full-center">
              <GIText
                className="tac white quicksand"
                text={getLatestAnalyticValue(
                  activeAnalyticsSocialType,
                  analyticsObjects,
                  4
                )}
                type="h1"
              />
            </GIContainer>
            <GIText
              className="tac white bold"
              text="Lifetime Total Likes"
              type="h6"
            />
          </GIContainer>
        </GIContainer>
        <GIContainer className="mt16 column px32">
          {analyticsInformationList[activeAnalyticsIndex] && (
            <Dropdown
              dropdownItems={analyticsInformationList.map(obj => obj.title)}
              handleParentChange={dropdownClickedItemObj =>
                this.handleChange({
                  activeAnalyticsIndex: dropdownClickedItemObj.index
                })
              }
              search
              title={
                <GIText
                  className="tac muli bold fill-flex"
                  text={analyticsInformationList[activeAnalyticsIndex].title}
                  type="h3"
                />
              }
            />
          )}
          {analyticsInformationList[activeAnalyticsIndex] && (
            <GIText
              className="tac mt16"
              text={analyticsInformationList[activeAnalyticsIndex].description}
              type="h6"
            />
          )}
          <GIContainer className="justify-between mt32">
            <NavigationLayout
              className=""
              data={graphTypes.map((obj, index) => (
                <GIContainer
                  className="navigation-button clickable full-center mr8 px8"
                  onClick={() => this.handleChange({ graphType: index })}
                >
                  This {capitolizeFirstChar(obj.name)}
                </GIContainer>
              ))}
            />
            <GIContainer>
              {graphType !== 1 && (
                <Dropdown
                  dropdownItems={months.map((month, index) => {
                    if (
                      canDisplayMonth(
                        analyticsObjects[activeAnalyticsSocialType],
                        month,
                        activeGraphYear
                      )
                    )
                      return capitolizeFirstChar(month);
                    else return null;
                  })}
                  handleParentChange={dropdownClickedItemObj =>
                    this.handleChange({
                      activeGraphMonthIndex: dropdownClickedItemObj.index
                    })
                  }
                  title={
                    <GIText
                      className="tac nine-blue bold fill-flex"
                      text={capitolizeFirstChar(months[activeGraphMonthIndex])}
                      type="h5"
                    />
                  }
                />
              )}

              <GIContainer className="ml8">
                <Dropdown
                  dropdownItems={analyticsDropdownYears}
                  handleParentChange={dropdownClickedItemObj =>
                    this.handleChange({
                      activeGraphYear: dropdownClickedItemObj.item
                    })
                  }
                  title={
                    <GIContainer>
                      <GIText
                        className="tac nine-blue bold fill-flex mr8"
                        text="year:"
                        type="h6"
                      />
                      <GIText
                        className="tac bold fill-flex"
                        text={activeGraphYear}
                        type="h5"
                      />
                    </GIContainer>
                  }
                />
              </GIContainer>
            </GIContainer>
          </GIContainer>
          <GIText
            className="tac muli"
            text={
              graphType === 0
                ? new moment().format("MMMM YYYY")
                : new moment().format("YYYY")
            }
            type="h4"
          />
        </GIContainer>
        {analyticsInformationList && (
          <GIContainer className="mt16 px32">
            <LineChart
              className="x-fill"
              line={dataPointsInMonth}
              horizontalTitles={horizontalTitles.map((date, index) =>
                date.date()
              )}
            />
          </GIContainer>
        )}
      </Page>
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
