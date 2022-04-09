package service

import (
	"log"

	"gin_gorm_jwt/dto"
	"gin_gorm_jwt/modal"
	"gin_gorm_jwt/repository"

	"github.com/mashingan/smapping"
)

type AuthorService interface {
	Update(author dto.AuthorUpdateDTO) modal.Author
	All() []modal.Author
	Profile(authorID string) modal.Author
}

type authorService struct {
	authorRepository repository.AuthorRepository
}

//NewAuthorService creates a new instance of AuthorService.
func NewAuthorService(authorRepo repository.AuthorRepository) AuthorService {
	return &authorService{
		authorRepository: authorRepo,
	}
}

func (service *authorService) Update(author dto.AuthorUpdateDTO) modal.Author {
	authorToUpdate := modal.Author{}
	err := smapping.FillStruct(&authorToUpdate, smapping.MapFields(&author))
	if err != nil {
		log.Fatalf("Failed map %v:", err)
	}
	updatedAuthor := service.authorRepository.UpdateAuthor(authorToUpdate)
	return updatedAuthor
}

func (service *authorService) All() []modal.Author {
	return service.authorRepository.AllAuthors()
}

func (service *authorService) Profile(authorID string) modal.Author {
	return service.authorRepository.ProfileAuthor(authorID)
}
