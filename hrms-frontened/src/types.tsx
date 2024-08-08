
export interface AuthState {
    accessToken: string | null;
    isAuthenticated : boolean | null;
    role : string | null;
    userId : number | null;
    firstName : string | null;
    navTitle : string | null
  }
  
  export interface RootState {
    auth: AuthState;
  }
  