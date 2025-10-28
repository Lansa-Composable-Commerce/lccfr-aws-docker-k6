import crypto from "crypto-js";
import Utf8 from "crypto-js/enc-utf8";

export const encrypt = (data: string, secretKey: string | undefined) => {
  if (!secretKey) return;

  return crypto.AES.encrypt(data, secretKey).toString();
};

export const decrypt = (
  encryptedData: string,
  secretKey: string | undefined,
) => {
  if (!secretKey || !encryptedData) return;

  const bytes = crypto.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(Utf8);
};
