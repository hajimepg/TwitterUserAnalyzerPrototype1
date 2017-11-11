#!/usr/bin/env node

import * as assert from "assert";
import * as fs from "fs";

import * as Commander from "commander";
import * as DateFns from "date-fns";
import * as lodash from "lodash";
import * as Nunjucks from "nunjucks";
import * as Twitter from "twitter";

import ExportFormat from "./exportFormat";
import User from "./user";

import Stub from "./stub";

Commander
    .option("--format <format>")
    .option("--use-stub", "Get data from stub instead Twitter API")
    .parse(process.argv);

const format = Commander.format || "html";
if (format !== "json" && format !== "html") {
    console.error(`Invalid format: ${format}`);
    process.exit(1);
}

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
    return new Promise<User[]>((resolve, reject) => {
        const users: User[] = [];

        function getUserListInternal(cursor: number) {
            client.get(endpoint, { skip_status: true, count: 200, cursor }, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }

                for (const user of response.users) {
                    users.push({
                        profile_image_url: user.profile_image_url,
                        screen_name: user.screen_name,
                    });
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

function createFilename(extension: string): string {
    const currentDate: string = DateFns.format(new Date(), "YYYY-MM-DD");
    let filename: string;

    for (let i: number = 0; ; i++) {
        if (i === 0) {
            filename = `./output-${currentDate}.${extension}`;
        }
        else {
            filename = `./output-${currentDate}_${i}.${extension}`;
        }

        if (fs.existsSync(filename) === false) {
            break;
        }
    }

    return filename;
}

(async () => {
    const followers: User[] = await getFollowers();
    const friends: User[] = await getFriends();

    const userComparator = (a, b) => a.screen_name === b.screen_name;
    const followEachOther = lodash.intersectionWith(followers, friends, userComparator);
    const followedOnly = lodash.differenceWith(followers, friends, userComparator);
    const followOnly = lodash.differenceWith(friends, followers, userComparator);

    /* tslint:disable:object-literal-sort-keys */
    const output: ExportFormat = {
        followers,
        friends,
        followEachOther,
        followedOnly,
        followOnly,
    };
    /* tslint:enable:object-literal-sort-keys */

    if (format === "json") {
        const filename: string = createFilename(format);
        fs.writeFileSync(filename, JSON.stringify(output, null, 4));
    }
    else if (format === "html") {
        const filename: string = createFilename(format);
        fs.writeFileSync(filename, Nunjucks.render("output.njk", output));
    }
    else {
        assert.fail(`Unsupported output format: "${format}"`);
    }
})()
.catch(
    (error) => { console.log(error); }
);
