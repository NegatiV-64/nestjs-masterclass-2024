export const convertSnakeToCamelCase = (value) => {
  return value.replace(/_(.)/g, (_, char) => char.toUpperCase());
};
