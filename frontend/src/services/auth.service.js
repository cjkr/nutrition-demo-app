import axios from "axios";
import authHeader from "./authHeader";
const API_URL = "http://127.0.0.1:5000/api/v1/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "register", {
    username,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((result) => {
      console.log(result.data.user);
      localStorage.setItem("user", JSON.stringify(result.data.user));
    })
    .catch((err) => {});
};

const logout = () => {
  localStorage.removeItem("user");
};

const me = () => {
  return axios.get(API_URL + "me", { headers: authHeader() });
};

const invite = (username, email) => {
  return axios.post(
    API_URL + "invite_friend",
    { username, email },
    { headers: authHeader(), withCredentials: false }
  );
};

const Authservice = {
  register,
  login,
  logout,
  me,
  invite,
};

export default Authservice;
