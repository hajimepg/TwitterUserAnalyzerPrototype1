#!/usr/bin/env node

import { Buffer } from "buffer";
import * as fs from "fs";
import * as http from "http";
import * as url from "url";

import * as Commander from "commander";

import ExportFormat from "./exportFormat";
import User from "./user";

Commander
    .option("--input <file>")
    .parse(process.argv);

try {
    const input = fs.readFileSync(Commander.input, { encoding: "utf8" });
    const data: ExportFormat = JSON.parse(input);

    const screenName: string = data.followers[0].screen_name;
    const imageUrl: string = data.followers[0].profile_image_url;
    console.log(imageUrl);
    http.get(imageUrl, (res) => {
        if (res.statusCode !== 200) {
            return;
        }

        const contentType = res.headers["content-type"];
        let extension: string;
        switch (contentType) {
            case "image/jpeg":
                extension = "jpg";
                break;
            case "image/png":
                extension = "png";
                break;
            default:
                console.log(`Unsupported content-type: ${contentType}`);
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
        });
    });
}
catch (e) {
    console.error(e);
    process.exit(1);
}
