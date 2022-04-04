import { React, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import classes from "./Profile.module.css";
import Modal from "../UI/Modal";
import { autherProfile } from "../../lib/api";

const Profile = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [books, setBooks] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchProfile() {
      const resData = await autherProfile();
      console.log(resData);
      if (resData.status) {
        setName(resData.data.name);
        setEmail(resData.data.email);
        const twoBooks = resData.data.books.slice(0, 2);
        setBooks(twoBooks);
      }
    }

    fetchProfile();
  }, []);

  const logOutHandler = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 500);
  };

  const myBookList = books.map((book) => (
    <li className={classes.Book} key={book.id}>
      <div>
        <div className={classes.title}>{book.title}</div>
        <div className={classes.description}>
          {book.description.substring(0, 50)}...
        </div>
      </div>
    </li>
  ));

  return (
    <Modal onClose={props.onHideProfile}>
      <div>
        <h3>Name:</h3>
        {name}
        <h3>Email:</h3>
        {email}
      </div>
      <div>
        <h3>Books:</h3>
        <ul>{myBookList}</ul>
      </div>
      <div className={classes.actions}>
        <Link
          className={classes.viewAll}
          to="/mybooks"
          onClick={props.onHideProfile}
        >
          View All
        </Link>
      </div>
      <br></br>
      <div className={classes.actions}>
        <button className={classes.button} onClick={logOutHandler}>
          Logout
        </button>
        <button className={classes.button} onClick={props.onHideProfile}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default Profile;
