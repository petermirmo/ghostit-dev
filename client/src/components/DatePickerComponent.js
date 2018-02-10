import React, { Component } from "react";
import "../css/theme.css";

import DatePicker from "material-ui/DatePicker";
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
class DatePickerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controlledDate: this.props.clickedCalendarDate
        };
    }

    handleChange = (event, date) => {
        this.setState({
            controlledDate: date
        });
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            controlledDate: nextProps.clickedCalendarDate
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <DatePicker
                    id="contentDatePickerPopUp"
                    hintText="Click here to pick Date!"
                    autoOk={true}
                    value={this.state.controlledDate}
                    onChange={this.handleChange}
                    getdate={this.state.controlledDate}
                    textFieldStyle={{ cursor: "pointer" }}
                />
            </MuiThemeProvider>
        );
    }
}

export default DatePickerComponent;
