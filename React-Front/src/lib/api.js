const ROOT_ROUTE = "http://localhost:8000/api";

export async function loginAuther(autherData) {
  const response = await fetch(`${ROOT_ROUTE}/auth/login`, {
    method: "POST",
    body: JSON.stringify(autherData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resData = await response.json();

  if (resData.status) {
    localStorage.setItem("token", resData.data.token);
    localStorage.setItem("isLoggedIn", "Y");
  }

  return resData;
}

export async function registerAuther(autherData) {
  const response = await fetch(`${ROOT_ROUTE}/auth/register`, {
    method: "POST",
    body: JSON.stringify(autherData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resData = await response.json();

  if (resData.status) {
    localStorage.setItem("token", resData.data.token);
    localStorage.setItem("isLoggedIn", "Y");
  }

  return resData;
}

export async function autherProfile() {
  const response = await fetch(`${ROOT_ROUTE}/auther/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();

  return resData;
}
