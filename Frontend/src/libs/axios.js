import axios from "axios";

export const axiosInstance = axios.create({
  base_Url:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api/v1"
      : "/api/v1",
  withCredentials: true,
});
