package service

import (
	"log"

	"gin_gorm_jwt/dto"
	"gin_gorm_jwt/modal"
	"gin_gorm_jwt/repository"

	"github.com/mashingan/smapping"
	"golang.org/x/crypto/bcrypt"
)

//AuthService is a contract about something that this service can do
type AuthService interface {
	VerifyCredential(email string, password string) interface{}
	CreateAuthor(author dto.RegisterDTO) modal.Author
	FindByEmail(email string) modal.Author
	IsDuplicateEmail(email string) bool
}

type authService struct {
	authorRepository repository.AuthorRepository
}

//NewAuthService creates a new instance of AuthService.
func NewAuthService(authorRep repository.AuthorRepository) AuthService {
	return &authService{
		authorRepository: authorRep,
	}
}

func (service *authService) VerifyCredential(email string, password string) interface{} {
	res := service.authorRepository.VerifyCredential(email, password)
	if v, ok := res.(modal.Author); ok {
		comparedPassword := comparePassword(v.Password, []byte(password))
		if v.Email == email && comparedPassword {
			return res
		}
		return false
	}
	return false
}

func (service *authService) CreateAuthor(author dto.RegisterDTO) modal.Author {
	authorToCreate := modal.Author{}
	err := smapping.FillStruct(&authorToCreate, smapping.MapFields(&author))
	if err != nil {
		log.Fatalf("Failed map %v", err)
	}
	res := service.authorRepository.InsertAuthor(authorToCreate)
	return res
}

func (service *authService) FindByEmail(email string) modal.Author {
	return service.authorRepository.FindByEmail(email)
}

func (service *authService) IsDuplicateEmail(email string) bool {
	res := service.authorRepository.IsDuplicateEmail(email)
	return !(res.Error == nil)
}

// compare plain password provided by author with hashed password from db
func comparePassword(hashedPwd string, plainPassword []byte) bool {
	byteHash := []byte(hashedPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, plainPassword)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}
