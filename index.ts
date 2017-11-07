#!/usr/bin/env node

import * as Twitter from "twitter";

const client = new Twitter({
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
});

function getFollowers(result: string[], cursor: number, callback: () => void) {
    client.get("followers/list", { skip_status: true, count: 200, cursor }, (error, response) => {
        if (error) {
            console.log(error);
            return;
        }

        for (const user of response.users) {
            result.push(user.screen_name);
        }

        console.log(response.next_cursor);
        if (response.next_cursor === 0) {
            callback();
        }
        else {
            getFollowers(result, response.next_cursor, callback);
        }
    });
}

const followers: string[] = [];
getFollowers(followers, -1, () => { console.log(`followers count ${followers.length}`); });
