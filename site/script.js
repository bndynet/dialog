dialog.setup({
    labelOK: "确定",
    labelCancel: "取消",
});

dialog.loading({text: "Loading"});
axios.get("../README.md").then(function(response) {
    var converter = new showdown.Converter();
    document.getElementById("readme").innerHTML = converter.makeHtml(response.data);
    setTimeout(() => {
        dialog.loading(false);
    }, 2000);
});

let urlChangelog = "../CHANGELOG.md";
// always get the online CHANGELOG.md
const exp = /https:\/\/(\w+).github.io\/([^\/]+)/i;
const matches = location.href.match(exp);
if (matches && matches.length >= 3) {
    urlChangelog = "https://raw.githubusercontent.com/" + matches[1] + "/" + matches[2] + "/master/CHANGELOG.md";
}
axios.get(urlChangelog).then(function(response) {
    var converter = new showdown.Converter();
    document.getElementById("changelog-body").innerHTML = converter.makeHtml(response.data);
});
