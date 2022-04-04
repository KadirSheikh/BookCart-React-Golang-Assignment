import { NavLink } from "react-router-dom";
import { Fragment } from "react";
import BookImg from "../../assets/books.jpg";
import classes from "./Header.module.css";

const Header = (props) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  let isNull;
  if (isLoggedIn === null) {
    isNull = true;
  } else {
    isNull = false;
  }

  return (
    <Fragment>
      <header className={classes.header}>
        <div className={classes.logo}>Book Cart</div>
        {isNull && (
          <nav className={classes.nav}>
            <ul>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            </ul>
          </nav>
        )}

        {!isNull && (
          <nav className={classes.nav}>
            <ul>
              <li>
                <NavLink to="/books">Books</NavLink>
              </li>
              <li onClick={props.onShowProfile}>My Profile</li>
            </ul>
          </nav>
        )}
      </header>
      <div className={classes["main-image"]}>
        <img src={BookImg} alt="BookImg" />
      </div>
    </Fragment>
  );
};

export default Header;
