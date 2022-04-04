import { useEffect, useState, Fragment } from "react";
import classes from "./MyBooks.module.css";
import Card from "../UI/Card";
import { getMyBooks } from "../../lib/api";
import AddMyBook from "../Book/AddMyBook";
import ShowAddBookButton from "../Layout/ShowAddBookButton";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [isProfileShown, setIsProfileShown] = useState(false);

  const showProfileHandler = () => {
    setIsProfileShown(true);
  };

  const hideProfileHandler = () => {
    setIsProfileShown(false);
  };

  useEffect(() => {
    async function fetchMyBooks() {
      const myBooks = await getMyBooks();
      setBooks(myBooks);
      setIsLoading(false);
    }

    fetchMyBooks().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.BooksLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  const bookList = books.map((book) => (
    <Fragment key={book.id}>
      <button className={classes.editBtn}>Edit</button>
      <button className={classes.deleteBtn}>Delete</button>
      <li className={classes.Book}>
        <div>
          <div className={classes.title}>{book.name}</div>
          <div className={classes.description}>{book.description}</div>
        </div>
      </li>
    </Fragment>
  ));

  return (
    <section className={classes.books}>
      <Card>
        {isProfileShown && <AddMyBook onHideProfile={hideProfileHandler} />}
        <ShowAddBookButton onShowProfile={showProfileHandler} />
        {error && (
          <section className={classes.BooksError}>
            <p>{error}</p>
          </section>
        )}
        <ul>{bookList}</ul>
      </Card>
    </section>
  );
};

export default MyBooks;
