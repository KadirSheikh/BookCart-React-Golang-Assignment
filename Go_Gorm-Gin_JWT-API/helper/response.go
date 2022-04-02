package helper

import "strings"

type Response struct {
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Errors  interface{} `json:"errors"`
	Data    interface{} `json:"data"`
}

//EmptyObj object is used when data is null
type EmptyObj struct{}

//this method is to inject data value to dynamic success response
func BuildSuccessResponse(status bool, message string, data interface{}) Response {
	res := Response{
		Status:  status,
		Message: message,
		Errors:  nil,
		Data:    data,
	}
	return res
}

//this method is to inject data value to dynamic failed response
func BuildErrorResponse(message string, err string, data interface{}) Response {
	errVal := strings.Split(err, "\n")
	res := Response{
		Status:  false,
		Message: message,
		Errors:  errVal,
		Data:    data,
	}
	return res
}
