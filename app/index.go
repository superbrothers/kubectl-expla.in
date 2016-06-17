package app

import (
	"bytes"
	"html/template"
	"net/http"

	"github.com/Sirupsen/logrus"
)

func GetIndexHandlerFunc(temp, trackingId string) http.HandlerFunc {
	t, err := template.ParseFiles(temp)
	if err != nil {
		logrus.Fatalf("%v", err)
	}
	logrus.Debugf("use %s as template for /index.html", temp)

	b := new(bytes.Buffer)
	err = t.Execute(b, struct {
		TrackingId string
	}{
		TrackingId: trackingId,
	})
	if err != nil {
		logrus.Fatalf("%v", err)
	}

	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		w.WriteHeader(http.StatusOK)
		w.Write(b.Bytes())
	}
}
