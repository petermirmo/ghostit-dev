import axios from "axios";

export const getRecipes = callback => {
  axios.get("/api/recipes").then(res => {
    const { usersRecipes = [], allRecipes = [] } = res.data;

    callback({
      usersRecipes,
      allRecipes,
      activeRecipes: usersRecipes,
      loading: false,
      userID: usersRecipes.length > 0 ? usersRecipes[0].userID : undefined
    });
  });
};
