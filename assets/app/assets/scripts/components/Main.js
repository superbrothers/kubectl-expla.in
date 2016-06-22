import React from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import SearchBox from "./SearchBox";
import Terminal from "./Terminal";
import Title from "./Title";
import { grey100, grey200 } from "material-ui/styles/colors";
import { k8s, white } from "../colors";
import request from "superagent";

const muiTheme = getMuiTheme({
    fontFamily: "'Noto Sans', sans-serif",
    appBar: {
        color: k8s
    }
});

const styles = {
    root: {
        backgroundColor: grey100
    },
    appBar: {
        title: {
            fontStyle: "italic",
            fontSize: "20px",
            color: white
        }
    },
    footer: {
        root: {
            padding: "48px 24px",
            textAlign: "center",
            backgroundColor: k8s,
            color: grey200
        },
        iconButton: {
            color: white
        }
    }
};

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true};
    }

    componentDidMount() {
        this.fetch(this.props);
    }

    componentWillReceiveProps(props) {
        this.fetch(props);
    }

    handleEnter(e) {
        let location = {pathname: `/${e.resource}`, query: {}};
        if (e.recursive === true && e.resource.length > 0) {
            location.query.recursive = "1";
        }
        if (this.props.location.pathname === location.pathname && this.props.location.query.recursive === location.query.recursive) {
            return;
        }
        this.context.router.push(location);
    }

    render () {
        const { loading, doc, title } = this.state;
        const { params, location } = this.props;
        const resource = params.resource || "";
        const recursive = location.query && location.query.recursive === "1";

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <Title title={title}>
                    <div style={styles.root}>
                        <AppBar
                            title={<a style={styles.appBar.title} href="https://kubectl-expla.in/">kubectl-expla.in</a>}
                            showMenuIconButton={false}
                            iconElementRight={
                                <IconButton
                                    iconClassName="fa fa-github"
                                    linkButton={true}
                                    href="https://github.com/superbrothers/kubectl-expla.in"
                                />
                            } />
                        <SearchBox
                            resource={resource}
                            recursive={recursive}
                            loading={loading}
                            onEnter={::this.handleEnter} />
                        <Terminal loading={loading}>{doc}</Terminal>
                        <footer style={styles.footer.root}>
                            <p>kubectl-expla.in is unofficial site.</p>
                            <p>Developed by @superbrothers / Kazuki Suda.</p>
                            <IconButton
                                iconClassName="fa fa-github"
                                linkButton={true}
                                href="https://github.com/superbrothers/kubectl-expla.in"
                                iconStyle={styles.footer.iconButton}
                            />
                        </footer>
                    </div>
                </Title>
            </MuiThemeProvider>
        );
    }

    fetch(props) {
        const { params, location } = props;

        let cmd = ["kubectl", "explain"];
        let title = null;
        if (params.resource && params.resource.length > 0) {
            cmd.push(params.resource);
            if (location.query.recursive == "1") {
                cmd.push("--recursive");
            }
            title = cmd.join(" ");
        } else {
            cmd.push("--help");
        }
        this.setState({loading: true, doc: `$ ${cmd.join(" ")}`, title: title});

        let url = "/api/v1/explain";
        if (location.pathname !== "/") {
            url += location.pathname;
        }
        request.get(url).query(location.query).end((err, res) => {
            const out = res.body.documentation || res.body.message || "internal server error";
            this.setState({
                loading: false,
                doc: `$ ${cmd.join(" ")}\n${out}`
            });
        });
    }
}

Main.contextTypes = {
    router: () => { React.PropTypes.func.isRequired; }
};

export default Main;
