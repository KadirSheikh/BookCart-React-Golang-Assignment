import { useEffect, useState } from "react";
import classes from "./AvailableBooks.module.css";
import Card from "../UI/Card";
import BookItem from "./BookItem/BookItem";
import { getAllAvailableBooks } from "../../lib/api";
import { Fragment } from "react/cjs/react.production.min";

const AvailableBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [isBookEmpty, setIsBookEmpty] = useState(false);

  useEffect(() => {
    getAllAvailableBooks()
      .then((data) => {
        console.log(data);
        if (data.length !== 0) {
          setBooks(data);
          setIsBookEmpty(false);
        } else {
          setIsBookEmpty(true);
        }

        setIsLoading(false);
      })
      .catch((err) => {
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
    <BookItem
      key={book.id}
      id={book.id}
      name={book.name}
      description={book.description}
      auther={book.auther}
    />
  ));

  const booksData = <Fragment>
    {error && (
      <section className={classes.BooksError}>
        <p>{error}</p>
      </section>
    )}
    <ul>{bookList}</ul>
  </Fragment>

  return (
    <section className={classes.books}>
      <Card>
        {isBookEmpty && (
          <p className={classes.BooksError}>No books found.</p>
        )}
        {!isBookEmpty && booksData}
      </Card>
    </section>
  );
};

export default AvailableBooks;
