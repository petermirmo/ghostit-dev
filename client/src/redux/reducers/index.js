import { combineReducers } from "redux";

function accountReducer() {
  return [];
}
function currentUser(state = null, action) {
  switch (action.type) {
    case "CURRENT_USER":
      return action.payload;
    default:
      return state;
  }
}
function accounts(state = [], action) {
  switch (action.type) {
    case "SOCIAL_ACCOUNTS":
      return action.payload;
    default:
      return state;
  }
}
function getKeyListenerFunction(state = [() => {}], action) {
  switch (action.type) {
    case "KEY_LISTENER":
      return action.payload;
    default:
      return state;
  }
}
const rootReducer = combineReducers({
  user: currentUser,
  account: accountReducer,
  accounts,
  getKeyListenerFunction
});

export default rootReducer;
