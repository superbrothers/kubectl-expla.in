package kubectl

import (
	"os/exec"
	"strings"

	"github.com/Sirupsen/logrus"
)

const (
	explainCommand       = "explain"
	explainFlagRecursive = "--recursive"
)

type ExplainArg struct {
	Resource  string
	Recursive bool
	Help      bool
}

func (earg *ExplainArg) CommandArg() []string {
	arg := []string{explainCommand}

	if earg.Help {
		arg = append(arg, flagHelp)
		return arg
	}

	arg = append(arg, earg.Resource)

	if earg.Recursive {
		arg = append(arg, explainFlagRecursive)
	}

	return arg
}

func Explain(arg *ExplainArg) ([]byte, error) {
	cmdArg := arg.CommandArg()
	logrus.Debugf("kubectl: %s", strings.Join(cmdArg, " "))
	out, err := exec.Command(kubectl, cmdArg...).CombinedOutput()
	if err != nil {
		logrus.Debugf("%v", err)
	}
	return out, err
}
