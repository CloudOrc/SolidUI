import React from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App";

const root = document.getElementById("root");
if (root) {
	createRoot(root).render(
		<ConfigProvider>
			<App />
		</ConfigProvider>
	);
}
