#!/usr/bin/env node

import { Buffer } from "buffer";
import * as fs from "fs";
import * as http from "http";
import { setImmediate } from "timers";
import * as url from "url";

import * as Commander from "commander";
import * as lodash from "lodash";

import ExportFormat from "./exportFormat";
import User from "./user";

Commander
    .option("--input <file>")
    .parse(process.argv);

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

try {
    const input = fs.readFileSync(Commander.input, { encoding: "utf8" });
    const data: ExportFormat = JSON.parse(input);

    let downloadCount: number = 0;
    const downloadQueue = lodash.cloneDeep(
        data.followers.slice(0, 10) // TODO: デバッグが終わったらsliceを外す
    );
    const download = () => {
        if (downloadQueue.length === 0) {
            return;
        }

        const target = downloadQueue.shift();
        const screenName: string = target.screen_name;
        const imageUrl: string = target.profile_image_url;
        console.log(imageUrl);
        http.get(imageUrl, (res) => {
            downloadCount++;
            if (res.statusCode !== 200) {
                console.log(`download ${imageUrl }${res.statusCode}`);
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
                console.log("chunk received");
                chunks.push(chunk);
            });
            res.on("end", () => {
                console.log("all data received");
                const imageData = Buffer.concat(chunks);
                fs.writeFileSync(`${screenName}.${extension}`, imageData);
                setImmediate(download);
            });
        });
    };
    download();
}
catch (e) {
    console.error(e);
    process.exit(1);
}
