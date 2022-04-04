import { useEffect, useState, Fragment } from "react";
import classes from "./MyBooks.module.css";
import Card from "../UI/Card";
import { getMyBooks, deleteBook } from "../../lib/api";
import AddMyBook from "../Book/AddMyBook";
import ShowAddBookButton from "../Layout/ShowAddBookButton";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [isProfileShown, setIsProfileShown] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

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

  const deleteBookById = (event) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure want to delete this book.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const res = await deleteBook(event.target.id);

            console.log(res);
            if (res.status) {
              setDeleteSuccess(res.message);
            } else {
              setDeleteError(res.message);
            }

            setTimeout(() => {
              window.location.reload();
            }, 500);
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

  const bookList = books.map((book) => (
    <Fragment key={book.id}>
      <button className={classes.editBtn}>Edit</button>
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
        {deleteSuccess && <p className={classes.dltSuccess}>{deleteSuccess}</p>}
        {deleteError && <p className={classes.dltError}>{deleteError}</p>}
        <ul>{bookList}</ul>
      </Card>
    </section>
  );
};

export default MyBooks;
