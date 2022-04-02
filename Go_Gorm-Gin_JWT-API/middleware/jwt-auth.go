package middleware

import (
	"log"
	"net/http"

	"gin_gorm_jwt/helper"
	"gin_gorm_jwt/service"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

//this function is used to validates the token auther given and also used to extract auther id from the token, return 401 if not valid
func AuthorizeJWT(jwtService service.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response := helper.BuildErrorResponse("Failed to process request", "No token found", nil)
			c.AbortWithStatusJSON(http.StatusBadRequest, response)
			return
		}
		token, err := jwtService.ValidateToken(authHeader)
		if token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			log.Println("Claim[auther_id]: ", claims["auther_id"])
			log.Println("Claim[issuer] :", claims["issuer"])
		} else {
			log.Println(err)
			response := helper.BuildErrorResponse("Token is not valid", err.Error(), nil)
			c.AbortWithStatusJSON(http.StatusUnauthorized, response)
		}
	}
}
