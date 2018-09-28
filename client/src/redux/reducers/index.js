import { combineReducers } from "redux";

function accountReducer() {
  return [];
}
function activePage(state = "", action) {
  switch (action.type) {
    case "TAB_SELECTED":
      return action.payload;
    default:
      let currentUrl = window.location.href;
      let currentPageReversed = "";
      for (let i = currentUrl.length - 1; i >= 0; i--) {
        let character = currentUrl[i];
        if (character === "#" || character === "=" || character === "_")
          continue;
        if (character === "/") break;
        currentPageReversed += character;
      }
      let currentPage = "";
      for (let i = currentPageReversed.length - 1; i >= 0; i--) {
        let character = currentPageReversed[i];
        currentPage += character;
      }

      state = currentPage;
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
function clientSideBar(state = false, action) {
  switch (action.type) {
    case "CLIENT_SIDE_BAR":
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
function headerSideBar(state = false, action) {
  switch (action.type) {
    case "HEADER_SIDE_BAR":
      return action.payload;
    default:
      return state;
  }
}
function tutorial(state = { value: 0, on: false }, action) {
  switch (action.type) {
    case "TUTORIAL":
      return action.payload;
    default:
      return state;
  }
}
const rootReducer = combineReducers({
  user: currentUser,
  account: accountReducer,
  activePage,
  clientSideBar,
  headerSideBar,
  accounts,
  getKeyListenerFunction,
  tutorial
});

export default rootReducer;
