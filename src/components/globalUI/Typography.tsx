import classNames from "classnames";

interface mainTitleProps {
  content: string;
}
interface mainTextProps {
  content: string;
  cn?: string;
}

export const MainTitle = ({ content }: mainTitleProps) => {
  return <h1 className="main-title">{content}</h1>;
};

export const MainText = ({ content, cn }: mainTextProps) => {
  return <h5 className={classNames("lg:text-base", cn)}>{content}</h5>;
};

export const SecondaryTitle = ({ content, cn }: mainTextProps) => {
  return (
    <p
      className={classNames(
        "text-gray-500 text-sm sm:text-base md:text-lg dark:text-gray-200",
        cn,
      )}
    >
      {content}
    </p>
  );
};
