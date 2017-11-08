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

async function getUserList(endpoint: string) {
    return new Promise<string[]>((resolve, reject) => {
        const users: string[] = [];

        function getUserListInternal(cursor: number) {
            client.get(endpoint, { skip_status: true, count: 200, cursor }, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }

                for (const user of response.users) {
                    users.push(user.screen_name);
                }

                console.log(response.next_cursor);
                if (response.next_cursor === 0) {
                    resolve(users);
                }
                else {
                    getUserListInternal(response.next_cursor);
                }
            });
        }

        getUserListInternal(-1);
    });
}

async function getFollowers() {
    return getUserList("followers/list");
}

async function getFriends() {
    return getUserList("friends/list");
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
