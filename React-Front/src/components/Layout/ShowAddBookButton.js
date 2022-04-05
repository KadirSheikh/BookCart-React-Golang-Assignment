import classes from "./ShowAddBookButton.module.css";
const ShowAddBookButton = (props) => {
  return (
    <div className={classes.actions}>
      <button className={classes.button} onClick={props.onShowModal}>
        Add Book
      </button>
    </div>
  );
};

export default ShowAddBookButton;
