import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "https://linkedin-clone-srinivas.vercel.app/api/v1" : "/api/v1",
	withCredentials: true,
});
