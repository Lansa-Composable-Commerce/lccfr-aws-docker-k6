import { useEffect, useState } from "react";

export const useWindowDimensions = (
  width: number | null,
  height: number | null,
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const widthCondition = width ? window.innerWidth <= width : true;
        const heightCondition = height ? window.innerHeight <= height : true;
        setIsVisible(widthCondition && heightCondition);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, height]);

  return isVisible;
};
