import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faLongArrowAltLeft from "@fortawesome/fontawesome-free-solid/faLongArrowAltLeft";
import faLongArrowAltRight from "@fortawesome/fontawesome-free-solid/faLongArrowAltRight";

import "./styles/";

class Carousel extends Component {
	state = {
		linkImagesArray: this.props.linkImagesArray ? this.props.linkImagesArray : [],
		activeImageIndex: 0
	};

	componentDidMount() {
		if (this.props.linkImage) {
			let temp = this.props.linkImagesArray;
			temp.unshift(this.props.linkImage);
			this.setState({ linkImagesArray: temp });
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ linkImagesArray: nextProps.linkImagesArray });
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
		let { linkPreviewCanEdit, linkImage } = this.props;
		return (
			<div className="carousel-container">
				<div className="carousel-image-container">
					{linkPreviewCanEdit && (
						<span className="carousel-previous-button" onClick={() => this.changeImage(-1)}>
							<FontAwesomeIcon icon={faLongArrowAltLeft} />
						</span>
					)}
					<img alt=" No images at this url!" src={linkImage} className="carousel-image" />
					{linkPreviewCanEdit && (
						<span className="carousel-next-button" onClick={() => this.changeImage(1)}>
							<FontAwesomeIcon icon={faLongArrowAltRight} />
						</span>
					)}
				</div>
			</div>
		);
	}
}

export default Carousel;
