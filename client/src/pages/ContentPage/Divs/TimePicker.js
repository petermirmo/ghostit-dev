import React, { Component } from "react";

import TimePicker from "material-ui/TimePicker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

const muiTheme = getMuiTheme({
	fontFamily: "Open Sans",
	palette: {
		primary1Color: "var(--blue-theme-color)",
		primary2Color: "var(--blue-theme-color)",
		primary3Color: "var(--blue-theme-color)",
		pickerHeaderColor: "var(--blue-theme-color)",
		textColor: "#000",
		borderColor: "#000"
	}
});

class TimePickerComponent extends Component {
	state = {
		controlledTime: this.props.timeForPost
	};

	handleChange = (event, time) => {
		this.setState({
			controlledTime: time
		});
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			controlledTime: nextProps.timeForPost
		});
	}
	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<TimePicker
					id={this.props.id}
					hintText="Click here to pick Time!"
					value={this.state.controlledTime}
					onChange={this.handleChange}
					gettime={this.state.controlledTime}
					textFieldStyle={{ cursor: "pointer" }}
					disabled={this.props.canEdit}
				/>
			</MuiThemeProvider>
		);
	}
}

export default TimePickerComponent;
