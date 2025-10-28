import { ReactNode, useRef } from "react";
import classNames from "classnames";
import { SfDrawer } from "@storefront-ui/react";
import { Transition } from "react-transition-group";

type DrawerPropType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  placement: "left" | "right";
  children: ReactNode;
  className?: string;
};

export default function Drawer({
  open,
  setOpen,
  placement,
  children,
  className,
}: DrawerPropType) {
  const nodeRef = useRef(null);
  const drawerRef = useRef(null);

  return (
    <Transition ref={nodeRef} in={open} timeout={100}>
      {(state) => (
        <SfDrawer
          ref={drawerRef}
          open
          placement={placement}
          onClose={() => setOpen(false)}
          className={classNames(
            `${className} py-8 px-6 w-full h-full duration-500 transition ease-in-out z-30 md:w-[30em]`,
            {
              "translate-x-0": state === "entered" && placement === "left",
              "-translate-x-full":
                (state === "entering" || state === "exited") &&
                placement === "left",
              "-translate-x-0": state === "entered" && placement === "right",
              "translate-x-full":
                (state === "entering" || state === "exited") &&
                placement === "right",
            },
          )}
        >
          {children}
        </SfDrawer>
      )}
    </Transition>
  );
}
