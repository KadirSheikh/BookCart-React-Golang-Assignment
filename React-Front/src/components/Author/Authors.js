import { useEffect, useState } from "react";
import classes from "./Authors.module.css";
import Card from "../UI/Card";
import { getAllAuthors } from "../../lib/api";
import { Fragment } from "react/cjs/react.production.min";
import SingleAuthor from "../Author/SingleAuthor"
import { useNavigate, useSearchParams } from "react-router-dom";


const sortAuthors = (books, ascending) => {
  return books.sort((bookA, bookB) => {
    if (ascending) {
      return bookA.id > bookB.id ? 1 : -1;
    } else {
      return bookA.id < bookB.id ? 1 : -1;
    }
  });
};

const Authors = () => {
  const [authors, setAuthor] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [isAuthorEmpty, setIsAuthorEmpty] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("")
  let navigate = useNavigate();

  useEffect(() => {
    getAllAuthors()
      .then((data) => {
        ;
        if (data.length !== 0) {
          setAuthor(data);
          setIsAuthorEmpty(false);
        } else {
          setIsAuthorEmpty(true);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }, []);

  const isSortingAscending = searchParams.get("sort") === "asc";
  const sortedAuthors = sortAuthors(authors, isSortingAscending);

  const changeSortingHandler = () => {
    navigate("/authors?sort=" + (isSortingAscending ? "desc" : "asc"));
  };

  if (isLoading) {
    return (
      <section className={classes.AuthorLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  const authorList = sortedAuthors.filter(book => book.name.match(new RegExp(searchValue, "i"))).map((author) => (
    <SingleAuthor
      key={author.id}
      id={author.id}
      name={author.name}
      email={author.email}
      books={author.books}
      totalBooks={author.totalBooks}
    />
  ));

  const authorsData = <Fragment>
    {error && (
      <section className={classes.AuthorError}>
        <p>{error}</p>
      </section>
    )}
    <ul>{authorList}</ul>
  </Fragment>

  const sortingNSearch = <div className={classes.sorting}>
    <button onClick={changeSortingHandler}>
      Sort {isSortingAscending ? "Descending" : "Ascending"}
    </button>

    <input
      type="text"
      name="search"
      value={searchValue}
      className={classes.searchAuthor}
      placeholder="Search Author..."
      onChange={e => setSearchValue(e.target.value)}
    />
  </div>

  return (
    <section className={classes.authors}>
      <Card>
        {sortingNSearch}
        {isAuthorEmpty && (
          <p className={classes.AuthorError}>No authors found.</p>
        )}
        {!isAuthorEmpty && authorsData}
      </Card>
    </section>
  );
};

export default Authors;
