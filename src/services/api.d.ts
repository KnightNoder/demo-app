declare module "./services/api" {
    import { AxiosInstance } from "axios";
    
    export const setAuthToken: (token: string | null) => void;
    const api: AxiosInstance;
    
    export default api;
  }
  