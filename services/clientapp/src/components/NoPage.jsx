import React from "react";
import NoPageIllustration from "../assets/images/NoPage.svg";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import "../assets/css/nopage.css";

function NoPage({ push }) {
	return (
		<div className="nopage-center">
			<img src={NoPageIllustration} alt="" />
			<span className="error-msg">
				<strong>Oops! </strong>Looks like you have been lost in music...
			</span>
			<span className="ghost-button-semi-transparent" onClick={push}>
				Take me Home
			</span>
		</div>
	);
}
const mapDispatchToProps = dispatch => {
	return {
		push: () => dispatch(push("/")),
	};
};

export default connect(null, mapDispatchToProps)(NoPage);