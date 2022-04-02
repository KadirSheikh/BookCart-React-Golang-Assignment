package modal

//this is book modal AutherId as foreignkey
type Book struct {
	ID          uint64 `gorm:"primary_key:auto_increment" json:"id"`
	Title       string `gorm:"type:varchar(255)" json:"title"`
	Description string `gorm:"type:text" json:"description"`
	AutherID    uint64 `gorm:"not null" json:"-"`
	Auther      Auther `gorm:"foreignkey:AutherID;constraint:onUpdate:CASCADE,onDelete:CASCADE" json:"auther"`
}
