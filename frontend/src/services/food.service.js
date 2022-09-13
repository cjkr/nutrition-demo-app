import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://127.0.0.1:5000/api/v1/food/";

const getFoods = () => {
  return axios.get(API_URL, { headers: authHeader(), withCredentials: false });
};

const addFood = (name, food_date, calories) => {
  return axios.post(
    API_URL,
    { name, food_date, calories },
    { headers: authHeader(), withCredentials: false }
  );
};

const getFood = (id) => {
  return axios.get(API_URL + id, {
    headers: authHeader(),
    withCredentials: false,
  });
};

const updateFood = (id, name, food_date, calories) => {
  return axios.put(
    API_URL + id,
    { name, food_date, calories },
    { headers: authHeader(), withCredentials: false }
  );
};

const deleteFood = (id) => {
  return axios.delete(API_URL + id, { headers: authHeader() });
};

const FoodService = {
  getFoods,
  getFood,
  addFood,
  updateFood,
  deleteFood,
};

export default FoodService;
