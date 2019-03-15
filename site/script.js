dialog.setup({
    labelOK: "确定",
    labelCancel: "取消",
    animate: true,
});

axios.get("../README.md").then(function(response) {
    var converter = new showdown.Converter();
    document.getElementById("readme").innerHTML = converter.makeHtml(response.data);
});