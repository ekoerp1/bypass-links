export interface IAuthResponse {
  readonly uid: string;
  readonly email: string;
  readonly fullName: string;
  readonly photoUrl?: string;
  readonly displayName?: string;
  readonly idToken: string;
  readonly expiresIn: number;
  readonly expiresAtMs: number;
  readonly refreshToken: string;
}

export interface IRefreshTokenResponse {
  readonly expiresIn: number;
  readonly idToken: string;
  readonly refreshToken: string;
}
