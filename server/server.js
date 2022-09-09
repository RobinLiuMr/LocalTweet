const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

const { getTweets } = require("./twitter");
const sources = require("./city-important-info-twitters.json");

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

// Route search

app.get("/api/twitters/search", async (request, response) => {
    let queryCity = request.query.q;

    const supportCity =
        null ||
        sources.find(
            ({ city }) => city.toLowerCase() === queryCity.toLowerCase()
        );
    console.log("supportCity", supportCity);

    if (!supportCity) {
        response.json(null);
        return;
    }

    request.session.current_city = supportCity;

    const { screen_names } = supportCity;

    const tasks = screen_names.map((screen_name) => getTweets({ screen_name }));

    let searchResults = await Promise.all(tasks);

    console.log("searchResults length", searchResults.length);
    response.json(searchResults);
});

// Route more
app.get("/api/twitters/more", async (request, response) => {
    const { screen_names } = request.session.current_city;

    const tasks = screen_names.map((screen_name) =>
        getTweets({ screen_name, LIMIT: 6 })
    );

    // getTweets({ screen_name, LIMIT: request.query.limit }); backup for ...more option

    let moreResults = await Promise.all(tasks);

    console.log("moreResults length", moreResults.length);
    response.json(moreResults);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
