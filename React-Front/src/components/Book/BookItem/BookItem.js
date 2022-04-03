import classes from "./BookItem.module.css";

const BookItem = (props) => {
  return (
    <li className={classes.Book}>
      <div>
        <div className={classes.price}>{props.name}</div>
        <div className={classes.description}>{props.description}</div>
        <h5>-{props.auther}</h5>
      </div>
    </li>
  );
};

export default BookItem;
