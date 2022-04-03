import { React, useEffect } from "react";

import classes from "./Profile.module.css";
import Modal from "../UI/Modal";
import { autherProfile } from "../../lib/api";

const Profile = (props) => {
  useEffect(() => {
    async function fetchProfile() {
      const resData = await autherProfile();
      console.log(resData);
    }

    fetchProfile();
  }, []);

  return (
    <Modal onClose={props.onHideProfile}>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onHideProfile}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default Profile;
