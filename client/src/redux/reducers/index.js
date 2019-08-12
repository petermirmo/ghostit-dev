import { combineReducers } from "redux";

function accounts(state = [], action) {
  switch (action.type) {
    case "SOCIAL_ACCOUNTS":
      return action.payload;
    default:
      return state;
  }
}

function currentUser(state = null, action) {
  switch (action.type) {
    case "CURRENT_USER":
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
function signedInAsUser(state = null, action) {
  switch (action.type) {
    case "CURRENT_SIGNED_IN_AS_USER":
      return action.payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  accounts,
  getKeyListenerFunction,
  signedInAsUser,
  user: currentUser
});

export default rootReducer;
