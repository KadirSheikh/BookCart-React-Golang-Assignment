import axios from "axios";
const ROOT_ROUTE = "http://localhost:8000/api";

// REQUESTS USING AXIOS

export async function getAllAvailableBooks() {
  const res = await axios(`${ROOT_ROUTE}/books/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });

  // console.log(res);

  const books = res.data.data;
  console.log(books);

  const loadedBooks = [];

  for (const key in books) {
    loadedBooks.push({
      id: books[key].id,
      name: books[key].title,
      description: books[key].description,
      author: books[key].author.name,
    });
  }

  console.log(loadedBooks);

  return loadedBooks;
}

export async function getAllAuthors() {
  const res = await axios(`${ROOT_ROUTE}/author/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });

  const authors = res.data.data;
 

  const loadedAuthors = [];

  for (const key in authors) {
    loadedAuthors.push({
      id: authors[key].id,
      name: authors[key].name,
      email: authors[key].email,
      books: authors[key].books,
      totalBooks: authors[key].books.length

    });
  }

 

  return loadedAuthors;


}

export async function getAuthorBooks(authorId) {
  const res = await axios(`${ROOT_ROUTE}/author/${authorId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });

  const authors = res.data.data;
  console.log(authors);

}

export async function authorProfile() {
  const response = await axios(`${ROOT_ROUTE}/author/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = response.data;

  return resData;
}

export async function addNewBook(bookData) {
  const response = await axios(`${ROOT_ROUTE}/books/`, {
    method: "POST",
    data: JSON.stringify(bookData),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = response.data;

  return resData;
}

export async function deleteBook(bookID) {
  const response = await axios(`${ROOT_ROUTE}/books/${bookID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.data;

  return resData;
}

export async function editProfile(authorData) {
  const response = await axios(`${ROOT_ROUTE}/author/profile`, {
    method: "PUT",
    data: JSON.stringify(authorData),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = response.data;

  return resData;
}

// REQUESTS USING FETCH

export async function loginAuthor(authorData) {
  const response = await fetch(`${ROOT_ROUTE}/auth/login`, {
    method: "POST",
    body: JSON.stringify(authorData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resData = await response.json();

  if (resData.status) {
    localStorage.setItem("token", resData.data.token);
    localStorage.setItem("isLoggedIn", "Y");
  }

  return resData;
}

export async function registerAuthor(authorData) {
  const response = await fetch(`${ROOT_ROUTE}/auth/register`, {
    method: "POST",
    body: JSON.stringify(authorData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resData = await response.json();

  if (resData.status) {
    localStorage.setItem("token", resData.data.token);
    localStorage.setItem("isLoggedIn", "Y");
  }

  return resData;
}

export async function getMyBooks() {
  const response = await fetch(`${ROOT_ROUTE}/author/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();

  const loadedBooks = [];

  for (const key in resData.data.books) {
    loadedBooks.push({
      id: resData.data.books[key].id,
      name: resData.data.books[key].title,
      description: resData.data.books[key].description,
      author: resData.data.books[key].author.name,
    });
  }

  return loadedBooks;
}

export async function getBookById(bookId) {
  const response = await fetch(`${ROOT_ROUTE}/books/${bookId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();

  return resData;
}

export async function editBook(bookData, bookId) {
  const response = await fetch(`${ROOT_ROUTE}/books/${bookId}`, {
    method: "PUT",
    body: JSON.stringify(bookData),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const resData = await response.json();

  return resData;
}
