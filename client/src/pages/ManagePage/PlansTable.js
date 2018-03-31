import React, { Component } from "react";
//import axios from "axios";

class PlansTable extends Component {
	state = {
		socialPosts: {
			amount: 0,
			frequency: 1
		},
		facebookPosts: {
			amount: 0,
			frequency: 1
		},
		twitterPosts: {
			amount: 0,
			frequency: 1
		},
		linkedinPosts: {
			amount: 0,
			frequency: 1
		},
		instagramPosts: {
			amount: 0,
			frequency: 1
		},
		websiteBlogPosts: {
			amount: 0,
			frequency: 1
		},
		emailNewsletters: {
			amount: 0,
			frequency: 1
		},
		eBooks: {
			amount: 0,
			frequency: 3
		}
	};
	constructor(props) {
		super(props);
		this.formChange = this.formChange.bind(this);
	}
	formChange(event) {
		// ID of target is object attribute in state
		let object = this.state[event.target.id];
		object.amount = event.target.value;
		console.log(object);
	}
	render() {
		let planDivs = [];
		for (let index in this.state) {
			planDivs.push(
				<div key={index}>
					<span>
						{index}
						<input id={index} value={this.state[index].amount} onChange={this.formChange} />
					</span>
				</div>
			);
		}
		return <div>{planDivs}</div>;
	}
}

export default PlansTable;
