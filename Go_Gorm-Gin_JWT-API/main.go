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

	authorRepository repository.AuthorRepository = repository.NewAuthorRepository(db)
	authorService    service.AuthorService       = service.NewAuthorService(authorRepository)
	authorController controller.AuthorController = controller.NewAuthorController(authorService, jwtService)

	bookRepository repository.BookRepository = repository.NewBookRepository(db)
	bookService    service.BookService       = service.NewBookService(bookRepository)
	bookController controller.BookController = controller.NewBookController(bookService, jwtService)

	authService    service.AuthService       = service.NewAuthService(authorRepository)
	authController controller.AuthController = controller.NewAuthController(authService, jwtService)
)

func main() {

	//closing db connection
	defer config.CloseDBConnection(db)

	r := gin.Default()

	// allowing cors and headers
	r.Use(middleware.CORS)

	//root route
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"data": "Root route...!",
		})
	})

	// author login and register route group
	authRoutes := r.Group("api/auth")
	{
		authRoutes.POST("/login", authController.Login)
		authRoutes.POST("/register", authController.Register)
	}

	//author get profile, get all authors and update profile route group
	authorRoutes := r.Group("api/author", middleware.AuthorizeJWT(jwtService))
	{
		authorRoutes.GET("/getAll", authorController.GetAll)
		authorRoutes.GET("/profile", authorController.Profile)
		authorRoutes.PUT("/profile", authorController.Update)
	}

	//book CRUD operation route group
	bookRoutes := r.Group("api/books", middleware.AuthorizeJWT(jwtService))
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
