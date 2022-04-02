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
	CreateAuther(auther dto.RegisterDTO) modal.Auther
	FindByEmail(email string) modal.Auther
	IsDuplicateEmail(email string) bool
}

type authService struct {
	autherRepository repository.AutherRepository
}

//NewAuthService creates a new instance of AuthService.
func NewAuthService(autherRep repository.AutherRepository) AuthService {
	return &authService{
		autherRepository: autherRep,
	}
}

func (service *authService) VerifyCredential(email string, password string) interface{} {
	res := service.autherRepository.VerifyCredential(email, password)
	if v, ok := res.(modal.Auther); ok {
		comparedPassword := comparePassword(v.Password, []byte(password))
		if v.Email == email && comparedPassword {
			return res
		}
		return false
	}
	return false
}

func (service *authService) CreateAuther(auther dto.RegisterDTO) modal.Auther {
	autherToCreate := modal.Auther{}
	err := smapping.FillStruct(&autherToCreate, smapping.MapFields(&auther))
	if err != nil {
		log.Fatalf("Failed map %v", err)
	}
	res := service.autherRepository.InsertAuther(autherToCreate)
	return res
}

func (service *authService) FindByEmail(email string) modal.Auther {
	return service.autherRepository.FindByEmail(email)
}

func (service *authService) IsDuplicateEmail(email string) bool {
	res := service.autherRepository.IsDuplicateEmail(email)
	return !(res.Error == nil)
}

// compare plain password provided by auther with hashed password from db
func comparePassword(hashedPwd string, plainPassword []byte) bool {
	byteHash := []byte(hashedPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, plainPassword)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}
