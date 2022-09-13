export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.access) {
    return {
      Authorization: "Bearer " + user.access,
      "Access-Control-Allow-Origin": "http://127.0.0.1:5000",
      "Content-Type": "application/json",
    };
  } else {
    return {
      "Access-Control-Allow-Origin": "http://127.0.0.1:5000",
      "Content-Type": "application/json",
    };
  }
}
