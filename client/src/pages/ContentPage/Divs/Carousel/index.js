import React, { Component } from "react";

import "./style.css";

class Carousel extends Component {
	state = {
		linkImagesArray: this.props.linkImagesArray ? this.props.linkImagesArray : [],
		activeImageIndex: 0,
		linkImage: this.props.linkImage
	};

	componentDidMount() {
		if (this.props.linkImage) {
			let temp = this.props.linkImagesArray;
			temp.unshift(this.props.linkImage);
			this.setState({ linkImagesArray: temp });
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.linkImage) {
			let temp = nextProps.linkImagesArray;
			temp.unshift(nextProps.linkImage);
			this.setState({ linkImagesArray: temp });
		} else {
			this.setState({ linkImagesArray: nextProps.linkImagesArray });
		}
	}
	changeImage = increment => {
		let { activeImageIndex, linkImagesArray } = this.state;
		activeImageIndex += increment;
		if (activeImageIndex >= linkImagesArray.length) {
			activeImageIndex = 0;
		} else if (activeImageIndex <= 0) {
			activeImageIndex = linkImagesArray.length - 1;
		}
		this.props.handleChange("linkImage", linkImagesArray[activeImageIndex]);
		this.setState({ activeImageIndex: activeImageIndex });
	};
	render() {
		const { linkPreviewCanEdit } = this.props;
		const { linkImagesArray, activeImageIndex } = this.state;
		let imageLink = linkImagesArray[activeImageIndex];

		return (
			<div className="carousel-container">
				<div className="carousel">
					<div className="carousel-image-container">
						{linkPreviewCanEdit && (
							<button className="carousel-previous-button fa fa-arrow-left" onClick={() => this.changeImage(-1)} />
						)}
						<img alt=" No images at this url!" src={imageLink} className="carousel-image" />
						{linkPreviewCanEdit && (
							<button className="carousel-next-button fa fa-arrow-right" onClick={() => this.changeImage(1)} />
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default Carousel;
