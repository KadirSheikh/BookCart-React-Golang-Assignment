import { useEffect, useState } from "react";
import classes from "./AvailableBooks.module.css";
import Card from "../UI/Card";
import BookItem from "./BookItem/BookItem";
import { getAllAvailableBooks } from "../../lib/api";

const AvailableBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getAllAvailableBooks()
      .then((data) => {
        console.log(data);
        setBooks(data);
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

  return (
    <section className={classes.books}>
      <Card>
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

export default AvailableBooks;
