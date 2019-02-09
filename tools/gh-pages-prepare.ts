const fs = require("fs");
const sh = require("shelljs");

sh.echo("⚑ gh-pages preparing...");

sh.cp("-R", "./site", "./docs/site");
sh.cd("./docs/site");
sh.ls("*.html").forEach((file: string) => {
    let data = fs.readFileSync(file, "utf8");
    // remove <!-- dev --> ... <!-- /dev --> lines
    data = data.replace(/<!--\s*dev\s*-->[\s\S]*?<!--\s*\/dev\s*-->/ig, "");
    // uncomment <!-- prod ... -->
    data = data.replace(/<\!--\s*prod\s*([\s\S]*?)-->/ig, "$1");
    fs.writeFileSync(file, data, (werr:any) => {
        if (werr) {
            throw werr;
        }
    });
});
sh.cd("../../");

sh.cd("./docs");
fs.writeFileSync("index.html", "<script>location.href=\"site\";</script>");
sh.cd("../");

sh.echo(`✔ done at ${new Date().toISOString()}`);