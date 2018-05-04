import React, { Component } from "react";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";

import "./style.css";

class Carousel extends Component {
	state = {
		linkImagesArray: [],
		linkPreviewCanShow: this.props.linkPreviewCanShow,
		linkPreviewCanEdit: this.props.linkPreviewCanEdit
	};
	constructor(props) {
		super(props);
		this.getDataFromURL = this.getDataFromURL.bind(this);
	}

	findLink(textAreaString) {
		// If we can't show link preview, return
		if (this.state.linkPreviewCanShow === false) {
			return;
		}
		// Url regular expression
		let urlRegularExpression = /((http|ftp|https):\\)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/;

		// Finds url
		let match = urlRegularExpression.exec(textAreaString);
		let link;

		// Adjusts entered in url for consistent url starts. EX: "ghostit.co" would convert to "http://ghostit.co"
		if (match !== null) {
			if (match[0].substring(0, 7) === "http://" || match[0].substring(0, 8) === "https://") {
				link = match[0];
			} else {
				link = "http://" + match[0];
			}
			this.getDataFromURL(link);
		}
	}
	getDataFromURL(link) {
		axios.post("/api/link", { link: link }).then(res => {
			this.setState({ link: link, linkImagesArray: res.data });
			this.props.updateParentState(link, res.data);
		});
	}
	render() {
		let linkImages = this.state.linkImagesArray;
		let linkPreviewImageTag = [];
		let carousel;

		for (let index in linkImages) {
			// If we can't show link preview, break
			if (this.props.linkPreviewCanShow === false) {
				break;
			}
			linkPreviewImageTag.push(
				<div
					className="item"
					key={index}
					style={{
						height: "150",
						border: "2px solid var(--black-theme-color)"
					}}
				>
					<img
						alt=" No images at this url!"
						style={{
							maxHeight: "100px",
							boxShadow: " 0 0 20px 0"
						}}
						src={linkImages[index]}
					/>
				</div>
			);
			if (this.props.linkPreviewCanEdit === true) {
				carousel = (
					<OwlCarousel
						id={this.props.id}
						style={{
							float: "left",
							width: "40%"
						}}
						items={1}
						className="owl-theme center"
						center={true}
						loop
						margin={10}
						nav
					>
						{linkPreviewImageTag}
					</OwlCarousel>
				);
			} else {
				carousel = (
					<OwlCarousel
						id={this.props.id}
						style={{
							float: "left",
							width: "40%"
						}}
						items={1}
						className="owl-theme center"
						center={true}
						loop
						margin={10}
						nav={false}
						dots={false}
						mouseDrag={false}
						touchDrag={false}
						pullDrag={false}
						freeDrag={false}
					>
						{linkPreviewImageTag}
					</OwlCarousel>
				);
			}
		}

		return <div>{carousel}</div>;
	}
}

export default Carousel;
