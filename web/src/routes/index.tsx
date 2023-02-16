import React from "react";
import { RouteObject } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Designer/Designer";

const routes: RouteObject[] = [
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/",
		element: <Dashboard />,
	},
];

export default routes;
