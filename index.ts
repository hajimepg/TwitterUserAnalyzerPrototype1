#!/usr/bin/env node

import * as Commander from "commander";
import * as Twitter from "twitter";

Commander
    .option("--use-stub", "Get data from stub instead Twitter API")
    .parse(process.argv);

let client: { get };

if (Commander.useStub) {
    client = {
        get: (endpoint: string, parameters: { cursor }, callback: (error, response) => void) => {
            if (endpoint === "followers/list") {
                if (parameters.cursor === -1) {
                    callback(null, {
                        next_cursor: 1,
                        users: [
                            { screen_name: "user1"},
                            { screen_name: "user2"},
                            { screen_name: "user3"},
                            { screen_name: "user4"},
                            { screen_name: "user5"},
                        ]
                    });
                }
                else if (parameters.cursor === 1) {
                    callback(null, {
                        next_cursor: 2,
                        users: [
                            { screen_name: "user6"},
                            { screen_name: "user7"},
                            { screen_name: "user8"},
                            { screen_name: "user9"},
                            { screen_name: "user10"},
                        ]
                    });
                }
                else if (parameters.cursor === 2) {
                    callback(null, {
                        next_cursor: 0,
                        users: [
                            { screen_name: "user11"},
                            { screen_name: "user12"},
                            { screen_name: "user13"},
                        ]
                    });
                }
                else {
                    callback(new Error(`Invalid cursor(${parameters.cursor})`), null);
                }
            }
            else if (endpoint === "friends/list") {
                if (parameters.cursor === -1) {
                    callback(null, {
                        next_cursor: 1,
                        users: [
                            { screen_name: "user1"},
                            // { screen_name: "user2"},
                            { screen_name: "user3"},
                            // { screen_name: "user4"},
                            { screen_name: "user5"},
                        ]
                    });
                }
                else if (parameters.cursor === 1) {
                    callback(null, {
                        next_cursor: 2,
                        users: [
                            { screen_name: "user6"},
                            // { screen_name: "user7"},
                            { screen_name: "user8"},
                            // { screen_name: "user9"},
                            { screen_name: "user10"},
                        ]
                    });
                }
                else if (parameters.cursor === 2) {
                    callback(null, {
                        next_cursor: 0,
                        users: [
                            { screen_name: "user11"},
                            { screen_name: "user12"},
                            // { screen_name: "user13"},
                            { screen_name: "user14"},
                            { screen_name: "user15"},
                        ]
                    });
                }
                else {
                    callback(new Error(`Invalid cursor(${parameters.cursor})`), null);
                }
            }
        }
    };
}
else {
    client = new Twitter({
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    });
}

async function getFollowers() {
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

async function getFriends() {
    return new Promise<string[]>((resolve, reject) => {
        const friends: string[] = [];

        function getFriendsInternal(cursor: number) {
            client.get("friends/list", { skip_status: true, count: 200, cursor }, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }

                for (const user of response.users) {
                    friends.push(user.screen_name);
                }

                console.log(response.next_cursor);
                if (response.next_cursor === 0) {
                    resolve(friends);
                }
                else {
                    getFriendsInternal(response.next_cursor);
                }
            });
        }

        getFriendsInternal(-1);
    });
}

(async () => {
    const followers: string[] = await getFollowers();
    console.log(`followers count ${followers.length}`);

    const friends: string[] = await getFriends();
    console.log(`friends count ${friends.length}`);
})()
.catch(
    (error) => { console.log(error); }
);
