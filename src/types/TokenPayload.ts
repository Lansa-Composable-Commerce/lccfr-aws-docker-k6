export interface Xtras {
  ceGUID: string;
  ceUserName: string;
  ceEmail: string;
  ceFirstName: string;
  ceLastName: string;
  userId?: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  xtras: Xtras;
}
