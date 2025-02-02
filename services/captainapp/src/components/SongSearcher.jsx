import React, { Component } from "react";
import "../assets/styles/songsearcher.css";
import gannaLogo from "../assets/images/GaanaIcon.png"
import wynkLogo from "../assets/images/Wynk.webp"
import { connect } from "react-redux";
import { gannaScrapper } from "../actions"
import axios from "axios";

class SongSearcher extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suggestionStringArray: [],
			suggestionString: "",
			searchStringSuggestionFetchUrl: this.props.searchStringSuggestionFetchUrl || null,
			songSuggestionFetchUrl: this.props.songSuggestionFetchUrl || null,
			songsCollection: [],
			suggestionCurrentIndex: 0,
		};
		this.suggestionBlockRef = null;
		this.inputSearchRef = null;
	}

	fetchSearchStringSuggestion = async () => {
		document.removeEventListener("click", this.clearSuggestionInputListener);
		document.removeEventListener("keyup", this.clearSuggestionInputListener);
		let suggestionData = (
			await axios.get(
				this.state.searchStringSuggestionFetchUrl +
				this.state.suggestionString
			)
		).data;

		this.setState({
			suggestionStringArray: [
				[this.state.suggestionString],
				...suggestionData.data.slice(0, 5),
			],
			suggestionCurrentIndex: 0,
		});
		document.addEventListener("click", this.clearSuggestionInputListener);
		document.addEventListener("keyup", this.clearSuggestionInputListener);
	};

	async fetchSongSuggestion() {
		document.removeEventListener("click", this.clearSuggestionInputListener);
		document.removeEventListener("keyup", this.clearSuggestionInputListener);
		if (this.state.songSuggestionFetchUrl) {
			let suggestionData = await this.getSearchResultSafely(
				this.state.songSuggestionFetchUrl + this.state.suggestionString
			);
			this.setState({
				songsCollection: suggestionData.data,
				suggestionStringArray: []
			});
		}
	};

	async getSearchResultSafely(url) {
		let fetchCount = 3;
		while (fetchCount > 0) {
			const {
				data
			} = await axios.get(url);
			const res = data;
			if (res.status && res.data.length) {
				return res;
			}
			fetchCount--;
		}
		return {
			status: false,
			data: []
		};
	}

	playSongTrial = (index) => {
		this.props.songTrialTrigger(this.state.songsCollection[index]);
	};

	addSongToBucket = (index) => {
		this.props.addSongsToTheBucketCallBack(this.state.songsCollection[index]);
	};

	clearSuggestionInputListener = (event) => {
		if (event.keyCode === 27 || !this.suggestionBlockRef.contains(event.target)) {
			this.setState({
				suggestionStringArray: [],
				suggestionString: "",
				suggestionCurrentIndex: 0,
			});
			document.removeEventListener("click", this.clearSuggestionInputListener);
			document.removeEventListener("keyup", this.clearSuggestionInputListener);
		} else if (event.keyCode === 40) {
			const currentIndex = this.state.suggestionCurrentIndex + 1 < this.state.suggestionStringArray.length ? this.state.suggestionCurrentIndex + 1 : 0;
			this.setState({
				suggestionCurrentIndex: currentIndex,
				suggestionString: this.state.suggestionStringArray[currentIndex][0],
			});

		} else if (event.keyCode === 38) {
			const currentIndex = this.state.suggestionCurrentIndex - 1 >= 0 ? this.state.suggestionCurrentIndex - 1 : this.state.suggestionStringArray.length - 1;
			this.setState({
				suggestionCurrentIndex: currentIndex,
				suggestionString: this.state.suggestionStringArray[currentIndex][0],
			});
		} else if (event.keyCode === 13 && this.state.suggestionStringArray.length) {
			this.fetchSongSuggestion();
		}
	};

	componentWillUnmount() {
		this.setState({
			suggestionFetchUrl: "",
			suggestionString: "",
			songsCollection: [],
		});
	}

	render() {
		return (
			<div className="song-searcher-wrapper">
				<div className="song-searcher-header">
					<div
						className="song-searcher-header-input"
						ref={(d) => (this.suggestionBlockRef = d)}>
						<input
							type="text"
							ref={(d) => (this.inputSearchRef = d)}
							onChange={async (e) => {
								await this.setState({ suggestionString: e.target.value });
								this.fetchSearchStringSuggestion();
							}}
							value={this.state.suggestionString}
							placeholder="Search Songs here..."
						/>
						<i className="fas fa-search song-searcher-search-icon-holder"></i>
						<div className="song-searcher-search-suggestion-holder">
							{this.state.suggestionStringArray.map((item, key) => {
								return (
									key !== 0 && (
										<div
											className={`song-searcher-search-suggestion-node cursor-pointer ${
												this.state.suggestionCurrentIndex === key
													? "bg-dark text-white"
													: ""
												}`}
											onClick={async () => {
												await this.setState({ suggestionCurrentIndex: key, suggestionString: this.state.suggestionStringArray[key][0] });
												this.fetchSongSuggestion();
											}}
											key={key}>
											{item[0]}
										</div>
									)
								);
							})}
						</div>
					</div>
					<div className="gaana" onClick={() => this.props.toggleScrapperDialog(true, this.props.addSongsCallback, this.props.setFetchedArtist)}>
						<img className="scrapper-logo" src={gannaLogo} alt="" />
						<img className="scrapper-logo" src={wynkLogo} alt="" />
					</div>
				</div>
				<div className="song-searcher-body">
					{this.state.songsCollection.length === 0 && (
						<div
							className="song-searcher-empty-result-message font-weight-bold"
							onClick={() => {
								this.inputSearchRef.focus();
							}}>
							Search Songs Here!
						</div>
					)}
					{this.state.songsCollection.length !== 0 && (
						<div className="song-searcher-search-result-holder">
							{this.state.songsCollection.map((item, key) => (
								<div className="song-searcher-search-result-node" key={key}>
									<div className="song-searcher-song-thumbnail-holder">
										<div
											className="song-searcher-song-thumbnail"
											style={{
												backgroundImage: `url(${item.thumbnail})`,
											}}></div>
									</div>
									<div className="song-searcher-actions">
										<i
											className="fas fa-play-circle shadow cursor-pointer"
											onClick={() => this.playSongTrial(key)}></i>
										<i
											className="fas fa-plus-circle shadow cursor-pointer"
											onClick={() => this.addSongToBucket(key)}></i>
									</div>
									<div className="font-weight-bold song-searcher-song-title">{item.title}</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		toggleScrapperDialog: (isOpened, songsBucketCallback, setFetchedArtistCallback) => {
			const payload = { isOpened, songsBucketCallback, setFetchedArtistCallback };
			return gannaScrapper.toggleScrapperDialog(payload);
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SongSearcher);
