package v1

import (
	"net/http"

	"github.com/gorilla/mux"
	apiutil "github.com/superbrothers/kubectl-expla.in/api/util"
	"github.com/superbrothers/kubectl-expla.in/kubectl"
)

type Explain struct {
	Documentation string `json:"documentation"`
}

func GetExplainHelpHandler(w http.ResponseWriter, r *http.Request) {
	arg := &kubectl.ExplainArg{Help: true}
	var code int
	var resp interface{}
	if out, err := kubectl.Explain(arg); err != nil {
		code = http.StatusInternalServerError
		resp = &Error{Message: string(out)}
	} else {
		code = http.StatusOK
		resp = &Explain{Documentation: string(out)}
	}
	apiutil.WriteJSONResponse(w, code, resp)
}

func GetExplainHandler(w http.ResponseWriter, r *http.Request) {
	resource := mux.Vars(r)["resource"]
	recursive := false
	if r.URL.Query().Get("recursive") == "1" {
		recursive = true
	}

	arg := &kubectl.ExplainArg{Resource: resource, Recursive: recursive}
	var code int
	var resp interface{}
	if out, err := kubectl.Explain(arg); err != nil {
		code = http.StatusNotFound
		resp = &Error{Message: string(out)}
	} else {
		code = http.StatusOK
		resp = &Explain{Documentation: string(out)}
	}
	apiutil.WriteJSONResponse(w, code, resp)
}
