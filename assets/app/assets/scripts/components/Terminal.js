import React, { PropTypes } from "react";
import Paper from "material-ui/Paper";
import LinearProgress from "material-ui/LinearProgress";
import merge from "merge";
import { grey900 } from "material-ui/styles/colors";
import { white } from "../colors";

const styles = {
    paper: {
        root: {
            position: "relative",
            margin: "0 auto",
            maxWidth: "1024px",
            minHeight: "400px",
            display: "block",
            padding: "25px 25px 40px",
            backgroundColor: grey900
        },
        pre: {
            fontFamily: "'Inconsolata', monospace",
            whiteSpace: "pre-wrap",
            color: white,
            fontSize: "14px",
            lineHeight: "18px"
        },
        progress: {
            position: "absolute",
            backgroundColor: "inherit",
            borderRadius: 0,
            top: 0,
            left: 0
        }
    }
};

class Terminal extends React.Component {
    render() {
        const visibility = this.props.loading ? "visible" : "hidden";

        return (
            <div>
                <Paper style={styles.paper.root} zDepth={1} rounded={false}>
                    <pre style={styles.paper.pre}>{this.props.children}</pre>
                    <LinearProgress
                        style={merge(styles.paper.progress, {visibility})}
                        mode="indeterminate"  />
                </Paper>
            </div>
        );
    }
}

Terminal.propTypes = {
    text: PropTypes.string,
    loading: PropTypes.bool
};

export default Terminal;
