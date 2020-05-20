const fs = require("fs");
const express = require("express");
const router = express.Router();
const https = require("https");
const URL =
    "https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences";
const match = require("./match.js");

router.get("/get_conf", (req, res) => {
    https.get(URL, resp => {
        let body = "";
        resp.on("data", data => (body += data));

        resp.on("end", () => {
            try {
                const write_stream = fs.createWriteStream("list.txt");
                let json = JSON.parse(body);
                let map = [];

                for (let x in json) {
                    for (let t = 0; t < json[x].length; ++t) {
                        var written = "";
                        var matched = "";
                        for (let xx in json[x][t]) {
                            written += `${xx}: ${json[x][t][xx]}\n`;
                            if (xx !== "conf_name")
                                matched += `${xx}: ${json[x][t][xx]}\n`;
                        }
                        // console.log(json[x][t]["confName"]);
                        written += "\n\n\n\n";
                        // Check for duplicates.

                        if (!map[written]) {
                            write_stream.write(written);
                            map[written] = written;
                        }
                    }
                }

                for (let x in json) {
                    for (let t = 0; t < json[x].length; ++t) {
                        for (let xx in json) {
                            if (x != xx) {
                                for (let tt = 0; tt < json[xx].length; ++tt) {
                                    let sim = match(
                                        JSON.stringify(json[x][t]),
                                        JSON.stringify(json[xx][tt])
                                    );
                                    if (sim > 0.5) {
                                        // json[x][t] and json[xx][tt] have a match probability greater than 0.5 and they aren't the same objects.
                                    }
                                }
                            }
                        }
                    }
                }
                return res.json({ json });
            } catch (error) {
                console.error(error.message);
            }
        });
    });
});

module.exports = router;
