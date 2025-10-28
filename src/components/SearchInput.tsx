import {
  type ChangeEvent,
  type KeyboardEvent,
  type FormEvent,
  useState,
  useRef,
} from "react";
import { useDebounce } from "react-use";
import { offset } from "@floating-ui/react-dom";
import {
  SfInput,
  SfIconSearch,
  SfIconCancel,
  useDisclosure,
  SfListItem,
  SfLoaderCircular,
  useTrapFocus,
  useDropdown,
} from "@storefront-ui/react";
import { SvgArrowCircle, SvgMagnifying } from "@/assets/svg";
import Input from "@/components/globalUI/Input";

interface Product {
  id: string;
  name: string;
}

const mockProducts: Product[] = [
  { id: "ip-14", name: "iPhone 14" },
  { id: "ip-14-pro", name: "iPhone 14 Pro" },
  { id: "ip-14-pro-max", name: "iPhone 14 Pro Max" },
  { id: "ip-14-plus", name: "iPhone 14 Plus" },
  { id: "ip-13", name: "iPhone 13" },
  { id: "ip-13-mini", name: "iPhone 13 mini" },
  { id: "ip-12", name: "iPhone 12" },
  { id: "ip-11", name: "iPhone 11" },
  { id: "mb-air", name: "MacBook Air" },
  { id: "mb-pro-13", name: 'MacBook Pro 13"' },
  { id: "mb-pro-14", name: 'MacBook Pro 14"' },
  { id: "mb-pro-16", name: 'MacBook Pro 16"' },
];

// Just for presentation purposes. Replace mock request with the actual API call.
// eslint-disable-next-line no-promise-executor-return
const delay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
const mockAutocompleteRequest = async (phrase: string) => {
  await delay();
  const results = mockProducts
    .filter((product) =>
      product.name.toLowerCase().startsWith(phrase.toLowerCase()),
    )
    .map((product) => {
      const highlight = product.name.substring(0, phrase.length);
      const rest = product.name.substring(phrase.length);
      return { highlight, rest, product };
    });
  return results;
};

export default function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownListRef = useRef<HTMLUListElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false);
  const [snippets, setSnippets] = useState<
    { highlight: string; rest: string; product: Product }[]
  >([]);
  const { isOpen, close, open } = useDisclosure();
  const { refs, style } = useDropdown({
    isOpen,
    onClose: close,
    placement: "bottom-start",
    middleware: [offset(4)],
  });
  const { focusables: focusableElements, updateFocusableElements } =
    useTrapFocus(dropdownListRef, {
      trapTabs: false,
      initialFocus: false,
      arrowKeysUpDown: true,
      activeState: isOpen,
    });
  const isResetButton = Boolean(searchValue);
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    close();
    alert(`Search for phrase: ${searchValue}`);
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setSearchValue("");
    setSnippets([]);
    close();
    handleFocusInput();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const phrase = event.target.value;
    if (phrase) {
      setSearchValue(phrase);
    } else {
      handleReset();
    }
  };

  const handleSelect = (phrase: string) => () => {
    setSearchValue(phrase);
    close();
    handleFocusInput();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") handleReset();
    if (event.key === "ArrowUp") {
      open();
      updateFocusableElements();
      if (isOpen && focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
      }
    }
    if (event.key === "ArrowDown") {
      open();
      updateFocusableElements();
      if (isOpen && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  };

  useDebounce(
    () => {
      if (searchValue) {
        const getSnippets = async () => {
          open();
          setIsLoadingSnippets(true);
          try {
            const data = await mockAutocompleteRequest(searchValue);
            setSnippets(data);
          } catch (error) {
            close();
            console.error(error);
          }
          setIsLoadingSnippets(false);
        };

        getSnippets();
      }
    },
    500,
    [searchValue],
  );

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      ref={refs.setReference}
      className="relative z-0"
    >
      <Input
        ref={inputRef}
        value={searchValue}
        onChange={handleChange}
        onFocus={open}
        aria-label="Search"
        placeholder="Search ..."
        className="py-4 text-lg"
        onKeyDown={handleInputKeyDown}
        slotPrefix={<SvgMagnifying className="size-8 text-gray-500" />}
        slotSuffix={
          isResetButton && (
            <button
              type="reset"
              onClick={handleReset}
              aria-label="Reset search"
              className="flex rounded-md outline-none focus-visible:outline focus-visible:outline-offset"
            >
              <SfIconCancel />
            </button>
          )
        }
      />
    </form>
  );
}
