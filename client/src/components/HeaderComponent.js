import React, { Component } from "react";
import "../css/theme.css";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Header extends Component {
    componentDidMount() {
        console.log(this.props);

        switch (this.props.auth) {
            case null:
                return <Redirect to="/" />;
            case false:
                return;
        }
    }
    render() {
        console.log(this.props.auth);

        return (
            <header>
                <ul>
                    <li>
                        <a href="/profile">Profile</a>
                    </li>
                    <li>
                        <a className="active" href="/content">
                            Content
                        </a>
                    </li>
                </ul>
            </header>
        );
    }
}
function mapStateToProps(state) {
    return { auth: state.auth };
}

export default connect(mapStateToProps)(Header);
