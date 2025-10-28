import { Node } from "@/types";

export const menuData = [
  // { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Dashboard", href: "#" },
  { name: "Quick Shop", href: "#" },
  { name: "Orders", href: "#" },
  { name: "My Backnine", href: "#" },
  { name: "Accounts", href: "/accounts" },
  { name: "Contact Us", href: "#" },
];

export const content: Node = {
  key: "root",
  value: { label: "s" },
  isLeaf: false,
  children: [
    {
      key: "Products",
      value: {
        label: "Products",
      },
      isLeaf: false,
      href: "/",
      children: [
        {
          key: "CLUB SETS",
          value: { label: "Club Sets" },
          isLeaf: false,
          children: [
            {
              key: "IRON_CLUB_SETS",
              value: { label: "Iron Club Sets", link: "#" },
              isLeaf: true,
            },
            {
              key: "WOOD_CLUB_SETS",
              value: { label: "Wood Club Sets", link: "#" },
              isLeaf: true,
            },
          ],
        },
        {
          key: "GOLF CLUBS",
          value: { label: "Golf Clubs" },
          isLeaf: false,
          children: [
            {
              key: "DRIVERS",
              value: { label: "Fairway Woods", link: "#" },
              isLeaf: true,
            },
            {
              key: "IRON",
              value: { label: "Iron", link: "#" },
              isLeaf: true,
            },
            {
              key: "PUTTERS",
              value: { label: "Putters", link: "#" },
              isLeaf: true,
            },
          ],
        },
        {
          key: "APPAREL",
          value: { label: "Apparel" },
          isLeaf: false,
          children: [
            {
              key: "GOLF_SHOES",
              value: { label: "Golf Shoes", link: "#" },
              isLeaf: true,
            },
            {
              key: "GOLF_SHIRTS",
              value: { label: "Golf Shirts", link: "#" },
              isLeaf: true,
            },
            {
              key: "RAIN_GEAR",
              value: { label: "Rain Gear", link: "#" },
              isLeaf: true,
            },
            {
              key: "HEADWEAR",
              value: { label: "Headwear", link: "#" },
              isLeaf: true,
            },
          ],
        },
        {
          key: "ACCESSORIES",
          value: { label: "Accessories" },
          isLeaf: false,
          children: [
            {
              key: "BAGS",
              value: { label: "Bags", link: "#" },
              isLeaf: true,
            },
            {
              key: "GLOVES",
              value: { label: "Gloves", link: "#" },
              isLeaf: true,
            },
            {
              key: "GRIPS",
              value: { label: "Grips", link: "#" },
              isLeaf: true,
            },
            {
              key: "HEADCOVERS",
              value: { label: "Headcovers", link: "#" },
              isLeaf: true,
            },
          ],
        },
        {
          key: "ENTERTAINMENT",
          value: { label: "Entertainment" },
          isLeaf: false,
          children: [
            {
              key: "GAMES",
              value: { label: "Games", link: "#" },
              isLeaf: true,
            },
            {
              key: "BOOKS",
              value: { label: "Books", link: "#" },
              isLeaf: true,
            },
            {
              key: "INDOOR GREEN",
              value: { label: "Indoor Green", link: "#" },
              isLeaf: true,
            },
          ],
        },
        {
          key: "FOOD_AND_SUPPLEMENTS",
          value: { label: "Food And Supplements" },
          isLeaf: false,
          children: [
            {
              key: "SPORT_PERFORMANCE",
              value: { label: "Sport Performance", link: "#" },
              isLeaf: true,
            },
            {
              key: "ENERGY_BARS",
              value: { label: "Energy Bars", link: "#" },
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      key: "Dashboard",
      value: {
        label: "Dashboard",
      },
      isLeaf: true,
      href: "/dashboard",
    },
    {
      key: "Quick Shop",
      value: {
        label: "Quick Shop",
      },
      isLeaf: true,
      href: "/quick-shop",
    },
    {
      key: "Orders",
      value: {
        label: "Orders",
      },
      isLeaf: false,
      href: "#",
      children: [
        {
          key: "ORDER_INQUIRY",
          value: { label: "Order Inquiry", link: "#" },
          isLeaf: true,
        },
        {
          key: "ORDER_TEMPLATE",
          value: { label: "Order Template", link: "#" },
          isLeaf: true,
        },
        {
          key: "INVOICE_INQUIRY",
          value: { label: "Invoice Inquiry", link: "#" },
          isLeaf: true,
        },
      ],
    },
    {
      key: "My Backnine",
      value: {
        label: "My Backnine",
      },
      isLeaf: false,
      href: "#",
      children: [
        {
          key: "MY_PRODUCTS",
          href: "/my-products",
          value: { label: "Account Settings", link: "#" },
          isLeaf: true,
        },
        {
          key: "ACCOUNT_SETTINGS",
          href: "/account-accountSettings",
          value: { label: "Account Settings", link: "#" },
          isLeaf: true,
        },
        {
          key: "MY_ITEM_XREF",
          value: { label: "My Item XREF", link: "#" },
          isLeaf: true,
        },
        {
          key: "SAVED_CREDIT_CARDS",
          value: { label: "Saved Credit Cards", link: "#" },
          isLeaf: true,
        },
        {
          key: "USER_PREFERENCE",
          value: { label: "User Preference", link: "#" },
          isLeaf: true,
        },
      ],
    },
    {
      key: "Accounts",
      value: {
        label: "Accounts",
      },
      isLeaf: true,
      href: "/accounts",
    },
    {
      key: "Contact Us",
      value: {
        label: "Contact Us",
      },
      isLeaf: true,
      href: "/contact-us",
    },
  ],
};
