import { decodeToken } from "@/lib/auth/verifyToken";

export const getUserFromToken = (accessToken: string | null) => {
  const user = decodeToken(accessToken);

  return user
    ? {
        firstName: user.xtras.ceFirstName,
        lastName: user.xtras.ceLastName,
        email: user.xtras.ceEmail,
        userId: user.xtras.userId,
      }
    : {
        firstName: "Guest",
        lastName: "",
        email: "",
        userId: "",
      };
};
