import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";

import "./style.css";

class Carousel extends Component {
	imageDiv(link, index) {
		return (
			<div className="carousel-image-container item" key={index}>
				<img alt=" No images at this url!" className="carousel-image" src={link} />
			</div>
		);
	}
	render() {
		const { linkImagesArray, id, linkPreviewCanEdit, linkImage } = this.props;

		let linkPreviewImageTag = [];
		let carousel;

		if (linkImage) {
			linkPreviewImageTag.push(this.imageDiv(linkImage, -1));
		}

		for (let index = 0; index < linkImagesArray.length; index++) {
			linkPreviewImageTag.push(this.imageDiv(linkImagesArray[index], index));
		}

		if (linkPreviewCanEdit === true) {
			carousel = (
				<OwlCarousel id={id} items={1} className="carousel owl-theme" center={true} loop margin={10} nav>
					{linkPreviewImageTag}
				</OwlCarousel>
			);
		} else {
			carousel = (
				<OwlCarousel
					id={id}
					items={1}
					className="carousel owl-theme"
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

		return <div>{carousel}</div>;
	}
}

export default Carousel;
