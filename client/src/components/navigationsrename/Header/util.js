import axios from "axios";
export const test = (something, callback) => {
  console.log(something);
  callback(something);
};
