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

        analyticsInformationList.push({
          description: analyticsObject.analytics[index].description,
          title: analyticsObject.analytics[index].title
        });
        const dailyValues = analyticsObject.analytics[index].dailyValues;

        for (let index2 in dailyValues) {
          const dailyValue = dailyValues[index2].dailyValue;

          for (let index3 in dailyValue) {
            if (dailyValue[index3].value > 0)
              areAnyDataPointsGreaterThanZero = true;

            if (dailyValue[index3])
              dataPointArray.push({
                data: dailyValue[index3].value,
                date: new moment(dailyValue[index3].date)
              });
            else dataPointArray.push({ data: 0 });
          }
        }
        if (areAnyDataPointsGreaterThanZero)
          dataPointArrays.push(dataPointArray);
      }
    }
  }
  return { analyticsInformationList, dataPointArrays };
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
  line,
  activeGraphYear,
  activeGraphMonthIndex,
  graphType
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
