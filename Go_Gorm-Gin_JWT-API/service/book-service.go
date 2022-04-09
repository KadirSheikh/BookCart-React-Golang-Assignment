package service

import (
	"fmt"
	"log"

	"gin_gorm_jwt/dto"
	"gin_gorm_jwt/modal"
	"gin_gorm_jwt/repository"

	"github.com/mashingan/smapping"
)

type BookService interface {
	Insert(b dto.BookCreateDTO) modal.Book
	Update(b dto.BookUpdateDTO) modal.Book
	Delete(b modal.Book)
	All() []modal.Book
	FindByID(bookID uint64) modal.Book
	IsAllowedToEdit(authorID string, bookID uint64) bool
}

type bookService struct {
	bookRepository repository.BookRepository
}

//NewBookService creates a new instance of BookService.
func NewBookService(bookRepo repository.BookRepository) BookService {
	return &bookService{
		bookRepository: bookRepo,
	}
}

func (service *bookService) Insert(b dto.BookCreateDTO) modal.Book {
	book := modal.Book{}
	err := smapping.FillStruct(&book, smapping.MapFields(&b))
	if err != nil {
		log.Fatalf("Failed map %v: ", err)
	}
	res := service.bookRepository.InsertBook(book)
	return res
}

func (service *bookService) Update(b dto.BookUpdateDTO) modal.Book {
	book := modal.Book{}
	err := smapping.FillStruct(&book, smapping.MapFields(&b))
	if err != nil {
		log.Fatalf("Failed map %v: ", err)
	}
	res := service.bookRepository.UpdateBook(book)
	return res
}

func (service *bookService) Delete(b modal.Book) {
	service.bookRepository.DeleteBook(b)
}

func (service *bookService) All() []modal.Book {
	return service.bookRepository.AllBook()
}

func (service *bookService) FindByID(bookID uint64) modal.Book {
	return service.bookRepository.FindBookByID(bookID)
}

func (service *bookService) IsAllowedToEdit(authorID string, bookID uint64) bool {
	b := service.bookRepository.FindBookByID(bookID)
	id := fmt.Sprintf("%v", b.AuthorID)
	return authorID == id
}
