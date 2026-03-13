export function getUniqueCategories(menuItems) {
  const categoriesSet = new Set();

  menuItems.forEach((item) => {
    if (item.category) categoriesSet.add(item.category);
  });

  return Array.from(categoriesSet);
}

export function getLowestPrice(item) {
  if (!Array.isArray(item?.pricing)) return Infinity;

  const validPrices = item.pricing
    .map((p) => p?.amount)
    .filter((a) => typeof a === "number");

  return validPrices.length ? Math.min(...validPrices) : Infinity;
}