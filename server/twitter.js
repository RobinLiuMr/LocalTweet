const Twitter = require("twitter");
const https = require("https");
const { Key, Secret } = require("../secrets.json");

let bearer_token;
let twitterClient;

function getToken() {
    const basic_header = Buffer.from(`${Key}:${Secret}`).toString("base64");

    return makeRequest(
        {
            method: "POST",
            host: "api.twitter.com",
            path: "/oauth2/token",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                Authorization: `Basic ${basic_header}`,
            },
        },
        "grant_type=client_credentials"
    ).then((responseBody) => responseBody.access_token);
}

function makeRequest(options, requestBody) {
    return new Promise((resolve, reject) => {
        const params = options;

        const request = https.request(params, (response) => {
            let responseBody = "";
            response.on("data", (chunk) => (responseBody += chunk));
            response.on("end", () => {
                try {
                    const parseBody = JSON.parse(responseBody);
                    resolve(parseBody);
                } catch (error) {
                    console.log("not validate JSON");
                }
            });
        });

        request.on("error", (error) => {
            reject(error);
        });

        request.end(requestBody);
    });
}

async function getTwitterClient() {
    if (!bearer_token) {
        bearer_token = await getToken();
    }
    if (!twitterClient) {
        twitterClient = new Twitter({
            consumer_key: Key,
            consumer_secret: Secret,
            bearer_token,
        });
    }
    return twitterClient;
}

async function getTweets(screen_name) {
    const client = await getTwitterClient();
    const results = await client.get("statuses/user_timeline", {
        screen_name: screen_name,
        tweet_mode: "extended",
    });
    return results;
}

module.exports = { getTweets };
