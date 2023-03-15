import React from "react";

import "./header.less";

function Header() {
	return (
		<header className="header">
			<div className="header-main">
				<div className="header-left">
					<div className="logo"></div>
					<div className="logo-text">SolidUI</div>
					<div className="version">v0.1.0</div>
					<div className="split-line"></div>
					<div className="left-main"></div>
				</div>
				<div className="header-center"></div>
				<div className="header-right"></div>
			</div>
		</header>
	);
}

export default Header;
