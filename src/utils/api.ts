import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // your Django backend
});

export const fetchInternships = () => API.get("/internships/");
export const fetchJobs = () => API.get("/jobs/");
export const loginUser = (data: { username: string; password: string }) => API.post("/login/", data);
export const registerUser = (data: { username: string; email: string; password: string }) => API.post("/register/", data);
