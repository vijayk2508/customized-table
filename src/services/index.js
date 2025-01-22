import axios from "axios";

const baseURL = "http://localhost:3030"//"https://customized-table-backend.vercel.app/api";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const axiosInstance = axios.create({ baseURL, headers });

export { axiosInstance };
