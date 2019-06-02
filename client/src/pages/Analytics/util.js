import axios from "axios";

export const getAccountAnalytics = callback => {
  axios.get("/api/ai/analytics/accounts").then(res => {
    const { analyticsObjects, message, success } = res.data;
    if (success) callback({ analyticsObjects });
    else {
      // todo handleerror
    }
  });
};

export const getDataLinesFromAnalytics = (analyticsObjects, accountIndex) => {
  let dataLinesInformation = [];
  let dataPointArrays = [];

  if (analyticsObjects) {
    const analyticsObject = analyticsObjects[accountIndex];

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
  return { dataLinesInformation, dataPointArrays };
};
