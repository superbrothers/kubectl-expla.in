package util

import (
	"fmt"
	"net/http"

	"github.com/Sirupsen/logrus"
	"github.com/coreos/pkg/httputil"
)

func WriteJSONResponse(w http.ResponseWriter, code int, resp interface{}) {
	if err := httputil.WriteJSONResponse(w, code, resp); err != nil {
		logrus.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "internal server error")
	}
}
