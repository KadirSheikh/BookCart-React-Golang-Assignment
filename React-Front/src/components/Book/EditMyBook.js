import classes from "./EditMyBook.module.css";
import { useRef, useState, Fragment, useEffect } from "react";
import { getBookById, editBook } from "../../lib/api";
import { useParams, useNavigate } from "react-router-dom";

const EditMyBook = (props) => {
  const navigate = useNavigate();

  const params = useParams();
  const { bookid } = params;

  const [formInputValidity, setFormInputValidity] = useState({
    title: true,
    description: true,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState();
  const [title, setTitle] = useState("");
  const [description, setDesription] = useState("");

  useEffect(() => {
    async function getMyBookById(bookid) {
      const resp = await getBookById(bookid);
      console.log(resp);

      if (resp.status) {
        setTitle(resp.data.title);
        setDesription(resp.data.description);
      }
    }

    getMyBookById(bookid);
  }, [bookid]);

  const titleRef = useRef();
  const descriptionRef = useRef();

  const isEmpty = (value) => value.trim() === "";

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsAdding(true);

    const enteredTitle = titleRef.current.value;
    const enteredDescription = descriptionRef.current.value;

    const enteredTitleIsValid = !isEmpty(enteredTitle);
    const enteredDescriptionIsValid = !isEmpty(enteredDescription);

    setFormInputValidity({
      title: enteredTitleIsValid,
      description: enteredDescriptionIsValid,
    });

    const formIsValid = enteredTitleIsValid && enteredDescriptionIsValid;

    if (!formIsValid) {
      setIsAdding(false);
      setIsSuccess(false);
      return;
    }

    console.log({
      title: enteredTitle,
      description: enteredDescription,
    });

    const resData = await editBook(
      {
        title: enteredTitle,
        description: enteredDescription,
      },
      bookid
    );

    if (resData.status) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/mybooks");
        window.location.reload();
      }, 500);
    } else {
      setIsAdding(false);
      setError(resData.message);
    }

    setIsAdding(false);
  };

  const titleControlClasses = `${classes.control} ${
    formInputValidity.title ? "" : classes.invalid
  }`;
  const descriptionControlClasses = `${classes.control} ${
    formInputValidity.description ? "" : classes.invalid
  }`;

  return (
    <Fragment>
      <form className={classes.form} onSubmit={submitHandler}>
        {/* <p>Editing Book...</p> */}
        {isAdding && <p>Editing Book...</p>}
        {!isAdding && !isSuccess && error && (
          <p className={classes.error}>{error}</p>
        )}
        {!isAdding && isSuccess && (
          <p className={classes.success}>Edited Successfully...!</p>
        )}
        <div className={titleControlClasses}>
          <label htmlFor="title">Title</label>
          <input
            defaultValue={title}
            ref={titleRef}
            type="text"
            id="title"
            placeholder="Book title"
          />
          {!formInputValidity.title && (
            <p className={classes.para}>Please enter book title.</p>
          )}
        </div>
        <div className={descriptionControlClasses}>
          <label htmlFor="description">Description</label>
          <textarea
            ref={descriptionRef}
            type="text"
            id="descriptionCode"
            defaultValue={description}
            placeholder="Book description"
          />
          {!formInputValidity.description && (
            <p className={classes.para}>Please enter book description.</p>
          )}
        </div>

        <div className={classes.actions}>
          <button className={classes.submit}>Edit</button>
        </div>
      </form>
    </Fragment>
  );
};

export default EditMyBook;
