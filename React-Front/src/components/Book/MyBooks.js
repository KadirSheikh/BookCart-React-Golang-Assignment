import { useEffect, useState, Fragment } from "react";
import classes from "./MyBooks.module.css";
import Card from "../UI/Card";
import { getMyBooks, deleteBook } from "../../lib/api";
import AddMyBook from "../Book/AddMyBook";
import ShowAddBookButton from "../Layout/ShowAddBookButton";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";


const sortBooks = (books, ascending) => {
  return books.sort((bookA, bookB) => {
    if (ascending) {
      return bookA.id > bookB.id ? 1 : -1;
    } else {
      return bookA.id < bookB.id ? 1 : -1;
    }
  });
};


const MyBooks = () => {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [isModalShown, setIsModalShown] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isBookEmpty, setIsBookEmpty] = useState(false);

  const showModalHandler = () => {
    setIsModalShown(true);
  };

  const hideModalHandler = () => {
    setIsModalShown(false);
  };

  useEffect(() => {
    async function fetchMyBooks() {
      const myBooks = await getMyBooks();
      if (myBooks.length !== 0) {
        setBooks(myBooks);
        setIsBookEmpty(false);
      } else {
        setIsBookEmpty(true);
      }
      setIsLoading(false);
    }

    fetchMyBooks().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, []);

  const isSortingAscending = searchParams.get("sort") === "asc";
  const sortedBooks = sortBooks(books, isSortingAscending);

  const changeSortingHandler = () => {
    navigate("/mybooks?sort=" + (isSortingAscending ? "desc" : "asc"));
  };

  const deleteBookById = (event) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure want to delete this book.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            window.scrollTo(0, 0);
            deleteBook(event.target.id)
              .then((res) => {
                console.log(res);
                if (res.status) {
                  setDeleteSuccess(res.message);
                } else {
                  setDeleteError(res.message);
                }

                setTimeout(() => {
                  window.location.reload();
                }, 500);
              })
              .catch((err) => {
                setDeleteError(err.message);
              });
          },
        },
        {
          label: "No",
          onClick: () => console.log("Click No"),
        },
      ],
    });
  };

  if (isLoading) {
    return (
      <section className={classes.BooksLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  const bookList = sortedBooks.filter(book => book.name.match(new RegExp(searchValue, "i"))).map((book) => (
    <Fragment key={book.id}>
      <Link to={`/mybooks/${book.id}`} className={classes.editBtn}>
        Edit
      </Link>

      <button
        className={classes.deleteBtn}
        id={book.id}
        onClick={deleteBookById}
      >
        Delete
      </button>

      <li className={classes.Book}>
        <div>
          <div className={classes.title}>{book.name}</div>
          <div className={classes.description}>{book.description}</div>
        </div>
      </li>
    </Fragment>
  ));

  const booksData = (
    <Fragment>
      {error && (
        <section className={classes.BooksError}>
          <p>{error}</p>
        </section>
      )}
      {deleteSuccess && <p className={classes.dltSuccess}>{deleteSuccess}</p>}
      {deleteError && <p className={classes.dltError}>{deleteError}</p>}
      <ul>{bookList}</ul>
    </Fragment>
  );

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
        {isModalShown && <AddMyBook onHideModal={hideModalHandler} />}
        <ShowAddBookButton onShowModal={showModalHandler} />
        {isBookEmpty && (
          <p className={classes.BooksError}>No books found add one..</p>
        )}
        {!isBookEmpty && booksData}
      </Card>
    </section>
  );
};

export default MyBooks;
