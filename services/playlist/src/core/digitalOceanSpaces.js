import { config } from "../config";
import axios from "axios";
const { S3, Endpoint } = require("aws-sdk");

const ACCESS_KEY = config.spacesAPIKey;
const SECRET_KEY = config.spacesAPISecret;
const spacesEndpoint = new Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new S3({
	endpoint: spacesEndpoint,
	accessKeyId: ACCESS_KEY,
	secretAccessKey: SECRET_KEY,
});

//Uploads to assert to Digital Ocean and updates assert reference
export const saveAsserts = async (assert, assertId, url, assertModel, property) => {
	try {
		const response = await axios.get(`${url}`, {
			responseType: "arraybuffer",
		});
		const contentType = response.headers["content-type"];
		const contentLength = response.headers["content-length"];
		const content = response.data;
		const fileconfig = {
			Bucket: "openbeats",
			Key: `${config.subFolder}/${assert}/${assertId}.${contentType.split("/")[1]}`,
			ContentType: contentType,
			ContentLength: contentLength,
			ACL: "public-read",
			Body: content,
		};
		const uploadandNotify = new Promise((resolve, reject) =>
			s3.putObject(fileconfig, (err, data) =>
				err
					? reject(err)
					: resolve(
							`${spacesEndpoint.protocol}//${fileconfig.Bucket}.${spacesEndpoint.host}/${fileconfig.Key}`
					  )
			)
		);
		const endpoint = await uploadandNotify
			.then(endpoint => endpoint)
			.catch(err => {
				throw err;
			});
		if (endpoint) {
			const update = {};
			update[property] = endpoint;
			await assertModel.findByIdAndUpdate(assertId, update);
		}
	} catch (error) {
		console.error(error);
	}
};

export const deleteAssert = async url => {
	const searchVal = "com/";
	const fileconfig = {
		Bucket: "openbeats",
		Key: url.slice(url.indexOf(searchVal) + searchVal.length),
	};
	try {
		const deleteandNotify = new Promise((resolve, reject) =>
			s3.deleteObject(fileconfig, function (err, data) {
				if (err) reject(err);
				// error
				else resolve("Successfully Deleted"); // deleted
			})
		);
		await deleteandNotify
			.then(msg => console.log(msg))
			.catch(err => {
				throw err;
			});
	} catch (error) {
		console.log(error);
	}
};