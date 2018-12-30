const https = require("https");
const secrets = require("./secrets.json");

module.exports.getToken = function getToken(cb) {
    // console.log("secrets:", secrets);
    var concatCred = secrets.consumerKey + ":" + secrets.consumerSecret;
    // console.log('concatCred:', concatCred);
    var encodedCreds = new Buffer(concatCred).toString("base64");
    // console.log('encodedCreds:', encodedCreds);

    let options = {
        method: "POST",
        host: "api.twitter.com",
        path: "/oauth2/token",
        headers: {
            authorization: "Basic " + encodedCreds,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
    };
    let callback = resp => {
        if (resp.statusCode != 200) {
            // console.log("something went wrong!", resp.statusCode);
            cb(resp.statusCode);
            return;
        }
        let body = "";

        resp.on("data", chunk => {
            body += chunk;
        });
        resp.on("end", () => {
            // console.log(("body:", body));
            let parsedBody = JSON.parse(body);
            // console.log('parsedBody:', parsedBody.access_token);
            let bearerToken = parsedBody.access_token;
            // console.log('bearerToken:', bearerToken);
            cb(null, bearerToken);
        });
    };

    const req = https.request(options, callback);
    req.write("grant_type=client_credentials");
    req.end();
};

module.exports.getTweets = function getTweets(bToken, cb) {
    console.log("bToken:", bToken);

    let options = {
        method: "GET",
        host: "api.twitter.com",
        path: "/1.1/statuses/user_timeline.json?count=20&screen_name=CNBC",
        headers: {
            authorization: "Bearer " + bToken
        }
    };
    let callback = resp => {
        if (resp.statusCode != 200) {
            // console.log("something went wrong!", resp.statusCode);
            cb(resp.statusCode);
            return;
        }
        let body = "";

        resp.on("data", chunk => {
            body += chunk;
        });
        resp.on("end", () => {
            // console.log(("body:", body));
            let parsedBody = JSON.parse(body);
            // console.log('parsedBody:', parsedBody.access_token);

            cb(null, parsedBody);
        });
    };

    const req = https.request(options, callback);
    req.end();
};

module.exports.filterTweets = function filterTweets(tweets) {
    let filteredTweets = [];

    for (let i = 0; i < tweets.length; i++) {
        let obj = {};
        if (tweets[i].entities.urls.length == 1) {

            obj.headline = tweets[i].text.replace(
                /(?:https?|ftp):\/\/[\n\S]+/g,
                ""
            );
            obj.url = tweets[i].entities.urls[0].url;

            filteredTweets.push(obj);
        } else {
            continue;
        }
    }
    console.log(filteredTweets);
    return filteredTweets;
};
