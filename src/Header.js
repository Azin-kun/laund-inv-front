import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
	return (
		<nav>
			<NavLink exact activeClassName="active" to="/">
			Home
			</NavLink><NavLink exact activeClassName="active" to="/pages/Outlet.js">
			Outlet
			</NavLink>
			<NavLink exact activeClassName="active" to="/pages/Member.js">
			Member
			</NavLink>
			<NavLink exact activeClassName="active" to="/pages/User.js">
			User
			</NavLink>
			<NavLink exact activeClassName="active" to="/pages/Paket.js">
			Paket
			</NavLink>
			<NavLink exact activeClassName="active" to="/pages/Resi.js">
			Resi
			</NavLink>
		</nav>

		)
}

export default Header;