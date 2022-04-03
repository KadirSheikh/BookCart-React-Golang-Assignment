import ProfileIcon from "../Profile/ProfileIcon";
import classes from "./HeaderProfileButton.module.css";

const HeaderProfileButton = (props) => {
  return (
    <button className={classes.button} onClick={props.onClick}>
      <span className={classes.icon}>
        <ProfileIcon />
      </span>
      <span>My Profile</span>
    </button>
  );
};

export default HeaderProfileButton;
