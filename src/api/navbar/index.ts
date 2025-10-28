import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { createSlug } from "@/lib/helpers/createSlug";

// @ts-ignore
function processSubMenus(subMenus, parentMenu: any) {
  return subMenus.map((subMenu: any) => {
    const hasChildren = subMenu.subMenus?.length > 0;

    return {
      key: subMenu.menuId || subMenu.menuName, // fallback key
      value: {
        key: subMenu.menuName,
        label: subMenu.menuName,
        link: `${subMenu.menuURL}`,
      },
      href: `${subMenu.menuURL}`,
      isMenu: parentMenu.isNotShow === "",
      isLeaf: !hasChildren,
      children: hasChildren
        ? processSubMenus(subMenu.subMenus, parentMenu)
        : undefined,
    };
  });
}

export async function getMenus() {
  try {
    const axios = axiosInstance();
    const response = await axios.get(API.STOREFRONT_MENUS);

    const categories = response.data.categories.map((category: any) => {
      const children =
        category.subCategories?.length > 0
          ? category.subCategories.map((subCategory: any) => {
              return {
                ...subCategory,
                value: {
                  label: subCategory.categoryName,
                  link: `products/${subCategory.categoryName}/${subCategory.categoryName.toLowerCase()}`,
                  url: category.categoryURL,
                  category: category.categoryName,
                },
                isLeaf: true,
                href: `products?category=${category.categoryName.toLowerCase()}&subCategory=${subCategory.categoryName}&url=${subCategory.categoryURL}`,
              };
            })
          : null;

      return {
        key: category.categoryId,
        value: {
          label: category.categoryName.toLowerCase(),
          url: category.categoryURL,
          link: createSlug(category.categoryURL),
          category: category.categoryName.toLowerCase(),
        },
        children,
        isLeaf: false,
      };
    });

    const menus = response.data.menu.map((menu: any) => {
      let children;

      if (menu.subMenus?.length) {
        children = processSubMenus(menu.subMenus, menu);
      } else if (menu.menuOrder === 1) {
        children = categories;
      }

      return children
        ? {
            key: menu.menuId,
            value: {
              label: menu.menuName,
            },
            isMenu: menu.isNotShow === "",
            isLeaf: false,
            href: "#",
            children,
          }
        : {
            key: menu.menuId,
            value: {
              label: menu.menuName,
            },
            isMenu: menu.isNotShow === "",
            isLeaf: true,
            href: `/${createSlug(menu.menuURL)}`,
          };
    });

    const mainMenu = {
      key: "root",
      isLeaf: false,
      children: [...menus],
    };

    return {
      success: true,
      data: { ...mainMenu, ...response.data },
      messages: "",
    };
  } catch (error: any) {
    console.log("error", error?.response?.data?.error?.messages.toString());
    return {
      success: false,
      data: [],
      messages: error?.response?.data?.error?.messages.toString(),
    };
  }
}
