# Dialog(WIP)

[![npm](https://img.shields.io/npm/v/@bndynet/dialog.svg)](https://www.npmjs.com/package/@bndynet/dialog)
[![Build Status](https://travis-ci.com/bndynet/dialog.svg?branch=master)](https://travis-ci.com/bndynet/dialog)
[![Code Styles](https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg)](https://github.com/prettier/prettier)

An interactive dialog includes alert, confirm and notification like toaster. But can be used in Browser and TypeScript project.

## Getting Started

### For SPA (Single Page Application)

Use `npm install @bndynet/dialog` to install package, and import them like below:

```typescript
import { alert, confirm, notfiy } from "@bndynet/dialog";
```

### For Website

The UMD build is also available on unpkg.com, and you can add to your website like:

```html
<!-- bootstrap is optional, you can define your styles
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css">
-->

<link href="https://unpkg.com/@bndynet/dialog/dist/dialog.css" rel="stylesheet" type="text/css" />
<script src="https://unpkg.com/@bndynet/dialog/dist/dialog.umd.js"></script>

<script>
    dialog.alert("content", function() {});
    dialog.alert("title", "content", function() {});

    dialog.confirm("content", function() {});
    dialog.confirm("title", "content", function() {});

    // Global settings for notification, and available options can be found at https://bndynet.github.io/dialog/interfaces/notifieroptions.html
    dialog.setNotifier({});
    dialog.notify("Message"[, "success"|"warning"|"error"]);
</script>
```