package service

import (
	"log"

	"gin_gorm_jwt/dto"
	"gin_gorm_jwt/modal"
	"gin_gorm_jwt/repository"

	"github.com/mashingan/smapping"
)

type AutherService interface {
	Update(auther dto.AutherUpdateDTO) modal.Auther
	Profile(autherID string) modal.Auther
}

type autherService struct {
	autherRepository repository.AutherRepository
}

//NewAutherService creates a new instance of AutherService.
func NewAutherService(autherRepo repository.AutherRepository) AutherService {
	return &autherService{
		autherRepository: autherRepo,
	}
}

func (service *autherService) Update(auther dto.AutherUpdateDTO) modal.Auther {
	autherToUpdate := modal.Auther{}
	err := smapping.FillStruct(&autherToUpdate, smapping.MapFields(&auther))
	if err != nil {
		log.Fatalf("Failed map %v:", err)
	}
	updatedAuther := service.autherRepository.UpdateAuther(autherToUpdate)
	return updatedAuther
}

func (service *autherService) Profile(autherID string) modal.Auther {
	return service.autherRepository.ProfileAuther(autherID)
}
