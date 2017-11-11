#!/usr/bin/env node

import { Buffer } from "buffer";
import * as fs from "fs";
import * as http from "http";

import * as Commander from "commander";

import ExportFormat from "./exportFormat";
import User from "./user";

Commander
    .option("--input <file>")
    .parse(process.argv);

try {
    const input = fs.readFileSync(Commander.input, { encoding: "utf8" });
    const data: ExportFormat = JSON.parse(input);

    const url: string = data.followers[0].profile_image_url;
    console.log(url);
    http.get(url, (res) => {
        if (res.statusCode !== 200) {
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
            fs.writeFileSync("image.jpg", imageData);
        });
    });
}
catch (e) {
    console.error(e);
    process.exit(1);
}
