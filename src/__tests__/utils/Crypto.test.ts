import { encrypt, decrypt } from "@/utils/crypto";

describe("Encryption Function", () => {
  const secretKey = "mySecretKey";
  const data = "Hello, World!";

  test("it should encrypt data correctly", () => {
    const encryptedData = encrypt(data, secretKey);
    expect(encryptedData).toBeDefined();
    expect(encryptedData).not.toBe(data);
  });

  test("it should return undefined if secretKey is missing", () => {
    const result = encrypt(data, "");
    expect(result).toBeUndefined();
  });
});

describe("Decryption Function", () => {
  const secretKey = "mySecretKey";
  const data = "Hello, World!";
  const encryptedData = encrypt(data, secretKey);

  test("it should decrypt data correctly", () => {
    const decryptedData = decrypt(encryptedData!, secretKey);
    expect(decryptedData).toBe(data);
  });

  test("it should return undefined if secretKey is missing", () => {
    const result = decrypt(encryptedData!, "");
    expect(result).toBeUndefined();
  });

  test("it should return undefined if encryptedData is missing", () => {
    const result = decrypt("", secretKey);
    expect(result).toBeUndefined();
  });

  test("it should return undefined if both secretKey and encryptedData are missing", () => {
    const result = decrypt("", "");
    expect(result).toBeUndefined();
  });
});
