import axios from "axios";
import moment from "moment-timezone";

export const getAccountAnalytics = callback => {
  axios.get("/api/ai/analytics/accounts").then(res => {
    const { analyticsObjects, message, success } = res.data;
    if (success) callback({ analyticsObjects });
    else {
      // todo handleerror
    }
  });
};

export const getDataLinesFromAnalytics = (accountIndex, analyticsObjects) => {
  let analyticsInformationList = [];
  let dataPointArrays = [];

  if (analyticsObjects) {
    const analyticsObject = analyticsObjects[accountIndex];

    if (analyticsObject) {
      for (let index in analyticsObject.analytics) {
        let dataPointArray = [];

        let areAnyDataPointsGreaterThanZero = false;

        const dailyValues = analyticsObject.analytics[index].dailyValues;

        for (let index2 in dailyValues) {
          const dailyValue = dailyValues[index2].dailyValue;

          if (dailyValue.length === 0) {
            dataPointArray.push({ data: 0 });
          } else if (dailyValue.length === 1) {
            if (dailyValue[0].value > 0) areAnyDataPointsGreaterThanZero = true;
            dataPointArray.push({
              data: dailyValue[0].value,
              date: new moment(dailyValue[0].date)
            });
          }
        }

        if (areAnyDataPointsGreaterThanZero) {
          dataPointArrays.push(dataPointArray);
          analyticsInformationList.push({
            description: analyticsObject.analytics[index].description,
            title: analyticsObject.analytics[index].title
          });
        }
      }
    }
  }

  return { analyticsInformationList, dataPointArrays };
};

const getAnalyticTitle = (activeAnalyticsSocialType, analyticBoxValue) => {
  if (activeAnalyticsSocialType === 0) {
    if (analyticBoxValue === 0) return "Daily Page Engaged Users";
    else if (analyticBoxValue === 1)
      return "Daily New likes by paid and non-paid";
    else if (analyticBoxValue === 4) return "Lifetime Total Likes";
  }
};

export const getLatestAnalyticValue = (
  activeAnalyticsSocialType,
  analyticsObjects,
  analyticBoxValue,
  sum
) => {
  const analyticObject = analyticsObjects[activeAnalyticsSocialType];

  if (analyticObject && analyticObject.analytics) {
    const analyticTitleString = getAnalyticTitle(
      activeAnalyticsSocialType,
      analyticBoxValue
    );
    const analytic = findAnalytic(analyticObject, analyticTitleString);

    if (analytic && !sum) return findLatestAnalyticValue(analytic);
    else if (analytic && sum) return sumLastThirtyDaysOfAnalytic(analytic);
  }
};

const findAnalytic = (analyticObject, analyticTitleString) => {
  return analyticObject.analytics.find(
    analytic => analytic.title === analyticTitleString
  );
};

const findLatestAnalyticValue = analytic => {
  const latestDailyData =
    analytic.dailyValues[analytic.dailyValues.length - 1].dailyValue;
  if (latestDailyData.length === 1) return latestDailyData[0].value;
  else {
    let dailySum = 0;
    for (let index in latestDailyData) {
      if (latestDailyData[index].key === "total")
        return latestDailyData[index].value;
      else dailySum += latestDailyData[index].value;
    }
    return dailySum;
  }
};

const sumLastThirtyDaysOfAnalytic = analytic => {
  const thirtyDaysAgoDate = new moment().subtract(30, "days");

  let analyticSum = 0;

  for (let index = 1; index <= 30; index++) {
    const dateOfAnalytic = new moment(
      analytic.dailyValues[
        analytic.dailyValues.length - index
      ].dailyValue[0].date
    );

    if (
      dateOfAnalytic > thirtyDaysAgoDate &&
      analytic.dailyValues[analytic.dailyValues.length - index]
    ) {
      const latestDailyData =
        analytic.dailyValues[analytic.dailyValues.length - index].dailyValue;

      if (latestDailyData.length === 1) analyticSum += latestDailyData[0].value;
      else {
        let dailySum = 0;
        for (let index in latestDailyData) {
          if (latestDailyData[index].key === "total") {
            dailySum = latestDailyData[index].value;
            break;
          } else dailySum += latestDailyData[index].value;
        }
        analyticSum += dailySum;
      }
    }
  }
  return analyticSum;
};

export const calculateNumberOfYearsForGraphDropdown = analyticsObject => {
  let analyticsDropdownYears = [];
  if (analyticsObject) {
    let momentStart = new moment(analyticsObject.createdAt).subtract(
      3,
      "month"
    );
    let momentEnd = new moment();

    for (
      let index = Number(momentStart.format("YYYY"));
      index <= Number(momentEnd.format("YYYY"));
      index++
    ) {
      analyticsDropdownYears.push(index);
    }
  }
  return { analyticsDropdownYears };
};
export const canDisplayMonth = (analyticsObject, month, year) => {
  if (analyticsObject) {
    const momentStart = new moment(analyticsObject.createdAt)
      .subtract(3, "month")
      .startOf("month");
    const momentEnd = new moment().endOf("month");

    const monthToTest = new moment().set({ year, month });

    if (monthToTest.isBetween(momentStart, momentEnd)) return true;
  }
  return false;
};

export const getCorrectMonthOfData = (
  activeGraphYear,
  activeGraphMonthIndex,
  graphType,
  line
) => {
  const dataPointsInMonth = [];
  const horizontalTitles = [];

  const lineStartDate = new moment()
    .set({
      year: activeGraphYear,
      month: activeGraphMonthIndex - 1
    })
    .endOf("month");

  const lineEndDate = new moment()
    .set({
      year: activeGraphYear,
      month: activeGraphMonthIndex + 1
    })
    .startOf("month");

  for (let index in line) {
    const dataPoint = line[index];

    if (new moment(dataPoint.date).isBetween(lineStartDate, lineEndDate)) {
      dataPointsInMonth.push(dataPoint.data);
      horizontalTitles.push(dataPoint.date);
    }
  }

  return { dataPointsInMonth, horizontalTitles };
};
