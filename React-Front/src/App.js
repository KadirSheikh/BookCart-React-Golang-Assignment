import { Route, Routes, BrowserRouter } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Layout/Header";
import Books from "./components/Book/Books";
import Profile from "./components/Profile/Profile";

import Login from "./components/Authentication/Login";
import Registration from "./components/Authentication/Registration";

import MyBooks from "./components/Book/MyBooks";

function App() {
  const [isProfileShown, setIsProfileShown] = useState(false);

  const showProfileHandler = () => {
    setIsProfileShown(true);
  };

  const hideProfileHandler = () => {
    setIsProfileShown(false);
  };

  return (
    <BrowserRouter>
      {isProfileShown && <Profile onHideProfile={hideProfileHandler} />}
      <Header onShowProfile={showProfileHandler} />
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/books" element={<Books />} />
        <Route path="/mybooks" element={<MyBooks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
