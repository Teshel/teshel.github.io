---
layout: post
title: "Navbar and Collections difficulties"
date: "2015-10-28 9:02 PM"
---

It was relatively easy to create and add the navigation bar at the top, which is a static list of three sections of the site. Adding a collection for my Projects was fairly straightforward as well. I just put each item in the collection as a markdown file in `_projects/`. But making the index was a little confusing and I'm still not sure why it wasn't working at first.

Originally I made the mistake of putting an `index.html` inside both `projects/` and `_projects/`, with the former actually having some content. Jekyll's local development server didn't complain and rendered the page just as I wanted it. But when I deployed here to Github Pages, the Projects page ended up completely blank. That's when I noticed what I'd done, so I tried moving the correct index.html into `_projects/` alongside a demo project file (`test.md`). No luck, it still was displaying blank, even after sending an empty commit to force a rebuild. So I searched around and found a single reference from last year that said that Github Pages didn't yet support having static files inside collections. Maybe this meant any `.html` file, even those with Liquid templating? That didn't seem likely, and anyway this was a problem a whole year ago, so it must have been fixed by now, right? But I moved index.html out of `_projects/`  and into the root directory anyway, while renaming it `projects.html`. Still blank.

After taking a short nap I tried simply making a `test.html` in the root directory to see if it would display right. It worked fine, and all of sudden Projects started working too. No idea what fixed it. GH-Pages seems very random at times.
