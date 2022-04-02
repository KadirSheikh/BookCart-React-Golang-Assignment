package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"gin_gorm_jwt/dto"
	"gin_gorm_jwt/helper"
	"gin_gorm_jwt/service"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type AutherController interface {
	Update(context *gin.Context)
	Profile(context *gin.Context)
}

type autherController struct {
	autherService service.AutherService
	jwtService    service.JWTService
}

//NewAutherController is creating anew instance of AutherControlller
func NewAutherController(autherService service.AutherService, jwtService service.JWTService) AutherController {
	return &autherController{
		autherService: autherService,
		jwtService:    jwtService,
	}
}

func (c *autherController) Update(context *gin.Context) {
	var autherUpdateDTO dto.AutherUpdateDTO
	errDTO := context.ShouldBind(&autherUpdateDTO)
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
	id, err := strconv.ParseUint(fmt.Sprintf("%v", claims["auther_id"]), 10, 64)
	if err != nil {
		panic(err.Error())
	}
	autherUpdateDTO.ID = id
	u := c.autherService.Update(autherUpdateDTO)
	res := helper.BuildSuccessResponse(true, "OK!", u)
	context.JSON(http.StatusOK, res)
}

func (c *autherController) Profile(context *gin.Context) {
	authHeader := context.GetHeader("Authorization")
	token, err := c.jwtService.ValidateToken(authHeader)
	if err != nil {
		panic(err.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	id := fmt.Sprintf("%v", claims["auther_id"])
	auther := c.autherService.Profile(id)
	res := helper.BuildSuccessResponse(true, "OK", auther)
	context.JSON(http.StatusOK, res)

}
