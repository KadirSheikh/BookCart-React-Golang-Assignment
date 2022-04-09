import classes from "./SingleAuthor.module.css";

const SingleAuthor = (props) => {
  return (
    <li className={classes.Author}>
      <div>
        <div className={classes.name}>{props.name}</div>
        <div className={classes.email}>{props.email}</div>
      </div>
    </li>
  );
};

export default SingleAuthor;
