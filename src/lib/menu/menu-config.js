export const MENU_ENTITY_TYPES = {
  ITEM: "item",
};

export const MENU_TYPES = {
  FOOD: "food",
  DRINK: "drink",
};

export const FOOD_CATEGORIES = [
  "burgers",
  "chicken",
  "loaded fries",
];

export const DRINK_CATEGORIES = [
  "shooters",
  "craft beer",
  "cocktails",
  "pre-mixed",
];

export const BURGER_BADGES = [
  "beef",
  "chicken",
  "vegetarian",
];

export function getCategoriesForMenuType(menuType) {
  if (menuType === MENU_TYPES.FOOD) return FOOD_CATEGORIES;
  if (menuType === MENU_TYPES.DRINK) return DRINK_CATEGORIES;
  return [];
}

export function categorySupportsBadges(menuType, category) {
  return menuType === MENU_TYPES.FOOD && category === "burgers";
}

export function categorySupportsImage(menuType, category) {
  return (
    menuType === MENU_TYPES.DRINK &&
    (category === "craft beer" || category === "pre-mixed")
  );
}

export function categorySupportsBrewery(menuType, category) {
  return (
    menuType === MENU_TYPES.DRINK &&
    (category === "craft beer" || category === "pre-mixed")
  );
}

export const MENU_MISC_ENTITY_TYPES = {
  EXTRAS_GROUP: "extras_group",
  NOTICE: "notice",
};

export function getAllFoodCategories() {
  return FOOD_CATEGORIES;
}

export function getAllDrinkCategories() {
  return DRINK_CATEGORIES;
}

export function getCategoriesForMiscEntity(entityType, menuType) {
  if (entityType === MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP) {
    return FOOD_CATEGORIES;
  }

  if (entityType === MENU_MISC_ENTITY_TYPES.NOTICE) {
    return menuType === MENU_TYPES.DRINK ? DRINK_CATEGORIES : FOOD_CATEGORIES;
  }

  return [];
}