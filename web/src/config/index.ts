const API_URL =
	process.env.BASE_ENV === "development" ? "" : "http://localhost:3000/api";

export { API_URL };
