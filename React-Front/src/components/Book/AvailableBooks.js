import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./AvailableBooks.module.css";
import Card from "../UI/Card";
import BookItem from "./BookItem/BookItem";

const AvailableBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/books/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const books = res.data;
        console.log(books.data);

        const loadedBooks = [];

        for (const key in books.data) {
          loadedBooks.push({
            id: books.data[key].id,
            name: books.data[key].title,
            description: books.data[key].description,
            auther: books.data[key].auther.name,
          });
        }

        console.log(loadedBooks);

        setBooks(loadedBooks);
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
