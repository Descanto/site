---
title: How Botto keeps your credentials on your machine
description: "The inference proxy pattern: cloud harnesses call back to your device, never the reverse."
category: Engineering
date: 2026-08-20
---

When a Bot works on its cloud computer, the harness there still needs to think — and thinking means calling an AI model with your subscription. The obvious design copies your credentials to the cloud. We refused to build that.

Instead, cloud harnesses make inference calls *back to the daemon on your machine*, which holds the credentials and forwards the request. Your keys never leave the device you control. If you unplug it, the Bots stop thinking. That's the point.
