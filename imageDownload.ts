#!/usr/bin/env node

import * as fs from "fs";

import * as Commander from "commander";

import ExportFormat from "./exportFormat";
import User from "./user";

Commander
    .option("--input <file>")
    .parse(process.argv);

try {
    const input = fs.readFileSync(Commander.input, { encoding: "utf8" });
    const data: ExportFormat = JSON.parse(input);

    for (const user of data.followers) {
        console.log(user.profile_image_url);
    }

    for (const user of data.friends) {
        console.log(user.profile_image_url);
    }
}
catch (e) {
    console.error(e);
    process.exit(1);
}
