export const shortenText = (active, description) => {
  if (active) return description;
  else return description.substring(0, 280) + "...";
};
