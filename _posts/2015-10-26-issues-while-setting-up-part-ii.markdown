---
layout: post
title: "Issues while setting up, Part II"
date: "2015-10-26 8:46 PM"
---

I installed the [Jekyll-Atom](https://atom.io/packages/jekyll) package because it came with some nice tools for managing Jekyll. However, it created an awkward problem: due to the way that the addon timestamps posts, and the way that Jekyll sorts them, it meant that posts created on the same day did not display in descending order. Newer posts would be displayed later.

There are probably some good arguments for keeping it this way, but I wanted it to be completely in descending order. So I changed the Jekyll-Atom addon so it includes the hour, minute, and period (AM/PM). This had to be made separately from the post's filename, because when I tried including the time in that, Jekyll ignored the file. This could be due to Jekyll explicitly expecting a date at the start of the filename, or it might be because it doesn't like spaces, I haven't tested that yet.

At any rate, this has made think of a number of improvements that can be made to the addon, such as more flexible post composition, publishing written drafts as a post, and a helper for the configuration file. It would also be nice if creating a post automatically added it to the repository (if that is possible).
