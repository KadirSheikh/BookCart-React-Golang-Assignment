package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/gorm"

	"gin_gorm_jwt/config"
	"gin_gorm_jwt/controller"
	"gin_gorm_jwt/middleware"
	"gin_gorm_jwt/repository"
	"gin_gorm_jwt/service"
)

var (
	db         *gorm.DB           = config.SetupDBConnection()
	jwtService service.JWTService = service.NewJWTService()

	autherRepository repository.AutherRepository = repository.NewAutherRepository(db)
	autherService    service.AutherService       = service.NewAutherService(autherRepository)
	autherController controller.AutherController = controller.NewAutherController(autherService, jwtService)

	bookRepository repository.BookRepository = repository.NewBookRepository(db)
	bookService    service.BookService       = service.NewBookService(bookRepository)
	bookController controller.BookController = controller.NewBookController(bookService, jwtService)

	authService    service.AuthService       = service.NewAuthService(autherRepository)
	authController controller.AuthController = controller.NewAuthController(authService, jwtService)
)

func main() {

	//closing db connection
	defer config.CloseDBConnection(db)
	// CORSMiddleware()
	//root route
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"data": "Root route...!",
		})
	})

	// auther login register route group
	authRoutes := r.Group("api/auth")
	// authRoutes := r.Group("api/auth", middleware.AuthorizeJWT(jwtService))
	{
		authRoutes.POST("/login", authController.Login)
		authRoutes.POST("/register", authController.Register)
	}

	//auther get profile and update profile route group
	autherRoutes := r.Group("api/auther", middleware.CORSMiddleware(), middleware.AuthorizeJWT(jwtService))
	{
		autherRoutes.GET("/profile", autherController.Profile)
		autherRoutes.PUT("/profile", autherController.Update)
	}

	//book CRUD operation route group
	// bookRoutes := r.Group("api/books", middleware.AuthorizeJWT(jwtService))
	bookRoutes := r.Group("api/books", middleware.CORSMiddleware())
	{
		bookRoutes.GET("/", bookController.All)
		bookRoutes.POST("/", bookController.Insert)
		bookRoutes.GET("/:id", bookController.FindByID)
		bookRoutes.PUT("/:id", bookController.Update)
		bookRoutes.DELETE("/:id", bookController.Delete)
	}

	errEnv := godotenv.Load()
	if errEnv != nil {
		panic("Failed to load .env")
	}

	PORT := os.Getenv("PORT") //running on port 8000

	r.Run(PORT)
}
