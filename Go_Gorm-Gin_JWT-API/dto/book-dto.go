package dto

//BookUpdateDTO is a model that client use when updating a book.
type BookUpdateDTO struct {
	ID          uint64 `json:"id" form:"id" binding:"required"`
	Title       string `json:"title" form:"title" binding:"required"`
	Description string `json:"description" form:"description" binding:"required"`
	AuthorID    uint64 `json:"author_id,omitempty"  form:"author_id,omitempty"`
}

//BookCreateDTO is is a model that clinet use when create a new book.
type BookCreateDTO struct {
	Title       string `json:"title" form:"title" binding:"required"`
	Description string `json:"description" form:"description" binding:"required"`
	AuthorID    uint64 `json:"author_id,omitempty" form:"author_id,omitempty"`
}
