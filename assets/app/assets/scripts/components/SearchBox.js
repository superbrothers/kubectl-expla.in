import React, { PropTypes } from "react";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import {List, ListItem} from "material-ui/List";
import Checkbox from "material-ui/Checkbox";

const styles = {
    paper: {
        margin: "0 auto",
        maxWidth: "1024px",
        display: "block"
    },
    textField: {
        root: {
            width: "80%",
            margin: "0 auto",
            display: "block"
        },
        input: {
            textAlign: "center"
        }
    },
    list: {
        root: {
            width: "80%",
            margin: "0 auto",
            paddingTop: "0px"
        }
    }
};

class SearchBox extends React.Component {
    constructor(props, context) {
        super(props, context);
        const { resource, recursive } = props;
        this.state = {resource, recursive};
    }

    componentWillReceiveProps(props) {
        const { resource, recursive } = props;
        this.setState({resource, recursive});
    }

    handleChangeResource(e) {
        const resource = e.target.value.trim();
        if (/^[a-zA-Z\\.]*$/.test(resource)) {
            this.setState({resource});
        }
    }

    handleCheckRecursive(e, checked) {
        this.setState({recursive: checked});
    }

    handleEnter(e) {
        if (e.which === 13) { // Enter
            this.props.onEnter(this.state);
        }
    }

    render() {
        const disabled = !!this.props.loading;
        return (
            <div>
                <Paper style={styles.paper} zDepth={1} rounded={false}>
                    <TextField
                        value={this.state.resource}
                        onChange={::this.handleChangeResource}
                        onKeyDown={::this.handleEnter}
                        disabled={disabled}
                        floatingLabelText="RESOURCE (e.g. po,svc,ing)"
                        style={styles.textField.root}
                        inputStyle={styles.textField.input}
                    />
                    <List style={styles.list.root}>
                        <ListItem
                            leftCheckbox={
                                <Checkbox
                                    checked={this.state.recursive}
                                    disabled={disabled}
                                    onCheck={::this.handleCheckRecursive} />}
                            primaryText="--recursive"
                            secondaryText="Print the fields of fields (Currently only 1 level deep)"
                        />
                    </List>
                </Paper>
            </div>
        );
    }
}

SearchBox.propTypes = {
    resource: PropTypes.string,
    recursive: PropTypes.bool,
    loading: PropTypes.bool,
    onEnter: PropTypes.func.isRequired
};

export default SearchBox;
