import { useEffect, useState } from "react";

const checkImageExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export default function useImageSrc(
  productImage: string | null,
  baseImageUrl: string,
  fallbackImage: string,
) {
  const [imgSrc, setImgSrc] = useState(fallbackImage);

  useEffect(() => {
    if (!productImage) {
      setImgSrc(fallbackImage);
      return;
    }
    const imageUrl = productImage.startsWith("https://")
      ? productImage
      : `${baseImageUrl}${productImage}`;
    checkImageExists(imageUrl).then((exists) => {
      setImgSrc(exists ? imageUrl : fallbackImage);
    });
  }, [productImage, baseImageUrl, fallbackImage]);

  return imgSrc;
}
