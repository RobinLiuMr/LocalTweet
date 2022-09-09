const Twitter = require("twitter");
const https = require("https");
const { Key, Secret } = require("../secrets.json");
const moment = require("moment");

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

async function getTweets({ screen_name, LIMIT = 3 }) {
    const client = await getTwitterClient();
    const results = await client.get("statuses/user_timeline", {
        screen_name,
        tweet_mode: "extended",
    });

    const latestResult = results.slice(0, LIMIT);

    return filterData(latestResult);
}

function filterData(tweets) {
    return tweets.map(
        ({ created_at, id_str, full_text, user: { name, screen_name } }) => {
            const text = full_text.split("http")[0].trim();

            const date = moment(created_at);
            const formatDate = date.format("MMMM Do YYYY, HH:mm");
            return {
                formatDate,
                id_str,
                text,
                name,
                screen_name,
            };
        }
    );
}

module.exports = { getTweets };
