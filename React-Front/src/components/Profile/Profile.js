import { React, useEffect, useState, useRef, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import classes from "./Profile.module.css";
import Modal from "../UI/Modal";
import AddMyBook from "../Book/AddMyBook";
import ShowAddBookButton from "../Layout/ShowAddBookButton";
import { autherProfile, editProfile } from "../../lib/api";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Profile = (props) => {
  const [formInputValidity, setFormInputValidity] = useState({
    name: true,
    email: true,
  });
  
  const [passChangeValidity, setPassChangeValidity] = useState(true)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [books, setBooks] = useState([]);

  const [isLogging, setIsLogging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isPassChanged, setIsPassChanged] = useState(false);
  const [isBookEmpty, setIsBookEmpty] = useState(false);
  const [error, setError] = useState();

  const nameRef = useRef();
  const emailRef = useRef();
  const newPasswordRef = useRef();

  const [isModalShown, setIsModalShown] = useState(false);
  const showModalHandler = () => {
    setIsModalShown(true);
  };

  const hideModalHandler = () => {
    setIsModalShown(false);
  };

  const isEmpty = (value) => value.trim() === "";
  const isEmail = (value) => value.includes("@");

  const isFiveChar = (value) => value.trim().length >= 5;

  const navigate = useNavigate();
  useEffect(() => {
    autherProfile()
      .then((resData) => {
        console.log(resData);
        if (resData.status) {
          setName(resData.data.name);
          setEmail(resData.data.email);

          if (resData.data.books.length !== 0) {
            const twoBooks = resData.data.books.slice(0, 2);
            setBooks(twoBooks);
          } else {
            setIsBookEmpty(true);
          }

          setIsLoadingProfile(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsLoadingProfile(false);
      });
  }, []);

  const logOutHandler = () => {
    confirmAlert({
      title: "Confirm to logout",
      message: "Are you sure want to logout.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            props.onHideProfile();
            localStorage.clear();
            navigate("/login");
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
    setIsLogging(true);
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
      setIsLogging(false);
      return;
    }

    console.log({
      name: enteredName,
      email: enteredEmail,
    });

    editProfile({
      name: enteredName,
      email: enteredEmail,
    })
      .then((resData) => {
        if (resData.status) {
          setIsLogging(false);
          setIsSuccess(true);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          setIsLogging(false);
          setError(resData.message);
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsLogging(false);
      });
  };

  const submitPasswordHandler = async (event) => {
    event.preventDefault();
    setIsLogging(true);
    const enteredPass = newPasswordRef.current.value;

    const enteredPassIsValid = isFiveChar(enteredPass);

    setPassChangeValidity(enteredPassIsValid);

    if (!enteredPassIsValid) {
      setIsLogging(false);
      return;
    }

    console.log({
      name: name,
      email: email,
      password: enteredPass,
    });

    editProfile({
      name: name,
      email: email,
      password: enteredPass,
    })
      .then((resData) => {
        if (resData.status) {
          setIsLogging(false);
          setIsSuccess(true);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          setIsLogging(false);
          setError(resData.message);
        }
      })
      .catch((err) => {
        setIsLogging(false);
        setError(err.message);
      });
  };

  const changePasswordHandler = () => {
    setIsPassChanged(true);
  };
  const changeDetailsHandler = () => {
    setIsPassChanged(false);
  };

  const nameControlClasses = `${classes.control} ${
    formInputValidity.name ? "" : classes.invalid
  }`;
  const emailControlClasses = `${classes.control} ${
    formInputValidity.email ? "" : classes.invalid
  }`;
  const newPasswordControlClasses = `${classes.control} ${
    passChangeValidity ? "" : classes.invalid
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

  const editDetails = (
    <Fragment>
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
          <input
            defaultValue={name}
            ref={nameRef}
            type="text"
            id="name"
            placeholder="Enter name"
          />
          {!formInputValidity.name && (
            <p className={classes.para}>Please enter your name.</p>
          )}
        </div>
        <div className={emailControlClasses}>
          <label htmlFor="email">Your Email</label>
          <input
            defaultValue={email}
            ref={emailRef}
            type="text"
            id="email"
            placeholder="Enter email"
          />
          {!formInputValidity.email && (
            <p className={classes.para}>Please enter email.</p>
          )}
        </div>

        <div className={classes.actions}>
          <button className={classes.submit}>Edit</button>
        </div>
      </form>
      <br></br>
      <button
        className={classes.changePassword}
        onClick={changePasswordHandler}
      >
        Change password
      </button>
    </Fragment>
  );

  const changePassword = (
    <Fragment>
      <form className={classes.form} onSubmit={submitPasswordHandler}>
        {isLogging && <p>Changing Password...</p>}
        {!isLogging && !isSuccess && error && (
          <p className={classes.error}>{error}</p>
        )}
        {!isLogging && isSuccess && (
          <p className={classes.success}>Password Changed Successfully...!</p>
        )}

        <div className={newPasswordControlClasses}>
          <label htmlFor="newPassword">New Password</label>
          <input
            ref={newPasswordRef}
            type="text"
            id="newPassword"
            placeholder="******"
          />
          {!passChangeValidity && (
            <p className={classes.para}>
              Please enter password of atleast 5 characters long.
            </p>
          )}
        </div>

        <div className={classes.actions}>
          <button className={classes.submit}>Change</button>
        </div>
      </form>
      <br></br>
      <button className={classes.changePassword} onClick={changeDetailsHandler}>
        Change details
      </button>
    </Fragment>
  );

  const profileData = (
    <Fragment>
      {!isPassChanged && editDetails}
      {isPassChanged && changePassword}

      <div>
        <h3>Books:</h3>
        {!isBookEmpty && (
          <Fragment>
            <ul>{myBookList}</ul>
            <div className={classes.actions}>
              <Link
                className={classes.viewAll}
                to="/mybooks"
                onClick={props.onHideProfile}
              >
                View All
              </Link>
            </div>
          </Fragment>
        )}

        {isBookEmpty && (
          <Fragment>
            <p className={classes.error}>No Books Found</p>
            {isModalShown && <AddMyBook onHideModal={hideModalHandler} />}
            <ShowAddBookButton onShowModal={showModalHandler} />
          </Fragment>
        )}
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
    </Fragment>
  );

  return (
    <Modal onClose={props.onHideProfile}>
      {isLoadingProfile && <p>Loading Profile...</p>}
      {error && <p className={classes.error}>{error}</p>}
      {!isLoadingProfile && !error && profileData}
    </Modal>
  );
};

export default Profile;
