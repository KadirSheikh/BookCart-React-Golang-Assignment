import Modal from "../UI/Modal";
import classes from "./AddMyBook.module.css";
import { useRef, useState } from "react";
import { addNewBook } from "../../lib/api";

const AddMyBook = (props) => {
  const [formInputValidity, setFormInputValidity] = useState({
    title: true,
    description: true,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState();

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

    addNewBook({
      title: enteredTitle,
      description: enteredDescription,
    })
      .then((resData) => {
        if (resData.status) {
          setIsSuccess(true);
          setIsAdding(false);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          setError(resData.message);
          setIsAdding(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsAdding(false);
      });
  };

  const titleControlClasses = `${classes.control} ${
    formInputValidity.title ? "" : classes.invalid
  }`;
  const descriptionControlClasses = `${classes.control} ${
    formInputValidity.description ? "" : classes.invalid
  }`;

  return (
    <Modal onClose={props.onHideModal}>
      <form className={classes.form} onSubmit={submitHandler}>
        {isAdding && <p>Adding New Book...</p>}
        {!isAdding && !isSuccess && error && (
          <p className={classes.error}>{error}</p>
        )}
        {!isAdding && isSuccess && (
          <p className={classes.success}>Added Successfully...!</p>
        )}
        <div className={titleControlClasses}>
          <label htmlFor="title">Title</label>
          <input
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
            id="description"
            placeholder="Book description"
          />
          {!formInputValidity.description && (
            <p className={classes.para}>Please enter book description.</p>
          )}
        </div>

        <div className={classes.actions}>
          <button className={classes.submit}>Add</button>
        </div>
      </form>

      <div className={classes.actions}>
        <button className={classes.submit} onClick={props.onHideModal}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default AddMyBook;
