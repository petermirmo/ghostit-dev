import React, { Component } from "react";

class ContentModalHeader extends Component {
	switchTabs(event, socialMedia) {
		if (socialMedia === "instagram") {
			return;
		}
		var clickedNavBarTab = event.target.parentNode;

		// Check if this is the active class
		if (clickedNavBarTab.classList.contains("active-column")) {
			// If it is already active tab, do nothing
			return;
		} else {
			this.props.clearActiveDivs();
			// Take away active class from all other tabs
			var tabs = document.getElementsByClassName("active-column");
			for (var index = 0; index < tabs.length; index++) {
				tabs[index].className = "column";
			}
			clickedNavBarTab.className += " active-column";

			if (socialMedia === "facebook") {
				this.props.switchTabState(socialMedia, true, false);
			} else if (socialMedia === "twitter") {
				this.props.switchTabState(socialMedia, false, false);
			} else if (socialMedia === "linkedin") {
				this.props.switchTabState(socialMedia, true, true);
			} else if (socialMedia === "instagram") {
				this.props.switchTabState(socialMedia, false, false);
			} else if (socialMedia === "blog") {
				this.props.switchTabState(socialMedia, false, false);
			} else if (socialMedia === "newsletter") {
				this.props.switchTabState(socialMedia, false, false);
			}
		}
	}

	render() {
		return (
			<div className="row">
				<div className="column active-column">
					<button onClick={event => this.switchTabs(event, "facebook")}>Facebook</button>
				</div>

				<div className="column">
					<button onClick={event => this.switchTabs(event, "twitter")}>Twitter</button>
				</div>

				<div className="column">
					<button onClick={event => this.switchTabs(event, "linkedin")}>Linkedin</button>
				</div>

				<div className="column">
					<button onClick={event => this.switchTabs(event, "blog")}>Website Blog</button>
				</div>

				<div className="column">
					<button onClick={event => this.switchTabs(event, "newsletter")}>Email Newsletter</button>
				</div>

				<div
					className="column"
					style={{
						background: "linear-gradient(90deg, #cd486b, #8a3ab9)"
					}}
					onClick={event => this.switchTabs(event, "instagram")}
				>
					<button>Coming Soon!</button>
				</div>
			</div>
		);
	}
}

export default ContentModalHeader;
