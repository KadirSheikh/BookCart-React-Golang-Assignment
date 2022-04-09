import { useEffect, useState } from "react";
import classes from "./Authors.module.css";
import Card from "../UI/Card";
import { getAllAuthors } from "../../lib/api";
import { Fragment } from "react/cjs/react.production.min";
import SingleAuthor from "../Author/SingleAuthor"

const Authors = () => {
  const [authors, setAuthor] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [isAuthorEmpty, setIsAuthorEmpty] = useState(false);

  useEffect(() => {
    getAllAuthors()
      .then((data) => {
        console.log(data);
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

  if (isLoading) {
    return (
      <section className={classes.AuthorLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  const authorList = authors.map((author) => (
    <SingleAuthor
      key={author.id}
      id={author.id}
      name={author.name}
      email={author.email}
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

  return (
    <section className={classes.authors}>
      <Card>
        {isAuthorEmpty && (
          <p className={classes.AuthorError}>No authors found.</p>
        )}
        {!isAuthorEmpty && authorsData}
      </Card>
    </section>
  );
};

export default Authors;
