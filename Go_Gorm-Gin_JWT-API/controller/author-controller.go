package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"gin_gorm_jwt/dto"
	"gin_gorm_jwt/helper"
	"gin_gorm_jwt/modal"
	"gin_gorm_jwt/service"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type AuthorController interface {
	Update(context *gin.Context)
	GetAll(context *gin.Context)
	Profile(context *gin.Context)
	Get(context *gin.Context)
}

type authorController struct {
	authorService service.AuthorService
	jwtService    service.JWTService
}

//NewAuthorController is creating a new instance of AuthorControlller
func NewAuthorController(authorService service.AuthorService, jwtService service.JWTService) AuthorController {
	return &authorController{
		authorService: authorService,
		jwtService:    jwtService,
	}
}

func (c *authorController) Update(context *gin.Context) {
	var authorUpdateDTO dto.AuthorUpdateDTO
	errDTO := context.ShouldBind(&authorUpdateDTO)
	if errDTO != nil {
		res := helper.BuildErrorResponse("Failed to process request", errDTO.Error(), helper.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	id, err := strconv.ParseUint(fmt.Sprintf("%v", claims["author_id"]), 10, 64)
	if err != nil {
		panic(err.Error())
	}
	authorUpdateDTO.ID = id
	u := c.authorService.Update(authorUpdateDTO)
	res := helper.BuildSuccessResponse(true, "Profile update successfully!", u)
	context.JSON(http.StatusOK, res)
}

func (c *authorController) GetAll(context *gin.Context) {
	var authors []modal.Author = c.authorService.All()
	res := helper.BuildSuccessResponse(true, "OK", authors)
	context.JSON(http.StatusOK, res)
}

func (c *authorController) Profile(context *gin.Context) {
	authHeader := context.GetHeader("Authorization")
	token, err := c.jwtService.ValidateToken(authHeader)
	if err != nil {
		panic(err.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	id := fmt.Sprintf("%v", claims["author_id"])
	author := c.authorService.Profile(id)
	res := helper.BuildSuccessResponse(true, "OK", author)
	context.JSON(http.StatusOK, res)

}

func (c *authorController) Get(context *gin.Context) {
	id, err := strconv.ParseUint(context.Param("id"), 0, 0)
	if err != nil {
		res := helper.BuildErrorResponse("No param id was found", err.Error(), helper.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	author := c.authorService.GetById(id)
	res := helper.BuildSuccessResponse(true, "OK", author)
	context.JSON(http.StatusOK, res)

}
