import MegaMenuNavigation from "@/components/ui/MegaMenuNavigation";
import SearchButton from "@/components/SearchButton";
import CartButton from "@/components/CartButton";

export default function Navbar({
  menus,
  accessCookieValue,
  paths,
}: {
  menus: any;
  accessCookieValue: string | undefined;
  paths: string[];
}) {
  if (!accessCookieValue) return null;

  return (
    <section className="sticky top-0 shadow-md  bg-white flex items-center h-full border-b border-white01 px-2 lg:px-4 pt-2.5 pb-2.5 lg:pb-2.5 dark:border-gray-900 dark:bg-light-dark z-20">
      <div className="relative md:container mx-auto lg:px-4  h-full w-full">
        <div className="flex items-center justify-between h-full w-full gap-x-3 lg:gap-x-4 xl:gap-x-12">
          <MegaMenuNavigation
            menus={menus}
            cookieValue={accessCookieValue}
            paths={paths}
          />
          <div className="flex items-center gap-x-3 lg:gap-x-4 grow">
            <SearchButton />
            <CartButton />
          </div>
        </div>
      </div>
    </section>
  );
}
