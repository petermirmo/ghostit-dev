import axios from "axios";

export const isAdmin = user => {
  if (user) if (user.role === "admin") return true;
  return false;
};

export const getTextFromHtmlTag = tagString => {
  let div = document.createElement("div");
  div.innerHTML = "<div   dangerouslySetInnerHTML={{__html: " + tagString;

  return div.textContent || div.innerText || "";
};

export const getGhostitBlogs = callback => {
  axios.get("/api/ghostit/blogs").then(res => {
    const { success, ghostitBlogs } = res.data;

    if (success) callback(ghostitBlogs);
    else {
      return;
    }
  });
};
