export const getProductImage = (src?: string) => {
  if (!src) return "/imgs/placeholder.jpg";
  return src.startsWith("http") ? src : `/products/${src}`;
};
