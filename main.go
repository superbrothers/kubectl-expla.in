package main

import (
	"expvar"
	"flag"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"runtime"

	"github.com/Sirupsen/logrus"
	"github.com/coreos/pkg/flagutil"
	"github.com/coreos/pkg/health"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/superbrothers/kubectl-expla.in/api/v1"
	"github.com/superbrothers/kubectl-expla.in/app"
)

var (
	version = "DEV"
	commit  = "xxx"
)

var (
	listen       string
	assets       string
	trackingId   string
	verbose      bool
	printVersion bool
)

func init() {
	logrus.SetOutput(os.Stderr)
	versionVar := expvar.NewString("kubectl-explain.version")
	versionVar.Set(version)
	commitVar := expvar.NewString("kubectl-explain.commit")
	commitVar.Set(commit)
}

func main() {
	fs := flag.NewFlagSet("kubectl-explain", flag.ExitOnError)
	fs.StringVar(&listen, "listen", ":8080", "run as server and listen to specified address")
	fs.StringVar(&assets, "html-assets", "./assets", "directory of html assets files")
	fs.StringVar(&trackingId, "tracking-id", "", "Google Analytics Tracking ID")
	fs.BoolVar(&verbose, "verbose", false, "display verbose output")
	fs.BoolVar(&printVersion, "version", false, "print version and exit")

	if err := flagutil.SetFlagsFromEnv(fs, "KUBECTL_EXPLAIN"); err != nil {
		logrus.Fatalf("%v", err)
	}

	if err := fs.Parse(os.Args[1:]); err != nil {
		logrus.Fatalf("%v", err)
	}

	if verbose {
		logrus.Infof("enable verbose mode")
		logrus.SetLevel(logrus.DebugLevel)
	}

	if printVersion {
		fmt.Fprintf(
			os.Stderr,
			"Version: %s\nGit commit: %s\nGo version: %s\nOS/Arch: %s/%s\n",
			version, commit, runtime.Version(), runtime.GOOS, runtime.GOARCH,
		)
		os.Exit(1)
	}

	logrus.Infof("using build: %s - %s", version, commit)

	r := mux.NewRouter()
	r.PathPrefix(`/assets/`).Handler(http.FileServer(http.Dir(assets)))
	r.HandleFunc(`/api/v1/explain`, v1.GetExplainHelpHandler).Methods("GET", "HEAD")
	r.HandleFunc(`/api/v1/explain/{resource:[A-Za-z0-9\.]+}`, v1.GetExplainHandler).Methods("GET", "HEAD")
	r.HandleFunc(`/debug/vars`, health.ExpvarHandler).Methods("GET", "HEAD")
	r.HandleFunc(`/{resource:[A-Za-z0-9\.]*}`, app.GetIndexHandlerFunc(filepath.Join(assets, "index.html"), trackingId)).Methods("GET", "HEAD")

	h := handlers.CORS()(r)
	h = handlers.LoggingHandler(os.Stdout, h)

	logrus.Infof("binding to %s...", listen)
	logrus.Fatal(http.ListenAndServe(listen, h))
}
