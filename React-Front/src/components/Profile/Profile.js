import { React, useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import classes from "./Profile.module.css";
import Modal from "../UI/Modal";
import { autherProfile, editProfile } from "../../lib/api";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Profile = (props) => {
  const [formInputValidity, setFormInputValidity] = useState({
    name: true,
    email: true,
    password: true,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [books, setBooks] = useState([]);

  const [isLogging, setIsLogging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPassChanged, setIsPassChanged] = useState(false);
  const [error, setError] = useState();

  const nameRef = useRef();
  const emailRef = useRef();
  const newPasswordRef = useRef();

  const isEmpty = (value) => value.trim() === "";
  const isEmail = (value) => value.includes("@");

  const isFiveChar = (value) => value.trim().length >= 5;

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchProfile() {
      const resData = await autherProfile();
      console.log(resData);
      if (resData.status) {
        setName(resData.data.name);
        setEmail(resData.data.email);
        const twoBooks = resData.data.books.slice(0, 2);
        setBooks(twoBooks);
      }
    }

    fetchProfile();
  }, []);

  const logOutHandler = () => {
    confirmAlert({
      title: "Confirm to logout",
      message: "Are you sure want to logout.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            localStorage.clear();
            setTimeout(() => {
              navigate("/login");
              window.location.reload();
            }, 500);
          },
        },
        {
          label: "No",
          onClick: () => console.log("Click No"),
        },
      ],
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredName = nameRef.current.value;
    const enteredEmail = emailRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredEmailIsValid = isEmail(enteredEmail);

    setFormInputValidity({
      name: enteredNameIsValid,
      email: enteredEmailIsValid,
    });

    const formIsValid = enteredNameIsValid && enteredEmailIsValid;

    if (!formIsValid) {
      return;
    }

    console.log({
      name: enteredName,
      email: enteredEmail,
    });

    const resData = await editProfile({
      name: enteredName,
      email: enteredEmail,
    });

    if (resData.status) {
      setIsSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      setIsLogging(false);
      setError(resData.message);
    }

    setIsLogging(false);
  };

  const submitPasswordHandler = async (event) => {
    event.preventDefault();

    const enteredPass = newPasswordRef.current.value;

    // const enteredPassIsValid = !isFiveChar(enteredPass);

    // setFormInputValidity({
    //   password: enteredPassIsValid,
    // });

    // const formIsValid = enteredPassIsValid;

    // if (!formIsValid) {
    //   return;
    // }

    console.log({
      name: name,
      email: email,
      password: enteredPass,
    });

    // const resData = await editProfile({
    // name: name,
    // email: email,
    //   password: enteredPass,
    // });

    // if (resData.status) {
    //   setIsSuccess(true);
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 500);
    // } else {
    //   setIsLogging(false);
    //   setError(resData.message);
    // }

    setIsLogging(false);
  };

  const changePasswordHandler = () => {
    setIsPassChanged(true);
  };

  const nameControlClasses = `${classes.control} ${
    formInputValidity.name ? "" : classes.invalid
  }`;
  const emailControlClasses = `${classes.control} ${
    formInputValidity.email ? "" : classes.invalid
  }`;
  const newPasswordControlClasses = `${classes.control} ${
    formInputValidity.email ? "" : classes.invalid
  }`;

  const myBookList = books.map((book) => (
    <li className={classes.Book} key={book.id}>
      <div>
        <div className={classes.title}>{book.title}</div>
        <div className={classes.description}>
          {book.description.substring(0, 50)}...
        </div>
      </div>
    </li>
  ));

  return (
    <Modal onClose={props.onHideProfile}>
      {!isPassChanged && (
        <form className={classes.form} onSubmit={submitHandler}>
          {isLogging && <p>Editing Profile...</p>}
          {!isLogging && !isSuccess && error && (
            <p className={classes.error}>{error}</p>
          )}
          {!isLogging && isSuccess && (
            <p className={classes.success}>Profile Edited Successfully...!</p>
          )}
          <div className={nameControlClasses}>
            <label htmlFor="name">Your Name</label>
            <input defaultValue={name} ref={nameRef} type="text" id="name" />
            {!formInputValidity.name && (
              <p className={classes.para}>Please enter your name.</p>
            )}
          </div>
          <div className={emailControlClasses}>
            <label htmlFor="email">Your Email</label>
            <input defaultValue={email} ref={emailRef} type="text" id="email" />
            {!formInputValidity.email && (
              <p className={classes.para}>Please enter email.</p>
            )}
          </div>

          <div className={classes.actions}>
            <button className={classes.submit}>Edit</button>
          </div>
        </form>
      )}
      {isPassChanged && (
        <form className={classes.form} onSubmit={submitPasswordHandler}>
          {/* {isLogging && <p>Changing Password...</p>}
          {!isLogging && !isSuccess && error && (
            <p className={classes.error}>{error}</p>
          )}
          {!isLogging && isSuccess && (
            <p className={classes.success}>Password Changed Successfully...!</p>
          )} */}

          <div>
            <label htmlFor="newPassword">New Password</label>
            <input ref={newPasswordRef} type="text" id="newPassword" />
            {/* {!formInputValidity.newPassword && (
              <p className={classes.para}>
                Please enter password of atleast 5 characters long.
              </p>
            )} */}
          </div>

          <div className={classes.actions}>
            <button className={classes.submit}>Change</button>
          </div>
        </form>
      )}
      <br></br>

      <button
        className={classes.changePassword}
        onClick={changePasswordHandler}
      >
        Click to change password
      </button>

      <div>
        <h3>Books:</h3>
        <ul>{myBookList}</ul>
      </div>
      <div className={classes.actions}>
        <Link
          className={classes.viewAll}
          to="/mybooks"
          onClick={props.onHideProfile}
        >
          View All
        </Link>
      </div>
      <br></br>
      <div className={classes.actions}>
        <button className={classes.button} onClick={logOutHandler}>
          Logout
        </button>
        <button className={classes.button} onClick={props.onHideProfile}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default Profile;
