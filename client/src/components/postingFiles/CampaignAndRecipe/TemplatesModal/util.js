import axios from "axios";

export const getRecipes = () => {
  axios.get("/api/recipes").then(res => {
    let { usersRecipes, allRecipes } = res.data;

    if (!usersRecipes) usersRecipes = [];
    if (!allRecipes) allRecipes = [];

    if (this._ismounted) {
      callback({
        usersRecipes,
        allRecipes,
        activeRecipes: usersRecipes,
        loading: false,
        userID: usersRecipes.length > 0 ? usersRecipes[0].userID : undefined
      });
    }
  });
};
