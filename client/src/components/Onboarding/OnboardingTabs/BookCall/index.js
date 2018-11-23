import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./styles/";

class BookCall extends Component {
  constructor(props) {
    super(props);
    props.setHeaderMessage(props.title);
  }
  render() {
    const { className, value, link } = this.props;
    return (
      <form>
        <Link to="/strategy">
          <button
            className={className}
            onClick={() => window.open(link)}
            type="submit"
          >
            {value}
          </button>
        </Link>
      </form>
    );
  }
}
export default BookCall;
