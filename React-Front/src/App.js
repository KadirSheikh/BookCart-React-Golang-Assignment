import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Layout/Header";
import Books from "./components/Book/Books";
import Profile from "./components/Profile/Profile";
import Login from "./components/Authentication/Login";
import Registration from "./components/Authentication/Registration";
import MyBooks from "./components/Book/MyBooks";
import EditMyBook from "./components/Book/EditMyBook";

function App() {
  const [isProfileShown, setIsProfileShown] = useState(false);

  const showProfileHandler = () => {
    setIsProfileShown(true);
  };

  const hideProfileHandler = () => {
    setIsProfileShown(false);
  };

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  let isNull;
  if (isLoggedIn === null) {
    isNull = true;
  } else {
    isNull = false;
  }

  return (
    <BrowserRouter>
      {isProfileShown && <Profile onHideProfile={hideProfileHandler} />}
      <Header onShowProfile={showProfileHandler} />
      <Routes>
        {isNull && <Route path="/*" element={<Navigate to="/" replace />} />}
        {!isNull && (
          <Route path="/*" element={<Navigate to="/books" replace />} />
        )}
        <Route path="/" element={<Registration />} />
        <Route path="/books" element={<Books />} />
        <Route path="/mybooks" element={<MyBooks />} />
        <Route path="/mybooks/:bookid" element={<EditMyBook />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
