const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

const { getTweets } = require("./twitter");

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

// Route homepage

app.get("/api/city/me", async (request, response) => {
    const cityResults = await getTweets("polizeiberlin");
    console.log("cityResults no.", cityResults.length);
    response.json(cityResults);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
