"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { SfListItem, SfSwitch } from "@storefront-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import Spinner from "@/components/loading/Spinner";
import { showToast } from "@/components/globalUI/CustomToast";
import Button from "@/components/globalUI/Button";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getSubUSerPermission,
  selectIsLoadingPermission,
  selectIsLoadingUpdatePermission,
  selectSelectedSubUser,
  updateSubUSerPermission,
} from "@/lib/features/subUser/subUserSlice";

import { SvgChevronRight } from "@/assets/svg";

import { NestedPermissionNode } from "@/types";

type PermissionItem = {
  menuId: number;
  menuName: string;
  subMenu: number;
  subuserPermissionFlag: "Y" | "N" | "";
};

const PermissionTab = () => {
  const checkboxRefs = useRef<Record<number, HTMLInputElement>>({});
  const tUsrSetting = useTranslations("UsrSetting");
  const tValidation = useTranslations("Validation");

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoadingPermission);
  const isLoadingUpdatePermission = useAppSelector(
    selectIsLoadingUpdatePermission,
  );
  const selectedSubUser = useAppSelector(selectSelectedSubUser);

  const [isChanged, setIsChanged] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<number[]>([]);

  const [rawPermissions, setRawPermissions] = useState<PermissionItem[]>([]);
  const [nestedPermissions, setNestedPermissions] = useState<
    NestedPermissionNode[]
  >([]);

  useEffect(() => {
    if (selectedSubUser?.subUserId) {
      dispatch(getSubUSerPermission(selectedSubUser.subUserId)).then((res) => {
        if (res.payload?.success) {
          setRawPermissions(res.payload.data);
        }
      });
    }
  }, [selectedSubUser?.subUserId, dispatch]);

  useEffect(() => {
    const buildTree = (
      items: PermissionItem[],
      parent: PermissionItem,
      depth: number = 0,
    ): NestedPermissionNode => {
      if (depth > 5)
        return {
          ...parent,
          children: [],
          checked: parent.subuserPermissionFlag === "Y",
          indeterminate: false,
        };

      const children = items
        .filter(
          (item) =>
            item.menuId === parent.subMenu && item.menuId !== item.subMenu,
        )
        .map((child) => buildTree(items, child, depth + 1));

      const checked = parent.subuserPermissionFlag === "Y";
      const allChildrenChecked =
        children.length > 0 && children.every((c) => c.checked);
      const anyChildChecked = children.some((c) => c.checked);

      const indeterminate = anyChildChecked && !allChildrenChecked;

      return {
        ...parent,
        checked,
        indeterminate,
        children,
      };
    };

    const tree = rawPermissions
      .filter((item) => item.subMenu === 0)
      .map((rootItem) => {
        const children = rawPermissions.filter(
          (item) => item.menuId === rootItem.menuId && item.subMenu !== 0,
        );

        const builtChildren = children.map((child) =>
          buildTree(rawPermissions, child, 1),
        );

        const checked = rootItem.subuserPermissionFlag === "Y";
        const allChildrenChecked =
          builtChildren.length > 0 && builtChildren.every((c) => c.checked);
        const anyChildChecked = builtChildren.some((c) => c.checked);
        /*        const finalChecked =
          builtChildren.length > 0 ? anyChildChecked : checked;
        const indeterminate = anyChildChecked && !allChildrenChecked;*/

        return {
          ...rootItem,
          checked: checked,
          indeterminate: anyChildChecked && !allChildrenChecked,
          children: builtChildren,
        };
      });

    setNestedPermissions(tree);
    setIsChanged(false);
  }, [rawPermissions]);

  const updateSubUserPermission = async () => {
    const flattenPermissions = (
      nodes: NestedPermissionNode[],
    ): PermissionItem[] => {
      return nodes.flatMap((node) => [
        {
          menuId: node.menuId,
          menuName: node.menuName,
          subMenu: node.subMenu,
          subuserPermissionFlag: node.checked ? "Y" : "N",
        },
        ...flattenPermissions(node.children),
      ]);
    };

    const payload = flattenPermissions(nestedPermissions);
    const res = await dispatch(
      updateSubUSerPermission({
        subuserId: selectedSubUser?.subUserId,
        data: payload,
      }),
    );

    if (res.meta.requestStatus === "fulfilled") {
      showToast("success", tValidation(res?.payload.messages));
    } else {
      showToast("error", tValidation(res?.payload.messages));
    }

    setIsChanged(false);
  };

  const handleCheckChange = (path: number[]) => {
    const cloneDeep = (nodes: NestedPermissionNode[]): NestedPermissionNode[] =>
      nodes.map((node) => ({
        ...node,
        children: cloneDeep(node.children),
      }));

    const getNodeByPath = (
      nodes: NestedPermissionNode[],
      path: number[],
    ): NestedPermissionNode | null => {
      let current = nodes;
      let node: NestedPermissionNode | null = null;
      for (const index of path) {
        node = current[index];
        if (!node) return null;
        current = node.children;
      }
      return node;
    };

    const setNodeByPath = (
      nodes: NestedPermissionNode[],
      path: number[],
      updater: (node: NestedPermissionNode) => NestedPermissionNode,
    ): NestedPermissionNode[] => {
      const [head, ...rest] = path;
      return nodes.map((node, i) => {
        if (i !== head) return node;
        if (rest.length === 0) {
          return updater(node);
        }
        return {
          ...node,
          children: setNodeByPath(node.children, rest, updater),
        };
      });
    };

    const uncheckAllDescendants = (
      node: NestedPermissionNode,
    ): NestedPermissionNode => ({
      ...node,
      checked: false,
      indeterminate: false,
      children: node.children.map(uncheckAllDescendants),
    });

    const markAncestorsChecked = (
      nodes: NestedPermissionNode[],
      path: number[],
    ): NestedPermissionNode[] => {
      const updated = [...nodes];
      let current = updated;

      for (let i = 0; i < path.length; i++) {
        const index = path[i];
        const node = current[index];
        current[index] = {
          ...node,
          checked: true,
          indeterminate: false,
          children: [...node.children],
        };
        current = current[index].children;
      }

      return updated;
    };

    const updatedTree = cloneDeep(nestedPermissions);
    const currentNode = getNodeByPath(updatedTree, path);
    if (!currentNode) return;

    const isChecking = !currentNode.checked;

    let updated = updatedTree;

    if (isChecking) {
      updated = setNodeByPath(updated, path, (node) => ({
        ...node,
        checked: true,
        indeterminate: false,
      }));
      updated = markAncestorsChecked(updated, path.slice(0, -1));
    } else {
      updated = setNodeByPath(updated, path, (node) =>
        uncheckAllDescendants({ ...node, checked: false }),
      );
    }

    setNestedPermissions(updated);
    setIsChanged(true);
  };

  const renderPermissions = (
    nodes: NestedPermissionNode[],
    level = 0,
    path: number[] = [],
  ) => {
    return nodes.map((node, index) => {
      const currentPath = [...path, index];
      return (
        <div
          key={node.menuId}
          className="w-auto ml-2 mb-2"
          style={{ marginLeft: `${level * 1.25}rem` }}
        >
          <SfListItem
            className="rounded-lg hover:bg-brand/30 dark:hover:bg-brand/20 active:dark:bg-brand/30"
            onClick={(e) => {
              if (
                checkboxRefs.current[node.menuId] &&
                (e.target === checkboxRefs.current[node.menuId] ||
                  Array.from(
                    checkboxRefs.current[node.menuId].labels || [],
                  ).includes(e.target as HTMLLabelElement))
              ) {
                return; // Click was on switch
              }

              if (node.children.length > 0) {
                // const nextPaths = [...path];
                const currentLevel = path.length;

                setExpandedPaths((prev) => {
                  const isExpanded =
                    prev.length > currentLevel && prev[currentLevel] === index;

                  if (isExpanded) {
                    // Collapse this level and deeper
                    return prev.slice(0, currentLevel);
                  } else {
                    // Expand this level, remove deeper levels
                    const updated = prev.slice(0, currentLevel);
                    updated[currentLevel] = index;
                    return updated;
                  }
                });
              } else {
                handleCheckChange(currentPath);
              }
            }}
          >
            <div className="flex items-center gap-x-3 w-full">
              <SfSwitch
                checked={node.checked}
                aria-checked={
                  node.indeterminate ? "mixed" : node.checked ? "true" : "false"
                }
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckChange(currentPath);
                }}
                ref={(el: any) => (checkboxRefs.current[node.menuId] = el!)}
                aria-label={node.menuName}
              />
              <span className="text-base lg:text-lg">{node.menuName}</span>
              {node.children.length > 0 && (
                <div className="ml-auto dark:text-white01">
                  <SvgChevronRight
                    className={classNames(
                      "size-6 text-gray-500 transition-transform duration-300",
                      {
                        "rotate-90": expandedPaths[path.length] === index,
                      },
                    )}
                  />
                </div>
              )}
            </div>
          </SfListItem>

          {node.children.length > 0 && expandedPaths[path.length] === index && (
            <AnimatePresence initial={false}>
              <motion.div
                key={`children-${node.menuId}`}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderPermissions(node.children, level + 1, currentPath)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 pb-2">
      <h1 className="my-3 text-center text-base lg:text-xl font-medium capitalize">
        {tUsrSetting("UsrPermissions")}
      </h1>

      <div className="mx-2 mt-4">
        {isLoading ? (
          <div className="w-full h-24 flex flex-col items-center justify-center text-center">
            <Spinner className="fill-brand" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: "50vh" }}>
            <div className="w-full grid gap-2">
              {renderPermissions(nestedPermissions)}
            </div>
          </div>
        )}
      </div>

      <footer className="mt-6">
        <div className="w-full flex items-center justify-end gap-5">
          <div className="hidden lg:block w-full">&nbsp;</div>
          <Button
            size="lg"
            className="w-full lg:py-4.5 lg:max-w-xs"
            type="submit"
            disabled={isLoadingUpdatePermission || !isChanged}
            onClick={updateSubUserPermission}
            aria-label="save"
          >
            {isLoadingUpdatePermission ? (
              <p className="btn-text">{tUsrSetting("Saving")}...</p>
            ) : (
              <p className="btn-text">{tUsrSetting("Save")}</p>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default PermissionTab;
