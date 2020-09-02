import axios from "axios";

export const getGhostitBlogs = (callback, skip) => {
  axios.post("/api/ghostit/blogs", { skip }).then((res) => {
    const { success, ghostitBlogs } = res.data;

    if (success) callback(ghostitBlogs);
    else {
      // TODO: handle error
    }
  });
};
