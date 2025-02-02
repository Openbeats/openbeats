const type = "development";
// production or development
let clientURL = "http://localhost";
let baseURL = "http://localhost";
if (type === "production") {
	baseURL = "https://api.openbeats.live";
	clientURL = "https://openbeats.live";
}
const variables = {
	baseUrl: baseURL,
	clientUrl: clientURL,
};
const isDev = type === "development" ? true : false;
export {
	variables,
	isDev
};