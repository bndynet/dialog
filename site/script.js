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

