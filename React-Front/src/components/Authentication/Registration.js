import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Registration.module.css";
import { registerAuther } from "../../lib/api";

const Registration = () => {
  const navigate = useNavigate();
  const [formInputValidity, setFormInputValidity] = useState({
    name: true,
    email: true,
    password: true,
  });

  const [isLogging, setIsLogging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const isEmpty = (value) => value.trim() === "";
  const isEmail = (value) => value.includes("@");
  const isFiveChar = (value) => value.trim().length >= 5;

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredName = nameRef.current.value;
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredEmailIsValid = isEmail(enteredEmail);
    const enteredPasswordIsValid = isFiveChar(enteredPassword);

    setFormInputValidity({
      name: enteredNameIsValid,
      email: enteredEmailIsValid,
      password: enteredPasswordIsValid,
    });

    const formIsValid =
      enteredNameIsValid && enteredEmailIsValid && enteredPasswordIsValid;

    if (!formIsValid) {
      return;
    }

    console.log({
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
    });

    const resData = await registerAuther({
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
    });

    if (resData.status) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/books");
        window.location.reload();
      }, 500);
    } else {
      setIsLogging(false);
      setError(resData.message);
    }

    console.log(resData);
    setIsLogging(false);
  };

  const nameControlClasses = `${classes.control} ${
    formInputValidity.name ? "" : classes.invalid
  }`;
  const emailControlClasses = `${classes.control} ${
    formInputValidity.email ? "" : classes.invalid
  }`;
  const passwordControlClasses = `${classes.control} ${
    formInputValidity.password ? "" : classes.invalid
  }`;

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {isLogging && <p>Signing up...</p>}
      {!isLogging && !isSuccess && error && (
        <p className={classes.error}>{error}</p>
      )}
      {!isLogging && isSuccess && (
        <p className={classes.success}>Registration Successful...!</p>
      )}
      <div className={nameControlClasses}>
        <label htmlFor="name">Your Name</label>
        <input ref={nameRef} type="text" id="name" placeholder="Enter name" />
        {!formInputValidity.name && (
          <p className={classes.para}>Please enter your name.</p>
        )}
      </div>
      <div className={emailControlClasses}>
        <label htmlFor="email">Your Email</label>
        <input
          ref={emailRef}
          type="text"
          id="email"
          placeholder="Enter email"
        />
        {!formInputValidity.email && (
          <p className={classes.para}>Please enter email.</p>
        )}
      </div>
      <div className={passwordControlClasses}>
        <label htmlFor="password">Password</label>
        <input
          ref={passwordRef}
          type="password"
          id="password"
          placeholder="Enter password"
        />
        {!formInputValidity.password && (
          <p className={classes.para}>
            Please enter password 5 characters long.
          </p>
        )}
      </div>

      <div className={classes.actions}>
        <button className={classes.submit}>Register</button>
      </div>
      <div>
        <Link className={classes.alreadyRegistered} to="/login">
          Already Registered
        </Link>
      </div>
    </form>
  );
};

export default Registration;
