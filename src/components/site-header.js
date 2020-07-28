import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo, logoutUser} from "../actions/auth-actions";
import isEmpty from "../utils/isEmpty";
import {Helmet} from "react-helmet";

class SiteHeader extends Component{
	constructor(props){
		super(props);
		this.state = {
			showedAdminMenu: false,

		};

		this.toggleAdminMenu = this.toggleAdminMenu.bind(this);
		this.hideAdminMenu = this.hideAdminMenu.bind(this);
	}

	componentDidMount(){
		if(this.props.auth.isAuthenticated)
			this.props.getUserInfo({user_id: this.props.auth.user.id,});
	}

	toggleAdminMenu(){
		this.setState({showedAdminMenu: !this.state.showedAdminMenu});
	}

	hideAdminMenu(){
		if(this.state.showedAdminMenu)
			this.setState({showedAdminMenu: false});
	}

	onLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser(this.props.history);
	};

	render(){
		const is_view = this.props.location.pathname.startsWith("/view-community/");

		return (
			<div id={"main-header"}>
				{is_view ? null : (
					<Helmet>
						<title>Find your community.</title>
						<meta name={"description"}
									content={"Whether it be one or one-million, every community creates a beacon of light for someone to find and navigate towards. We want to help them shine brighter."}/>
					</Helmet>
				)}
				<header className={`site-header w3-bar ${this.props.for1st ? "shadow" : ""}`}
								style={{filter: this.props.overlayed ? "blur(4px)" : "none"}}>
					<Link to="/goto-url/everydaybelievers.com">
						<img className="site-logo" src={"/img/logo.png"}
								 sizes="(max-width: 479px) 144.546875px, 216.8125px" alt="site logo"/>
					</Link>
					{this.props.auth.isAuthenticated ? null : (
						<Link to="#" onClick={this.toggleAdminMenu}
									className={"header-3lines-menu w3-bar-item w3-right" + (this.props.auth.isAuthenticated ? "" : " oos")}>
							<i className="fas fa-bars"/>
						</Link>
					)}
					{this.props.auth.isAuthenticated ? (<>
							<Link to="#" onClick={this.toggleAdminMenu}
										className={"header-3lines-menu w3-bar-item w3-right"}>
								<img src={"/img/icon-down3-blue.svg"} style={{width: "10px"}} alt={"chevron for popup menu"}/>
							</Link>
							<Link to="#" onClick={this.toggleAdminMenu} className="header-3lines-menu w3-bar-item w3-right">
								<span className={"headerprofpic-welcome"}>
									<span className={"name-on-header"}>{this.props.auth.user.fname}</span>
								</span>
								<div className="headerprofpic-div w3-right">
									<img src={
										isEmpty(this.props.auth.user.pic) ?
											"/img/default-user.png"
											: this.props.auth.user.pic}
											 alt={this.props.auth.user.fname} className="image-4"/>
								</div>
							</Link>
						</>)
						: null}

					{!this.props.auth.isAuthenticated ? (
							<>
								<Link to="/create-an-account" className="sign-up-link w3-bar-item w3-right">
									Create an account
								</Link>
								<Link to="/sign-in"
											className={"sign-in-link w3-bar-item w3-right " + (this.props.location.pathname === "/sign-in" ? "current" : "")}>
									Sign In
								</Link>
								<div className={"header-link-sep w3-bar-item w3-right"} style={{margin: "0"}}>&nbsp;</div>
								<Link to="/goto-url/everydaybelievers.com"
											className={"home-link w3-bar-item w3-right " + (this.props.location.pathname === "/" ? "current" : "")}
											style={{marginRight: "7px"}}
								>
									Home
								</Link>
							</>
						)
						: null}
				</header>
				<div className="admin-menu w3-animate-top" onClick={this.toggleAdminMenu} onMouseLeave={this.hideAdminMenu}
						 style={{
							 display: this.state.showedAdminMenu ? "block" : "none",
						 }}>
					<nav role="navigation" className="global-navcontainer w-nav-menu w--nav-menu-open">
						<Link to="/goto-url/everydaybelievers.com" className="header-navlink w-nav-link w--nav-link-open">
							Home</Link>
						{this.props.auth.isAuthenticated ? (<>
							<Link to="/dashboard" className="header-navlink w-nav-link w--nav-link-open">
								Dashboard</Link>
							<Link to="/dashboard/account"
										className="header-navlink w-nav-link w--nav-link-open">
								Account</Link>
							<Link to="#" onClick={this.onLogoutClick}
										className="header-navlink w-nav-link w--nav-link-open">
								Sign Out</Link>
						</>) : null}
						{this.props.auth.isAuthenticated ? null : (<>
							<Link to="/sign-in"
										className="header-navlink w-nav-link w--nav-link-open">
								Sign In</Link>
							<Link to="/create-an-account"
										className="header-navlink w-nav-link w--nav-link-open">
								Create an account</Link>
						</>)}
					</nav>
				</div>
			</div>
		);
	}
}

SiteHeader.propTypes = {
	auth: PropTypes.object.isRequired,
	getUserInfo: PropTypes.func.isRequired,
	logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(
	mapStateToProps,
	{getUserInfo, logoutUser}
)(withRouter(SiteHeader));
