#!/usr/bin/env node

import { Buffer } from "buffer";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { setImmediate } from "timers";
import * as url from "url";

import * as Commander from "commander";
import * as lodash from "lodash";

import ExportFormat from "./exportFormat";
import User from "./user";

function getExtension(contentType: string | string[]): string {
    switch (contentType) {
        case "image/jpeg":
            return "jpg";
        case "image/png":
            return "png";
        default:
            return "";
    }
}

export function createDownloadQueue(followers: User[], friends: User[]): User[] {
    const userComparator = (a, b) => a.screen_name === b.screen_name;

    const downloadQueue = lodash.unionWith(
        lodash.cloneDeep(
            followers.slice(0, 10) // TODO: デバッグが終わったらsliceを外す
        ),
        lodash.cloneDeep(
            friends.slice(0, 10) // TODO: デバッグが終わったらsliceを外す
        ),
        userComparator
    );

    return downloadQueue;
}

export function createDownloader(downloadQueue: User[], imageDir: string) {
    let downloadCount: number = 0;

    const download = () => {
        const target = downloadQueue.shift();
        if (!target) {
            return;
        }

        const screenName: string = target.screen_name;
        const imageUrl: string = target.profile_image_url;
        console.log(`[${downloadCount}] download ${imageUrl}`);
        http.get(imageUrl, (res) => {
            downloadCount++;
            if (res.statusCode !== 200) {
                console.log(`download ${imageUrl} failed. statusCode=${res.statusCode}`);
                setImmediate(download);
                return;
            }

            const contentType = res.headers["content-type"];
            const extension: string = getExtension(contentType);
            if (extension === "") {
                console.log(`Unsupported content-type: ${contentType}`);
                setImmediate(download);
                return;
            }

            const chunks: Buffer[] = [];
            res.on("data", (chunk: Buffer) => {
                chunks.push(chunk);
            });
            res.on("end", () => {
                const filename = `${screenName}.${extension}`;
                const imageData = Buffer.concat(chunks);
                fs.writeFileSync(path.join(imageDir, filename), imageData);
                console.log(`${filename} saved.`);
                setImmediate(download);
            });
        });
    };

    return download;
}

if (require.main === module) {
    Commander
        .option("--input <file>")
        .parse(process.argv);

    function createImageDir(imageDir: string) {
        if (fs.existsSync(imageDir)) {
            if (fs.statSync(imageDir).isDirectory() === false) {
                throw new Error("directory name already used");
            }
            fs.accessSync(imageDir, fs.constants.W_OK);
        }
        else {
            fs.mkdirSync(imageDir);
        }
    }

    try {
        const input = fs.readFileSync(Commander.input, { encoding: "utf8" });
        const data: ExportFormat = JSON.parse(input);

        const downloadQueue = createDownloadQueue(data.followers, data.friends);

        const imageDir = path.join(process.cwd(), "images");
        createImageDir(imageDir);

        const download = createDownloader(downloadQueue, imageDir);
        download();
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
