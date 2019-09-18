export const something = (active, description) => {
  if (active) return description;
  else return description.substring(0, 280) + "...";
};
