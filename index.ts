#!/usr/bin/env node

import * as Twitter from "twitter";

const client = new Twitter({
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
});

function getFollowers() {
    return new Promise<string[]>((resolve, reject) => {
        const followers: string[] = [];

        function getFollowersInternal(cursor: number) {
            client.get("followers/list", { skip_status: true, count: 200, cursor }, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }

                for (const user of response.users) {
                    followers.push(user.screen_name);
                }

                console.log(response.next_cursor);
                if (response.next_cursor === 0) {
                    resolve(followers);
                }
                else {
                    getFollowersInternal(response.next_cursor);
                }
            });
        }

        getFollowersInternal(-1);
    });
}

getFollowers().then(
    (followers: string[]) => { console.log(`followers count ${followers.length}`); }
).catch(
    (error) => { console.log(error); }
);
