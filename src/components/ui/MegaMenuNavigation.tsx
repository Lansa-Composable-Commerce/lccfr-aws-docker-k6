"use client";

import {
  SfListItem,
  useDropdown,
  useTrapFocus,
  useDisclosure,
  SfDrawer,
  SfDrawerPlacement,
} from "@storefront-ui/react";
import React, {
  type FocusEvent,
  useRef,
  useState,
  useMemo,
  createRef,
  RefObject,
  ChangeEvent,
  useEffect,
} from "react";

import { useSearchParams } from "next/navigation";
import classNames from "classnames";
import { useTheme } from "next-themes";

import { useLocale, useTranslations } from "next-intl";

import { Transition } from "react-transition-group";

// components
import Button from "@/components/globalUI/Button";
import { MultiLevelAccordion } from "@/components/ui/MultiLevelAccordion";

// assets
import {
  Moon,
  Sun,
  SvgBar3,
  SvgChevronLeft,
  SvgChevronRight,
  SvgPhone,
  SvgXMark,
} from "@/assets/svg";

// lib
import useGetTokens from "@/lib/hooks/useGetTokens";
import useGetUserInformation from "@/lib/hooks/useGetUserInformation";

// utils
import { COOKIE_PREFIX, STOREFRONT_ROUTES } from "@/utils/constants";

import { Link, Locale, usePathname, useRouter } from "@/i18n/routing";
import { useAppDispatch } from "@/lib/hooks";
import {
  onGetCateg,
  onGetSubCateg,
  onRemoveSubCateg,
} from "@/lib/features/breadcrumbs/breadcrumbsSlice";
import {
  getProductBestSellerAndRecommended,
  removeFilterCategory,
} from "@/lib/features/products/productsSlice";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import useLogout from "@/lib/hooks/useLogout";
import { setAuthorization } from "@/lib/features/auth/authSlice";
import useAuthorization from "@/lib/hooks/useAuthorization";
import Logo from "@/components/Logo";
import { Node } from "@/types";

const findNode = (keys: string[], node: Node): Node => {
  if (keys.length > 1) {
    const [currentKey, ...restKeys] = keys;
    return findNode(
      restKeys,
      node.children?.find((child) => child.key === currentKey) || node,
    );
  }
  return node.children?.find((child) => child.key === keys[0]) || node;
};

export default function MegaMenuNavigation({
  menus,
  cookieValue,
  paths,
}: {
  menus: any;
  cookieValue: string | undefined;
  paths: string[];
}) {
  useAuthorization(paths);
  const mainMenuData = menus?.data;
  // hooks
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const updatedSearchParams = new URLSearchParams(searchParams);

  const dispatch = useAppDispatch();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [placement, setPlacement] = useState<`${SfDrawerPlacement}`>("right");
  const nodeRef = useRef(null);

  const drawerRef = useRef(null);
  const megaMenuRef = useRef(null);

  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const accessToken = useGetTokens(cookieValue);

  const tGlobal = useTranslations("Global");

  const [activeNode, setActiveNode] = useState<string[]>([]);

  // User Information (Derived from Token)
  const user = useGetUserInformation(cookieValue);
  const userFirstname = user?.firstname;
  const displayName = userFirstname
    ? userFirstname[0].toUpperCase() + userFirstname.slice(1)
    : "Guest";

  useEffect(() => {
    dispatch(getProductBestSellerAndRecommended(mainMenuData));
    dispatch(setAuthorization({ routes: paths }));
  }, []);

  const refsByKey = useMemo(() => {
    const buttonRefs: Record<string, RefObject<HTMLButtonElement>> = {};
    mainMenuData.children?.forEach((item: any) => {
      buttonRefs[item.key] = createRef();
    });
    return buttonRefs;
  }, [mainMenuData.children]);

  const { close, open, isOpen } = useDisclosure();
  const { refs, style } = useDropdown({
    isOpen,
    onClose: (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        refsByKey[activeNode[0]]?.current?.focus();
      }
      close();
    },
    placement: "bottom-start",
    middleware: [],
    onCloseDeps: [activeNode],
  });

  const trapFocusOptions = {
    activeState: isOpen,
    arrowKeysUpDown: true,
    initialFocus: "container",
  } as const;
  useTrapFocus(megaMenuRef, trapFocusOptions);
  useTrapFocus(drawerRef, trapFocusOptions);

  // @ts-ignore
  const activeMenu = findNode(activeNode, mainMenuData);

  const handleOpenMenu = (menuType: string[]) => () => {
    setActiveNode(menuType);
    open();
  };

  const handleOpenSidebar = (menuType: string[]) => () => {
    setActiveNode(menuType);
    setDrawerOpen(!isDrawerOpen);
  };

  const handleBack = () => {
    setActiveNode((menu) => menu.slice(0, menu.length - 1));
  };

  const handleNext = (key: string) => () => {
    setActiveNode((menu) => [...menu, key]);
  };

  const handleBlurWithin = (event: FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      close();
    }
  };

  const handleUpdateLocale = (newLocale: Locale) => {
    router.replace(`${pathname}?${updatedSearchParams.toString()}`, {
      locale: newLocale,
    });
  };

  const [localStorageCateg, setlocalStorageCateg] = useLocalStorage<string>(
    `${COOKIE_PREFIX}product_category`,
  );
  const [localStorageSubCateg, setlocalStorageSubCateg] =
    useLocalStorage<string>(`${COOKIE_PREFIX}product_sub_category`);

  const handleCLickSubCategory = ({ node, child }: any) => {
    setlocalStorageCateg(node?.value.category);
    setlocalStorageSubCateg(child?.categoryName);

    dispatch(removeFilterCategory());
    dispatch(onGetCateg(`${node?.value.category}`));
    dispatch(onGetSubCateg(`${child?.categoryName}`));

    close();
    setDrawerOpen(!isDrawerOpen);
  };

  const gotoHomePage = () => {
    router.push(STOREFRONT_ROUTES.HOME);
  };

  return (
    <div className=" h-full">
      <section ref={refs.setReference}>
        <div className="flex items-center lg:gap-4 xl:gap-10 ">
          <Button
            onClick={handleOpenSidebar([])}
            variant="tertiary"
            square
            aria-label="Close menu"
            className="block xl:hidden bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
          >
            <SvgBar3 />
          </Button>
          <div
            className="hidden lg:block w-[122px] h-[60px] flex-none -mb-1 lg:-mb-2"
            onClick={gotoHomePage}
          >
            <Logo height="h-auto" />
          </div>
          {/* Desktop dropdown */}
          <nav ref={refs.setFloating}>
            <ul className="hidden xl:flex gap-3" onBlur={handleBlurWithin}>
              {mainMenuData.children?.map((menuNode: any) => {
                const isActive = pathname === menuNode.href.toLowerCase();

                return (
                  <li key={menuNode.key}>
                    <Link
                      onMouseEnter={handleOpenMenu([menuNode.key])}
                      onClick={handleOpenMenu([menuNode.key])}
                      className="relative group text-sm xl:text-base group mr-2 dark:text-gray-300 active:!text-neutral-900 dark:hover:text-gray-100"
                      href={menuNode.href.toLowerCase()}
                      prefetch={false}
                    >
                      <span>{menuNode?.value.label}</span>
                      <span
                        className={`h-[1px] inline-block bg-brand absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 ${
                          isActive ? "w-full" : "w-0"
                        }`}
                      >
                        &nbsp;
                      </span>
                    </Link>
                    {isOpen &&
                      menuNode?.children &&
                      activeNode.length === 1 &&
                      activeNode[0] === menuNode.key &&
                      (() => {
                        const isProductPrimaryMenu =
                          menuNode?.value?.label === tGlobal("Products");
                        return (
                          <div
                            key={activeMenu.key}
                            style={style}
                            ref={megaMenuRef}
                            className={classNames(
                              "relative dark:bg-black01 mt-2 bg-white shadow-lg p-5 ml-[10rem] left-0 right-0 outline-none rounded-large z-10 overflow-auto min-h-[500] max-h-[550px]  overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                              isProductPrimaryMenu
                                ? "hidden md:grid md:grid-cols-3 gap-x-3 gap-y-3 max-w-[45rem]"
                                : "flex flex-col gap-3  max-w-[45rem]",
                            )}
                            tabIndex={0}
                            onMouseLeave={close}
                          >
                            {activeMenu.children?.map((node: any) => {
                              const isProductPrimaryMenu =
                                menuNode?.value?.label === tGlobal("Products");
                              const href = isProductPrimaryMenu
                                ? `products?category=${node?.value.label}&url=${node?.value.url}`
                                : node.value.link || "#";

                              return (
                                <div key={node.key}>
                                  <Link
                                    href={`/${href}`}
                                    onClick={() => {
                                      if (
                                        !node.isLeaf &&
                                        isProductPrimaryMenu
                                      ) {
                                        dispatch(onGetCateg("products"));
                                        dispatch(onRemoveSubCateg());
                                        dispatch(removeFilterCategory());
                                        setlocalStorageCateg(node?.value.label);
                                        localStorage.removeItem(
                                          `${COOKIE_PREFIX}product_sub_category`,
                                        );
                                      }
                                    }}
                                    prefetch={false}
                                  >
                                    {isProductPrimaryMenu ? (
                                      <div className="group max-w-52 line-clamp-1 truncate typography-text-base font-medium text-gray-900 whitespace-nowrap px-4 py-1.5 border-b border-b-neutral-200 dark:text-gray-300 cursor-pointer hover:text-gray-700 capitalize w-full">
                                        {node?.value.label}
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-3 grid-x-3">
                                        <SfListItem
                                          as="a"
                                          size="sm"
                                          className="relative group typography-text-sm py-1.5 text-gray-900  dark:text-gray-400 hover:text-gray-800 hover:bg-transparent dark:hover:bg-black/30"
                                        >
                                          {node?.value.label}
                                          <div
                                            className={classNames(
                                              "h-[1px] inline-block absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 w-0 ",
                                              {
                                                "bg-brand": !node.children,
                                              },
                                            )}
                                          >
                                            &nbsp;
                                          </div>
                                        </SfListItem>
                                      </div>
                                    )}
                                  </Link>

                                  {node.children && (
                                    <ul className="mt-2">
                                      <MultiLevelAccordion
                                        items={node.children}
                                        parentNode={node}
                                        isProductPrimaryMenu={
                                          isProductPrimaryMenu
                                        }
                                        onClickLeaf={(parentNode, child) => {
                                          handleCLickSubCategory({
                                            node: parentNode,
                                            child,
                                          });
                                        }}
                                      />
                                    </ul>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Mobile drawer */}
        {isDrawerOpen && (
          <div className="xl:hidden fixed top-0 inset-0 bg-neutral-500 bg-opacity-50 z-10  duration-500  transition ease-in-out" />
        )}
        <Transition ref={nodeRef} in={isDrawerOpen} timeout={500}>
          {(state) => (
            <SfDrawer
              ref={drawerRef}
              open
              placement="right"
              onClose={() => setDrawerOpen(false)}
              className={classNames(
                "w-full right-0 xl:hidden pb-5 border border-gray-300 max-w-[300px] duration-500 transition ease-in-out bg-white overflow-y-auto z-20 h-dvh capitalize dark:bg-dark",
                {
                  "translate-x-0": state === "entered" && placement === "left",
                  "-translate-x-full":
                    (state === "entering" || state === "exited") &&
                    placement === "left",
                  "-translate-x-0":
                    state === "entered" && placement === "right",
                  "translate-x-full":
                    (state === "entering" || state === "exited") &&
                    placement === "right",
                },
              )}
            >
              <nav>
                <div className="flex items-center justify-between py-2 px-4">
                  <div className="flex-none mt-1" onClick={gotoHomePage}>
                    <Logo height="h-auto" />
                  </div>
                  <SvgXMark
                    onClick={() => setDrawerOpen(!isDrawerOpen)}
                    className="size-6 text-gray-700 dark:text-white03"
                  />
                </div>
                <UserInfo
                  accessToken={accessToken}
                  tGlobal={tGlobal}
                  displayName={displayName}
                />
                <ul className="my-2">
                  {activeMenu.key !== "root" && (
                    <li>
                      <SfListItem
                        size="lg"
                        as="button"
                        type="button"
                        onClick={handleBack}
                        className="border-b border-b-neutral-200 border-b-solid dark:hover:bg-light-dark"
                      >
                        <div className="flex items-center">
                          <SvgChevronLeft className="size-6 text-sm text-neutral-500 dark:text-white03" />
                          <p className="ml-5 font-medium capitalize">
                            {activeMenu?.value?.label}
                          </p>
                        </div>
                      </SfListItem>
                    </li>
                  )}
                  {activeMenu.children?.map((node) => {
                    return node.isLeaf ? (
                      <li key={node.key}>
                        <Link
                          onClick={() =>
                            handleCLickSubCategory({
                              node,
                              child: node,
                            })
                          }
                          href={`/${node.href}`}
                          prefetch={false}
                        >
                          <SfListItem
                            size="lg"
                            as="button"
                            // href={node.href}
                            className="first-of-type:mt-2 dark:hover:bg-light-dark"
                          >
                            <div className="flex items-center">
                              <p className="text-left capitalize text-sm">
                                {node.value.label}
                              </p>
                            </div>
                          </SfListItem>
                        </Link>
                      </li>
                    ) : (
                      <li key={node.key}>
                        <SfListItem
                          size="lg"
                          as="button"
                          type="button"
                          onClick={handleNext(node.key)}
                          className="dark:hover:bg-light-dark"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <p className="text-left capitalize text-sm">
                                {node.value.label}
                              </p>
                            </div>

                            <SvgChevronRight className="size-4 text-black01 dark:text-white03 mr-3" />
                          </div>
                        </SfListItem>
                      </li>
                    );
                  })}
                </ul>
                <BottomNavOption
                  theme={theme}
                  setTheme={setTheme}
                  locale={locale}
                  handleUpdateLocale={handleUpdateLocale}
                />
              </nav>
            </SfDrawer>
          )}
        </Transition>
      </section>
    </div>
  );
}

const BottomNavOption = ({
  theme,
  setTheme,
  locale,
  handleUpdateLocale,
}: {
  theme: string | undefined;
  setTheme: any;
  locale: string;
  handleUpdateLocale: (newLocale: Locale) => void; // Updated prop type
}) => {
  const router = useRouter();
  const tGlobal = useTranslations("Global");

  const logout = useLogout();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleUpdateLocale(e.target.value as Locale); // Pass the value to the parent's function
  };

  const goToContactUs = () => {
    router.push(STOREFRONT_ROUTES.CONTACT_US);
  };

  return (
    <div className="relative">
      <div className=" px-4 w-full">
        <div className="py-4 border-y border-neutral-200">
          <div className="flex items-center gap-2.5">
            <div className="bg-gray02 p-3 rounded-lg  cursor-pointer dark:bg-light-dark">
              {theme === "light" ? (
                <Sun onClick={() => setTheme("dark")} className="size-5" />
              ) : (
                <Moon onClick={() => setTheme("light")} className="size-5" />
              )}
            </div>
            <div className="bg-gray02 px-3 py-2 rounded-lg dark:bg-light-dark">
              <div className="flex items-center gap-3">
                <select
                  name="lang"
                  id="lang-select"
                  defaultValue={locale}
                  onChange={handleChange}
                  className="cursor-pointer text-black01 dark:text-white01 text-sm"
                  aria-label="Lang-Select"
                >
                  <option value="en">EN</option>
                  <option value="es">ES</option>
                  <option value="de">DE</option>
                  <option value="fr">FR</option>
                </select>
              </div>
            </div>

            <div
              onClick={goToContactUs}
              className="bg-gray02 p-3 rounded-lg cursor-pointer dark:bg-light-dark"
              aria-label="contact us"
            >
              <SvgPhone className="size-5" />
            </div>
          </div>
        </div>
        <p className="w-full py-3 mt-2 cursor-pointer" onClick={logout}>
          <span className="text-sm">{tGlobal("LogOut")}</span>
        </p>
      </div>
    </div>
  );
};

const UserInfo = ({
  accessToken,
  tGlobal,
  displayName,
}: {
  accessToken: string | undefined | null;
  tGlobal: any;
  displayName: any;
}) => {
  return (
    <div className="bg-gray02 mx-6 rounded-lg dark:bg-light-dark">
      <div className="w-full px-3 py-5">
        <div className="h-full flex items-center gap-x-4">
          <div className={"flex gap-2"}>
            {accessToken ? (
              <p>
                {tGlobal("Welcome")}, {displayName}
              </p>
            ) : (
              <p>
                {tGlobal("Welcome")}, {tGlobal("Guest")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
