import React, { useEffect, useState } from "react";
import FoodService from "../services/food.service";

export default function Admin() {
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    FoodService.getStats()
      .then((result) => {
        console.log(result.data);
        setAdminData(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleAdminDelete = (id) => {
    FoodService.adminDeleteFood(id)
      .then((result) => {
        FoodService.getStats()
          .then((result) => {
            console.log(result.data);
            setAdminData(result.data);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="display-6 text-center pt-3 text-secondary">
        ADMIN PAGE
      </div>
      {adminData.recent_week && (
        <div className="d-flex flex-column align-items-center">
          <p className="text-center">
            <span className="fs-1 fw-light">
              {adminData.recent_week.length}
            </span>
            <span className="fs-4 fw-light"> entries added in last 7 days</span>
            <span className="fs-2 fw-bold text-primary"> vs </span>
            <span className="fs-1 fw-light">{adminData.past_week.length}</span>
            <span className="fs-4 fw-light">
              {" "}
              entries added the week before that
            </span>
          </p>
          <hr className="w-50" />
          <p className="fs-5 fw-light text-secondary">
            AVERAGE CALORIES ADDED PER USER LAST WEEK
          </p>
          {adminData.avg_cals.length > 0 ? (
            adminData.avg_cals.map((user, user_index) => (
              <div
                className="d-flex flex-row justify-content-between avg_cal_table"
                key={user_index}
              >
                <p>{user.username}</p>
                <hr className="w-50" />
                <p>{user.avg_cal.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <div>NO AVAILABLE PAST WEEK'S USAGE DATA</div>
          )}
          <hr className="w-50" />
          <p className="fs-5 fw-light text-secondary">USER DATA</p>
          {adminData.food_data.length > 0 && (
            <div className="row food_data_table">
              <div className="col fw-bold">USER</div>
              <div className="col-2 fw-bold">FOOD</div>
              <div className="col fw-bold">CALORIES</div>
              <div className="col-4 fw-bold">DATE</div>
              <div className="col btn-secondary"></div>
            </div>
          )}
          {adminData.food_data.length > 0 ? (
            adminData.food_data.map((food, food_index) => (
              <div className="row food_data_table" key={food_index}>
                <div className="col border text-uppercase">{food.user}</div>
                <div className="col-2 border">{food.name}</div>
                <div className="col border text-end">{food.calories}</div>
                <div className="col-4 border">{food.food_date}</div>
                <button
                  className="col btn btn-danger border"
                  onClick={() => handleAdminDelete(food.food_id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div>NO AVAILABLE USER DATA</div>
          )}
        </div>
      )}
    </>
  );
}
