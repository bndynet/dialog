# Dialog

[Demo](https://bndynet.github.io/dialog/site/) |
[API Docs](https://bndynet.github.io/dialog/api/) |
[Themes](https://bndynet.github.io/dialog-themes)

[![npm](https://img.shields.io/npm/v/@bndynet/dialog.svg)](https://www.npmjs.com/package/@bndynet/dialog)
[![Build Status](https://travis-ci.com/bndynet/dialog.svg?branch=master)](https://travis-ci.com/bndynet/dialog)
[![Coverage Status](https://coveralls.io/repos/github/bndynet/dialog/badge.svg?branch=master)](https://coveralls.io/github/bndynet/dialog?branch=master)
[![Code Styles](https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg)](https://github.com/prettier/prettier)

An interactive dialog includes alert, confirm and notification like toaster. But can be used in Browser and TypeScript project.

## Getting Started

### For SPA (Single Page Application)

Use `npm install @bndynet/dialog` to install package, and import them like below:

```typescript
import { alert, confirm, notify, loading, loadingFor, iframe } from "@bndynet/dialog";
```

### For Website

The UMD build is also available on unpkg.com, and you can add to your website like:

```html
<!--
    bootstrap is optional, you can define your styles
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css">
-->

<link href="https://unpkg.com/@bndynet/dialog/dist/dialog.css" rel="stylesheet" type="text/css" />
<script src="https://unpkg.com/@bndynet/dialog/dist/dialog.umd.js"></script>

<script>
    dialog.setup({
        theme: "your-theme",    // will be appended the `class` attribute of `body` tag
        labelOK: "OK",
        labelCancel: "Cancel",
        animate: true,
        notificationAutoClose: true,
        notificationClickClose: true,
        notificationCloseDelay: 3000,
        notificationTheme: "default",
        notificationPlacement: "bottom right",
        notificationMaxItems: 3,
        notificationSquare: false
    });

    dialog.alert("content", function() {});
    dialog.alert("title", "content", function() {});

    dialog.confirm("content", function() {});
    dialog.confirm("title", "content", function() {});

    dialog.notify("Message"[, "success"|"warning"|"error"]);
    dialog.notify({message: "message", theme: "success"});

    dialog.loading();
    dialog.loading(false);  // hide the global loading box
    dialog.loading({text: "Loading"});

    dialog.iframe('http://bndy.net', 'Title'[, {width: '80%', height: '80%'}]);

    // loading box for element
    var elLoading = dialog.loadingFor("#id", "Loading...", "#00ff00");
    elLoading.hide();
</script>
```