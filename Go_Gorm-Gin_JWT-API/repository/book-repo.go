package repository

import (
	"gin_gorm_jwt/modal"

	"gorm.io/gorm"
)

//BookRepository is contract what bookRepository can do to db.
type BookRepository interface {
	InsertBook(b modal.Book) modal.Book
	UpdateBook(b modal.Book) modal.Book
	DeleteBook(b modal.Book)
	AllBook() []modal.Book
	FindBookByID(bookID uint64) modal.Book
}

type bookConnection struct {
	connection *gorm.DB
}

//NewBookRepository creates an instance BookRepository
func NewBookRepository(dbConn *gorm.DB) BookRepository {
	return &bookConnection{
		connection: dbConn,
	}
}

//insert new Book
func (db *bookConnection) InsertBook(b modal.Book) modal.Book {
	db.connection.Save(&b)
	db.connection.Preload("Auther").Find(&b)
	return b
}

//update existing Book
func (db *bookConnection) UpdateBook(b modal.Book) modal.Book {
	db.connection.Save(&b)
	db.connection.Preload("Auther").Find(&b)
	return b
}

//delete book
func (db *bookConnection) DeleteBook(b modal.Book) {
	db.connection.Delete(&b)
}

// find a book by its id
func (db *bookConnection) FindBookByID(bookID uint64) modal.Book {
	var book modal.Book
	db.connection.Preload("Auther").Find(&book, bookID)
	return book
}

//get all books from book table
func (db *bookConnection) AllBook() []modal.Book {
	var books []modal.Book
	db.connection.Preload("Auther").Find(&books)
	return books
}
