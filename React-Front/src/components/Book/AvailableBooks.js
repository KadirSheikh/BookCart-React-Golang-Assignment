import { useEffect, useState } from "react";
import classes from "./AvailableBooks.module.css";
import Card from "../UI/Card";
import BookItem from "./BookItem/BookItem";
import { getAllAvailableBooks } from "../../lib/api";
import { Fragment } from "react/cjs/react.production.min";
import { useNavigate, useSearchParams } from "react-router-dom";


const sortBooks = (books, ascending) => {
  return books.sort((bookA, bookB) => {
    if (ascending) {
      return bookA.id > bookB.id ? 1 : -1;
    } else {
      return bookA.id < bookB.id ? 1 : -1;
    }
  });
};

const AvailableBooks = () => {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [isBookEmpty, setIsBookEmpty] = useState(false);
  const [searchValue, setSearchValue] = useState("");


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

  const isSortingAscending = searchParams.get("sort") === "asc";
  const sortedBooks = sortBooks(books, isSortingAscending);

  const changeSortingHandler = () => {
    navigate("/books?sort=" + (isSortingAscending ? "desc" : "asc"));
  };

  if (isLoading) {
    return (
      <section className={classes.BooksLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  const bookList = sortedBooks.filter(book => book.name.match(new RegExp(searchValue, "i"))).map((book) => (
    <BookItem
      key={book.id}
      id={book.id}
      name={book.name}
      description={book.description}
      author={book.author}
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

  const searchingNSorting = <div className={classes.sorting}>
  <button onClick={changeSortingHandler}>
    Sort {isSortingAscending ? "Descending" : "Ascending"}
  </button>

  <input
  type="text"
  name="search"
  value={searchValue}
  className={classes.searchBook}
  placeholder="Search Book..."
  onChange={e => setSearchValue(e.target.value)}
/>
</div>

  return (
    <section className={classes.books}>
      <Card>
        {searchingNSorting}
        {isBookEmpty && (
          <p className={classes.BooksError}>No books found.</p>
        )}
        {!isBookEmpty && booksData}
      </Card>
    </section>
  );
};

export default AvailableBooks;
