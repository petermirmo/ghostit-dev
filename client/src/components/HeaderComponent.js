import React from "react";
import "../css/theme.css";

const Header = () => {
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
};

export default Header;
