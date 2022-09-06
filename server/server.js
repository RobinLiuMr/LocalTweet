const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const Twitter = require("twitter");
const { getToken } = require("./OAuth-2-App-Only");
const { Key, Secret } = require("../secrets.json");

// build app
const app = express();

// Middlewares

// set up cookies
const { SESSION_SECRET } = require("../secrets.json");
const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days of cookie validity
});
app.use(cookieSessionMiddleware);
// other middlewares
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));

// create twitter client

getToken().then((token) => {
    var client = new Twitter({
        consumer_key: `${Key}`,
        consumer_secret: `${Secret}`,
        bearer_token: token,
    });

    var params = { screen_name: "BBCNews" };
    client.get(
        "statuses/user_timeline",
        params,
        function (error, tweets, response) {
            if (!error) {
                // console.log(tweets);
                return tweets;
            } else {
                return error;
            }
        }
    );
});

// Route homepage
app.get("/api/city/me", async (request, response) => {
    const searchResults = await getToken();
    response.json(searchResults);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
