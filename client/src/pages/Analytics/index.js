import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";

import { ExtraContext } from "../../context";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";
import Dropdown from "../../components/views/Dropdown";
import LineGraph from "../../components/graphs/LineGraph/";
import PieGraph from "../../components/graphs/PieGraph/";
import LoaderSimpleCircle from "../../components/notifications/LoaderSimpleCircle/";

import NavigationLayout from "../../components/navigations/NavigationLayout";

import {
  accountFilter,
  calculateNumberOfYearsForGraphDropdown,
  calculateTotalPostPositiveReactions,
  getAccountAnalytics,
  getCorrectMonthOfData,
  getBox1Value,
  getBox2Value,
  getBox3Value,
  getDataLinesFromAnalytics,
  getLatestAnalyticValue,
  getPostAnalytics,
  getAnalytic,
  getDropdownMonths,
  makeAnalyticTitle
} from "./util";

import { createName } from "../../components/postingFiles/SelectAccountDiv/util";

import { graphTypes, months, postingTypes } from "../../constants";
import {
  capitolizeFirstChar,
  getPostColor,
  getPostIconRound,
  getSocialTypeNumber,
  getSocialTypeString
} from "../../componentFunctions";

import "./style.css";

class AnalyticsPage extends Component {
  state = {
    activeAnalyticsAccountSocialID: 0,
    activeAnalyticIndex: 0,
    activeAnalyticsSocialType: 0,
    activeGraphYear: Number(new moment().format("YYYY")),
    activeGraphMonthIndex: Number(new moment().format("MM")) - 1,
    loading: false,
    graphType: 0
  };

  componentDidMount() {
    const { allAccounts, handleChange } = this.context;

    this._ismounted = true;
    if (allAccounts && allAccounts[0]) this.changeAnalytic(allAccounts[0]);
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  changeAnalytic = account => {
    const { allAccounts, handleChange } = this.context;
    handleChange({ saving: true });

    if (!account.analytics) {
      getAccountAnalytics(account, pageAnalyticsObjects => {
        if (pageAnalyticsObjects) {
          allAccounts.find(
            account2 => String(account2._id) === String(account._id)
          ).analytics = pageAnalyticsObjects;

          handleChange({ allAccounts, saving: false });
          this.handleChange({
            activeAnalyticsAccountSocialID: account.socialID
          });
        } else {
          handleChange({ saving: false });
          alert("Cannot get analytics");
        }
      });
    } else {
      this.handleChange({
        activeAnalyticsAccountSocialID: account.socialID
      });
    }
  };
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  render() {
    const {
      activeAnalyticsAccountSocialID,
      activeAnalyticIndex,
      activeAnalyticsSocialType,
      activeGraphYear,
      activeGraphMonthIndex,
      loading,
      postAnalyticsObjects = [],
      graphType
    } = this.state;

    const { user } = this.props;
    const { allAccounts } = this.context;

    if (!allAccounts)
      return (
        <Page className="column" title="Analytics">
          <GIContainer className="x-fill full-center mt32">
            <LoaderSimpleCircle />
          </GIContainer>
        </Page>
      );
    let activePageAnalyticsObj = allAccounts.find(account => {
      return account.socialID === activeAnalyticsAccountSocialID;
    });

    if (activePageAnalyticsObj)
      activePageAnalyticsObj = activePageAnalyticsObj.analytics;

    const {
      analyticsInformationList,
      dataPointArrays
    } = getDataLinesFromAnalytics(activePageAnalyticsObj);
    const { analyticsDropdownYears } = calculateNumberOfYearsForGraphDropdown(
      activePageAnalyticsObj
    );

    const { dataPointsInMonth, horizontalTitles } = getCorrectMonthOfData(
      activeGraphYear,
      activeGraphMonthIndex,
      graphType,
      dataPointArrays[activeAnalyticIndex]
    );

    const facebookSumOfPostReactions = calculateTotalPostPositiveReactions(
      postAnalyticsObjects
    );
    const likesByCountryAnalytic = getAnalytic(
      activeAnalyticsSocialType,
      5,
      activePageAnalyticsObj
    );

    const { box1Text, box1Value } = getBox1Value(
      activeAnalyticsSocialType,
      activePageAnalyticsObj
    );
    const { box2Text, box2Value } = getBox2Value(
      activeAnalyticsSocialType,
      activePageAnalyticsObj
    );
    const { box3Text, box3Value } = getBox3Value(
      activeAnalyticsSocialType,
      activePageAnalyticsObj
    );

    return (
      <Page className="column" title="Analytics">
        <NavigationLayout
          activeIndex={activeAnalyticsSocialType}
          className="x-fill"
          data={postingTypes.map((category, index) => {
            return (
              <GIContainer
                className="navigation-button border full-center fill-flex clickable py16"
                onClick={() => {
                  let potentialFoundAccountAssociatedID = allAccounts.find(
                    account => account.socialType === getSocialTypeString(index)
                  );
                  if (potentialFoundAccountAssociatedID)
                    potentialFoundAccountAssociatedID =
                      potentialFoundAccountAssociatedID.associatedID;

                  this.handleChange({
                    activeAnalyticsAccountSocialID: potentialFoundAccountAssociatedID,
                    activeAnalyticsSocialType: index
                  });
                }}
              >
                <FontAwesomeIcon
                  className={`round-icon round full-center pa8 ${
                    activeAnalyticsSocialType === index
                      ? "bg-five-blue white"
                      : ""
                  }`}
                  icon={getPostIconRound(category.name)}
                />
                <GIText
                  className="tac five-blue ml8"
                  text={capitolizeFirstChar(category.name)}
                  type="h3"
                />
              </GIContainer>
            );
          })}
        />
        {activeAnalyticsSocialType !== 0 && activeAnalyticsSocialType !== 3 && (
          <GIText
            className="x-fill tac mt32"
            text="Coming soon! :)"
            type="h2"
          />
        )}
        {(activeAnalyticsSocialType === 0 || activeAnalyticsSocialType === 3) &&
          allAccounts.filter(account =>
            accountFilter(account, activeAnalyticsSocialType, postingTypes)
          ).length === 0 && (
            <GIText
              className="x-fill tac mt32"
              text={
                "You need to connect a " +
                getSocialTypeString(activeAnalyticsSocialType) +
                " page"
              }
              type="h2"
            />
          )}
        {(activeAnalyticsSocialType === 0 ||
          activeAnalyticsSocialType === 3) && (
          <GIContainer className="x-fill column mt32">
            <GIContainer>
              <GIContainer className="fill-flex full-center column shadow-green bg-green-fade br8 pa16 ml32 mr8">
                <GIContainer className="round-icon mb8">
                  <img
                    alt=""
                    src={require("../../svgs/icons/profile.svg")}
                    className="fill-parent"
                  />
                </GIContainer>
                <GIText
                  className="tac white quicksand"
                  text={box1Value}
                  type="h2"
                />
                <GIText className="tac white bold" text={box1Text} type="h6" />
                <GIText
                  className="tac white fs-13"
                  text="Last 30 Days"
                  type="p"
                />
              </GIContainer>
              <GIContainer className="fill-flex full-center column shadow-purple bg-purple-fade br8 pa16 mx8">
                <GIContainer className="round-icon mb8">
                  <img
                    alt=""
                    src={require("../../svgs/icons/profile-with-plus.svg")}
                    className="fill-parent"
                  />
                </GIContainer>
                <GIText
                  className="tac white quicksand"
                  text={box2Value}
                  type="h2"
                />
                <GIText className="tac white bold" text={box2Text} type="h6" />
                <GIText
                  className="tac white fs-13"
                  text="Last 30 Days"
                  type="p"
                />
              </GIContainer>
              {false && (
                <GIContainer className="fill-flex full-center column shadow-light common-border br8 pa16 mx8">
                  <GIContainer className="round-icon mb8">
                    <img
                      alt=""
                      className="fill-parent"
                      src={require("../../svgs/icons/thumbs-up.svg")}
                    />
                  </GIContainer>
                  <GIText
                    className="tac quicksand"
                    text={facebookSumOfPostReactions}
                    type="h1"
                  />
                  <GIText className="tac bold" text={box3Text} type="h6" />
                  <GIText className="tac fs-13" text="Last 30 Days" type="p" />
                </GIContainer>
              )}

              <GIContainer className="fill-flex full-center column shadow-orange bg-orange-fade br8 pa16 ml8 mr32">
                <GIContainer className="full-center">
                  <GIText
                    className="tac white quicksand"
                    text={box3Value}
                    type="h1"
                  />
                </GIContainer>
                <GIText className="tac white bold" text={box3Text} type="h6" />
              </GIContainer>
            </GIContainer>
            <GIContainer className="mt16 column px32">
              <Dropdown
                activeItem={activeAnalyticIndex}
                className="common-border shadow-6 br8 py16 px32"
                dropdownActiveDisplayClassName="no-bottom-br five-blue"
                dropdownClassName="common-border five-blue no-top-br br8"
                dropdownItems={analyticsInformationList.map(obj =>
                  makeAnalyticTitle(obj)
                )}
                handleParentChange={dropdownClickedItemObj =>
                  this.handleChange({
                    activeAnalyticIndex: dropdownClickedItemObj.index
                  })
                }
                search
                title={
                  <GIText
                    className="tac muli bold fill-flex"
                    text={makeAnalyticTitle(
                      analyticsInformationList[activeAnalyticIndex]
                    )}
                    type="h3"
                  />
                }
              />
              {
                <GIContainer className="py16">
                  {allAccounts
                    .filter(account =>
                      accountFilter(
                        account,
                        activeAnalyticsSocialType,
                        postingTypes
                      )
                    )
                    .map((account, index) => {
                      return (
                        <GIContainer
                          className={`common-border clickable py8 px16 mr8 br4 ${
                            activeAnalyticsAccountSocialID === account.socialID
                              ? "five-blue"
                              : "grey"
                          }`}
                          key={index}
                          onClick={() => {
                            return this.changeAnalytic(account);
                            if (!account.analytics)
                              alert(
                                "Please reconnect your social profile and social page for this account. Make sure that you allow all permissions when going through the authentication workflow! :)"
                              );
                            else
                              this.handleChange({
                                activeAnalyticsAccountSocialID: account.socialID
                              });
                          }}
                        >
                          <FontAwesomeIcon
                            className={`round-icon-medium round full-center pa4 mr8 ${
                              activeAnalyticsAccountSocialID ===
                              account.socialID
                                ? "bg-five-blue white"
                                : "common-border"
                            }`}
                            icon={getPostIconRound(account.socialType)}
                          />
                          {createName(account)}
                        </GIContainer>
                      );
                    })}
                </GIContainer>
              }
              {analyticsInformationList[activeAnalyticIndex] && (
                <GIText
                  className="tac mt16"
                  text={
                    analyticsInformationList[activeAnalyticIndex].description
                  }
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
                      activeItem={activeGraphMonthIndex}
                      className="common-border shadow-6 br8 py16 px32"
                      dropdownActiveDisplayClassName="no-bottom-br five-blue"
                      dropdownClassName="common-border five-blue no-top-br br8"
                      dropdownItems={getDropdownMonths(
                        activePageAnalyticsObj,
                        months,
                        activeGraphYear
                      )}
                      handleParentChange={dropdownClickedItemObj => {
                        this.handleChange({
                          activeGraphMonthIndex: new Date(
                            Date.parse(dropdownClickedItemObj.item + " 1, 2012")
                          ).getMonth()
                        });
                      }}
                      title={
                        <GIText
                          className="tac nine-blue bold fill-flex"
                          text={capitolizeFirstChar(
                            months[activeGraphMonthIndex]
                          )}
                          type="h5"
                        />
                      }
                    />
                  )}

                  <GIContainer className="ml8">
                    <Dropdown
                      activeItem={activeGraphYear}
                      className="common-border shadow-6 br8 py16 px32"
                      dropdownActiveDisplayClassName="no-bottom-br five-blue"
                      dropdownClassName="common-border five-blue no-top-br br8"
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
                    ? new moment({
                        month: activeGraphMonthIndex,
                        year: activeGraphYear
                      }).format("MMMM YYYY")
                    : new moment({
                        month: activeGraphMonthIndex,
                        year: activeGraphYear
                      }).format("YYYY")
                }
                type="h4"
              />
            </GIContainer>
            {analyticsInformationList && (
              <GIContainer className="px32 mt16 mb32">
                <LineGraph
                  className="x-fill"
                  horizontalTitles={horizontalTitles.map((date, index) =>
                    date.date()
                  )}
                  line={dataPointsInMonth}
                />
              </GIContainer>
            )}
            {false && (
              <GIContainer className="ma32">
                <GIContainer className="column common-border fill-flex br16 pa16 mr16">
                  <GIText text="Best Posts" type="h4" />
                  <GIText
                    text="The most active posts in the last 30 days."
                    type="h6"
                  />
                </GIContainer>
                <GIContainer className="column common-border fill-flex br16 pa16 ml16">
                  <GIText text="Top Countries" type="h4" />
                  <GIContainer>
                    <PieGraph
                      className="x-fill"
                      something={likesByCountryAnalytic}
                    />
                  </GIContainer>
                </GIContainer>
              </GIContainer>
            )}
          </GIContainer>
        )}
      </Page>
    );
  }
}

AnalyticsPage.contextType = ExtraContext;

export default AnalyticsPage;
