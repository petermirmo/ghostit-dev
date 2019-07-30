import axios from "axios";

export const getGhostitBlogs = callback => {
  axios.get("/api/ghostit/blogs").then(res => {
    const { success, ghostitBlogs } = res.data;

    if (success) callback(ghostitBlogs);
    else {
      return;
    }
  });
};
