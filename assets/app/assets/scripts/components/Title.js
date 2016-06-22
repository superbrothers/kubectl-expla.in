"use strict";

import React from "react";
import DocumentTitle from "react-document-title";

class Title extends React.Component {
    render() {
        console.info(this.props);
        let title = "kubectl-expla.in - Awesome kubectl explain";
        if (this.props.title) {
            title = `${this.props.title} / ${title}`;
        }
        return <DocumentTitle title={title}>{this.props.children}</DocumentTitle>;
    }
}

export default Title;
