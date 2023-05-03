export type AuthStateType = {
  data: {
    uid: string;
    photoURL: string;
  } | null;
  isLoading: boolean;
};
export interface AuthContextType {
  user: AuthStateType;
  logout: () => Promise<void>;
}