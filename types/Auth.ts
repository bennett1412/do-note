export type AuthStateType = {
  data: Object | null;
  isLoading: boolean;
};
export interface AuthContextType {
  user: AuthStateType;
  logout: () => Promise<void>;
}