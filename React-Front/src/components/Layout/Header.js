import { Fragment } from "react";
import mealImg from "../../assets/meals.jpg";
import classes from "./Header.module.css";
import HeaderCartButton from "../Layout/HeaderCartButton";

const Header = (props) => {
  return (
    <Fragment>
      <header className={classes.header}>
        <h1>Book Cart</h1>
        <HeaderCartButton onClick={props.onShowCart} />
      </header>
      <div className={classes["main-image"]}>
        <img src={mealImg} alt="mealImg" />
      </div>
    </Fragment>
  );
};

export default Header;
