const express = require('express');
const app = express();
const ca = require('chalk-animation');

const { getToken, getTweets, filterTweets } = require('./twitterReq');

app.use(express.static('./ticker'));

app.get('/data.json', (req, res) => {
    ca.rainbow('/data.json hit!');

    getToken(function(err, token) {
        if (err) {
            console.log("err in getToken:", err);
            return;
        }
        // console.log("token:", token);

        ca.rainbow("callback running!");

        getTweets(token, function(err, tweets) {
            console.log("tweets:", tweets);
            if (err) {
                console.log("err in getTweets:", err);
                return;
            }
            var filteredTweets = filterTweets(tweets);

            res.json(filteredTweets);
        });
    });
});


app.listen(8080, () => ca.rainbow('listening'));
