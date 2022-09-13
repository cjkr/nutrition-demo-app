import React, { useEffect, useRef, useState } from "react";
import FoodService from "../services/food.service";

export default function Regular() {
  const [user, setUser] = useState({});
  const username = useRef("");

  const [foodName, setFoodName] = useState("");
  const [foodDate, setFoodDate] = useState(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substring(0, 16)
  );
  const [calories, setCalories] = useState("");

  const [foodList, setFoodList] = useState([]);
  const [calorieSum, setCalorieSum] = useState(0);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    FoodService.getFoods()
      .then((result) => {
        setFoodList([...result.data.data]);
      })
      .catch((err) => {});

    if (u) {
      username.current = u.username;
    }
  }, []);

  useEffect(() => {
    setCalorieSum(() => foodList.reduce((acc, curr) => acc + curr.calories, 0));
  }, [foodList]);

  function addUserFood(e) {
    e.preventDefault();

    console.log(foodName, foodDate, calories);

    FoodService.addFood(foodName, foodDate, calories)
      .then((result) => {
        setFoodList((l) => [...l, result.data]);
        setFoodName("");
        setFoodDate(
          new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .substring(0, 16)
        );
        setCalories("");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <div className="display-6 text-center pt-3 pb-4">
        {user && `Hi ${user.username} 🙂`}
      </div>
      <div className="fs-4 text-uppercase fw-light text-center pb-3">
        <p
          className={
            calorieSum <= user.calorie_limit ? "text-success" : "text-danger"
          }
        >{`CALORIES: ${calorieSum}`}</p>
        <p>{user && `CALORIE LIMIT: ${user.calorie_limit}`}</p>
      </div>
      <div className="d-flex">
        <div className="mx-auto main-content">
          <div className="auth-content">
            <form className="d-flex flex-row justify-content-between gap-3">
              <div className="">
                <input
                  value={foodName}
                  className="form-control fs-4 fw-light"
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Food name"
                />
              </div>
              <div className="">
                <input
                  value={calories}
                  className="form-control fs-4"
                  type="number"
                  name="calories"
                  id="calories"
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Calories"
                />
              </div>
              <div className="">
                <input
                  value={foodDate}
                  className="form-control fs-4"
                  type="datetime-local"
                  name="food_date"
                  id="food_date"
                  onChange={(e) => setFoodDate(e.target.value)}
                />
              </div>
              <div className="">
                <button
                  className="btn btn-primary btn-block btn-lg"
                  type="submit"
                  onClick={addUserFood}
                >
                  Submit
                </button>
              </div>
            </form>

            <div className="mt-5">
              {foodList.map((food) => (
                <div
                  className="d-flex flex-row justify-content-between"
                  key={food.id}
                >
                  <p className="fs-4 fw-light col ">{food.name}</p>
                  <p className="fs-5 col text-end">{food.calories} calories</p>
                  <p className="col-5 fw-bold text-end">{food.food_date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
