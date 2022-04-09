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

type BookController interface {
	All(context *gin.Context)
	FindByID(context *gin.Context)
	Insert(context *gin.Context)
	Update(context *gin.Context)
	Delete(context *gin.Context)
}

type bookController struct {
	bookService service.BookService
	jwtService  service.JWTService
}

//NewBookController create a new instances of BoookController
func NewBookController(bookServ service.BookService, jwtServ service.JWTService) BookController {
	return &bookController{
		bookService: bookServ,
		jwtService:  jwtServ,
	}
}

func (c *bookController) All(context *gin.Context) {
	var books []modal.Book = c.bookService.All()
	res := helper.BuildSuccessResponse(true, "OK", books)
	context.JSON(http.StatusOK, res)
}

func (c *bookController) FindByID(context *gin.Context) {
	id, err := strconv.ParseUint(context.Param("id"), 0, 0)
	if err != nil {
		res := helper.BuildErrorResponse("No param id was found", err.Error(), helper.EmptyObj{})
		context.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	var book modal.Book = c.bookService.FindByID(id)
	if (book == modal.Book{}) {
		res := helper.BuildErrorResponse("Data not found", "No data with given id", helper.EmptyObj{})
		context.JSON(http.StatusNotFound, res)
	} else {
		res := helper.BuildSuccessResponse(true, "OK", book)
		context.JSON(http.StatusOK, res)
	}
}

func (c *bookController) Insert(context *gin.Context) {
	var bookCreateDTO dto.BookCreateDTO
	errDTO := context.ShouldBind(&bookCreateDTO)
	if errDTO != nil {
		res := helper.BuildErrorResponse("Failed to process request", errDTO.Error(), helper.EmptyObj{})
		context.JSON(http.StatusBadRequest, res)
	} else {
		authHeader := context.GetHeader("Authorization")
		authorID := c.getAuthorIDByToken(authHeader)
		convertedAuthorID, err := strconv.ParseUint(authorID, 10, 64)
		if err == nil {
			bookCreateDTO.AuthorID = convertedAuthorID
		}
		result := c.bookService.Insert(bookCreateDTO)
		response := helper.BuildSuccessResponse(true, "Book added successfully!", result)
		context.JSON(http.StatusCreated, response)
	}
}

func (c *bookController) Update(context *gin.Context) {
	var bookUpdateDTO dto.BookUpdateDTO
	bid, err := strconv.ParseUint(context.Param("id"), 0, 0)
	if err != nil {
		response := helper.BuildErrorResponse("Failed tou get id", "No param id were found", helper.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	bookUpdateDTO.ID = bid
	errDTO := context.ShouldBind(&bookUpdateDTO)
	if errDTO != nil {
		res := helper.BuildErrorResponse("Failed to process request", errDTO.Error(), helper.EmptyObj{})
		context.JSON(http.StatusBadRequest, res)
		return
	}

	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	authorID := fmt.Sprintf("%v", claims["author_id"])

	if c.bookService.IsAllowedToEdit(authorID, bookUpdateDTO.ID) {
		id, errID := strconv.ParseUint(authorID, 10, 64)
		if errID == nil {
			bookUpdateDTO.AuthorID = id

		}
		result := c.bookService.Update(bookUpdateDTO)
		response := helper.BuildSuccessResponse(true, "Book edited successfully!", result)
		context.JSON(http.StatusOK, response)
	} else {
		response := helper.BuildErrorResponse("You don't have permission", "You are not the owner", helper.EmptyObj{})
		context.JSON(http.StatusForbidden, response)
	}
}

func (c *bookController) Delete(context *gin.Context) {
	var book modal.Book
	id, err := strconv.ParseUint(context.Param("id"), 0, 0)
	if err != nil {
		response := helper.BuildErrorResponse("Failed tou get id", "No param id were found", helper.EmptyObj{})
		context.JSON(http.StatusBadRequest, response)
	}
	book.ID = id
	authHeader := context.GetHeader("Authorization")
	token, errToken := c.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	authorID := fmt.Sprintf("%v", claims["author_id"])
	if c.bookService.IsAllowedToEdit(authorID, book.ID) {
		c.bookService.Delete(book)
		res := helper.BuildSuccessResponse(true, "Book deleted successfully!", helper.EmptyObj{})
		context.JSON(http.StatusOK, res)
	} else {
		response := helper.BuildErrorResponse("You don't have permission", "You are not the owner", helper.EmptyObj{})
		context.JSON(http.StatusForbidden, response)
	}
}

func (c *bookController) getAuthorIDByToken(token string) string {
	aToken, err := c.jwtService.ValidateToken(token)
	if err != nil {
		panic(err.Error())
	}
	claims := aToken.Claims.(jwt.MapClaims)
	id := fmt.Sprintf("%v", claims["author_id"])
	return id
}
