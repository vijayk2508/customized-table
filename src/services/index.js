import axios from "axios";

const baseURL = "https://customized-table-backend.vercel.app";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const axiosInstance = axios.create({ baseURL, headers });

export { axiosInstance };
