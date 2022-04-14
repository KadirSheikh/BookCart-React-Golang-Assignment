package repository

import (
	"log"

	"gin_gorm_jwt/modal"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

//AuthorRepository is contract what authorRepository can do to db.
type AuthorRepository interface {
	InsertAuthor(author modal.Author) modal.Author
	UpdateAuthor(author modal.Author) modal.Author
	VerifyCredential(email string, password string) interface{}
	IsDuplicateEmail(email string) (tx *gorm.DB)
	FindByEmail(email string) modal.Author
	ProfileAuthor(authorID string) modal.Author
	GetAuthor(authorID uint64) modal.Author
	AllAuthors() []modal.Author
}

type authorConnection struct {
	connection *gorm.DB
}

//NewAuthorRepository is creates a new instance of AuthorRepository
func NewAuthorRepository(db *gorm.DB) AuthorRepository {
	return &authorConnection{
		connection: db,
	}
}

//insert new author
func (db *authorConnection) InsertAuthor(author modal.Author) modal.Author {
	author.Password = hashAndSalt([]byte(author.Password))
	db.connection.Save(&author)
	return author
}

//update author
func (db *authorConnection) UpdateAuthor(author modal.Author) modal.Author {
	if author.Password != "" {
		author.Password = hashAndSalt([]byte(author.Password))
	} else {
		var tempAuthor modal.Author
		db.connection.Find(&tempAuthor, author.ID)
		author.Password = tempAuthor.Password
	}

	db.connection.Save(&author)
	return author
}

// verify author creds
func (db *authorConnection) VerifyCredential(email string, password string) interface{} {
	var author modal.Author
	res := db.connection.Where("email = ?", email).Take(&author)
	// SELECT * FROM authors WHERE email=email LIMIT 1;

	if res.Error == nil {
		return author
	}
	return nil
}

// check if duplicate email exists
func (db *authorConnection) IsDuplicateEmail(email string) (tx *gorm.DB) {
	var author modal.Author
	return db.connection.Where("email = ?", email).Take(&author)
}

// find author by email
func (db *authorConnection) FindByEmail(email string) modal.Author {
	var author modal.Author
	db.connection.Where("email = ?", email).Take(&author)
	return author
}

// get author profile
func (db *authorConnection) ProfileAuthor(authorID string) modal.Author {
	var author modal.Author
	db.connection.Preload("Books").Preload("Books.Author").Find(&author, authorID)
	//select * from author where id = authorID
	return author
}

func (db *authorConnection) GetAuthor(authorID uint64) modal.Author {
	var author modal.Author
	db.connection.Preload("Books.Author").Find(&author, authorID)
	return author
}

// password hashing
func hashAndSalt(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
		panic("Failed to hash a password")
	}
	return string(hash)
}

func (db *authorConnection) AllAuthors() []modal.Author {
	var authors []modal.Author
	db.connection.Preload("Books.Author").Find(&authors)
	return authors
}
