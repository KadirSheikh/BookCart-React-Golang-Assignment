package modal

//this is book modal AuthorId as foreignkey
type Book struct {
	ID          uint64 `gorm:"primary_key:auto_increment" json:"id"`
	Title       string `gorm:"type:varchar(255)" json:"title"`
	Description string `gorm:"type:text" json:"description"`
	AuthorID    uint64 `gorm:"not null" json:"-"`
	Author      Author `gorm:"foreignkey:AuthorID;constraint:onUpdate:CASCADE,onDelete:CASCADE" json:"author"`
}
