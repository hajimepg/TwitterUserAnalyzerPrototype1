#!/usr/bin/env node

import * as fs from "fs";

import * as Commander from "commander";
import * as Twitter from "twitter";

import Stub from "./stub";

Commander
    .option("--use-stub", "Get data from stub instead Twitter API")
    .parse(process.argv);

let client: { get };

if (Commander.useStub) {
    client = Stub;
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
    const friends: string[] = await getFriends();

    const followEachOther = followers.filter((user) => friends.includes(user));
    const followedOnly = followers.filter((user) => !friends.includes(user));
    const followOnly = friends.filter((user) => !followers.includes(user));

    /* tslint:disable:object-literal-sort-keys */
    const output = {
        followers,
        friends,
        followEachOther,
        followedOnly,
        followOnly,
    };
    /* tslint:enable:object-literal-sort-keys */

    fs.writeFileSync("./output.json", JSON.stringify(output));
})()
.catch(
    (error) => { console.log(error); }
);
