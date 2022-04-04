import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import { loginAuther } from "../../lib/api";

const Login = () => {
  const navigate = useNavigate();

  const [formInputValidity, setFormInputValidity] = useState({
    email: true,
    password: true,
  });

  const [isLogging, setIsLogging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState();

  const emailRef = useRef();
  const passwordRef = useRef();

  const isEmail = (value) => value.includes("@");
  const isFiveChar = (value) => value.trim().length >= 5;

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLogging(true);

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    const enteredEmailIsValid = isEmail(enteredEmail);
    const enteredPasswordIsValid = isFiveChar(enteredPassword);

    setFormInputValidity({
      email: enteredEmailIsValid,
      password: enteredPasswordIsValid,
    });

    const formIsValid = enteredEmailIsValid && enteredPasswordIsValid;

    if (!formIsValid) {
      setIsLogging(false);
      setIsSuccess(false);
      return;
    }

    console.log({
      email: enteredEmail,
      password: enteredPassword,
    });

    const resData = await loginAuther({
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

    setIsLogging(false);
    console.log(resData);
  };

  const emailControlClasses = `${classes.control} ${
    formInputValidity.email ? "" : classes.invalid
  }`;
  const passwordControlClasses = `${classes.control} ${
    formInputValidity.password ? "" : classes.invalid
  }`;

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {isLogging && <p>Signing in...</p>}
      {!isLogging && !isSuccess && error && (
        <p className={classes.error}>{error}</p>
      )}
      {!isLogging && isSuccess && (
        <p className={classes.success}>Login Successful...!</p>
      )}
      <div className={emailControlClasses}>
        <label htmlFor="email">Your Email</label>
        <input ref={emailRef} type="text" id="email" />
        {!formInputValidity.email && (
          <p className={classes.para}>Please enter email.</p>
        )}
      </div>
      <div className={passwordControlClasses}>
        <label htmlFor="password">Password</label>
        <input ref={passwordRef} type="text" id="passwordCode" />
        {!formInputValidity.password && (
          <p className={classes.para}>
            Please enter password 5 characters long.
          </p>
        )}
      </div>

      <div className={classes.actions}>
        <button className={classes.submit}>Login</button>
      </div>
      <div>
        <Link className={classes.alreadyRegistered} to="/register">
          Not Registered!
        </Link>
      </div>
    </form>
  );
};

export default Login;
