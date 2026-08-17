---
title: Forking a running computer in 225 milliseconds
description: Copy-on-write memory sharing across Firecracker microVMs, measured on real metal.
category: Engineering
date: 2026-08-18
---

A Canto fork is a full copy of a running desktop — same tabs, same processes, same logins — created in about 225 milliseconds with roughly 1.4 MB of marginal RAM per clone.

The trick is page-cache copy-on-write across Firecracker microVMs: forks share the parent generation's memory until they diverge. Twenty forks stay flat at ~225ms each. We measured this on real metal, not a whiteboard, and the numbers held across hosts.
