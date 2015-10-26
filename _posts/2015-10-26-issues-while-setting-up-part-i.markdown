---
layout: post
title: "Issues while setting up, Part I"
date: "2015-10-26"
---
Learning the ins and outs of Git and Github have been on my to-do list for several years now. Basic operations seem fairly straightforward, but my knowledge is very shallow at this point, and I'm still getting used to SourceTree. I'm not clear on what the difference between staged files, unstaged files, and tracked files is, and what "Stop Tracking" does -- is it different from "Remove"?

Thanks to this unfamiliarity I failed to even see that the first post hadn't actually been committed to the repository. It hadn't been listed in the views for "Modified", "Pending", or "Ignored" files -- you have to look at "Untracked". I need to find a less tedious way to start tracking the file.

However, it seems that now that I've put \_site/ and .sass-cache/ in .gitignore, it's much easier to just look at "Untracked files" and add that.
