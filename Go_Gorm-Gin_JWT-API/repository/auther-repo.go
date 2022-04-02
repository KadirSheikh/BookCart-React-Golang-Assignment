package repository

import (
	"log"

	"gin_gorm_jwt/modal"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

//AutherRepository is contract what autherRepository can do to db.
type AutherRepository interface {
	InsertAuther(auther modal.Auther) modal.Auther
	UpdateAuther(auther modal.Auther) modal.Auther
	VerifyCredential(email string, password string) interface{}
	IsDuplicateEmail(email string) (tx *gorm.DB)
	FindByEmail(email string) modal.Auther
	ProfileAuther(autherID string) modal.Auther
	AllAuthers() []modal.Auther
}

type autherConnection struct {
	connection *gorm.DB
}

//NewAutherRepository is creates a new instance of AutherRepository
func NewAutherRepository(db *gorm.DB) AutherRepository {
	return &autherConnection{
		connection: db,
	}
}

//insert new auther
func (db *autherConnection) InsertAuther(auther modal.Auther) modal.Auther {
	auther.Password = hashAndSalt([]byte(auther.Password))
	db.connection.Save(&auther)
	return auther
}

//update auther
func (db *autherConnection) UpdateAuther(auther modal.Auther) modal.Auther {
	if auther.Password != "" {
		auther.Password = hashAndSalt([]byte(auther.Password))
	} else {
		var tempAuther modal.Auther
		db.connection.Find(&tempAuther, auther.ID)
		auther.Password = tempAuther.Password
	}

	db.connection.Save(&auther)
	return auther
}

// verify auther creds
func (db *autherConnection) VerifyCredential(email string, password string) interface{} {
	var auther modal.Auther
	res := db.connection.Where("email = ?", email).Take(&auther)
	if res.Error == nil {
		return auther
	}
	return nil
}

// check if duplicate email exists
func (db *autherConnection) IsDuplicateEmail(email string) (tx *gorm.DB) {
	var auther modal.Auther
	return db.connection.Where("email = ?", email).Take(&auther)
}

// find auther by email
func (db *autherConnection) FindByEmail(email string) modal.Auther {
	var auther modal.Auther
	db.connection.Where("email = ?", email).Take(&auther)
	return auther
}

// get auther profile
func (db *autherConnection) ProfileAuther(autherID string) modal.Auther {
	var auther modal.Auther
	db.connection.Preload("Books").Preload("Books.Auther").Find(&auther, autherID)
	return auther
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

func (db *autherConnection) AllAuthers() []modal.Auther {
	var authers []modal.Auther
	db.connection.Preload("Auther").Find(&authers)
	return authers
}
