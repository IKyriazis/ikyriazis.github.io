---
title: "Canvas Kicks Business Page"
layout: post
date: 2020-12-24 07:00
headerImage: true
projects: true
hidden: true
description: "A business site for Canvas Kicks"
category: project
author: ioannis
externalLink: false
---

![First three posts](/assets/images/canvaskicks/first3posts.jpg)

I created this business site for [Canvas Kicks](https://canvaskicks.store). Prospective clients go to this site
so they can see previous completed orders and get an idea of what Canvas Kicks can paint. Users can also contact
Canvas Kicks through the "Message Me!" link in the navbar.

Here are some features of the site that I'd like to point out.

First, we have the ability to add comments to a post. To add a comment, a user must be signed in to the website. A user can
log in through the interface in the top right of the [Completed orders page](https://canvaskicks.store/prevWorks.html).
Below shows what happens if the "Show Comments" button is pressed.

![Showwing comments](/assets/images/canvaskicks/show_comments.jpg)
The comments go away when the "Hide Comments" button is pressed.

Posts can include more than one photo. The images below shows what a post with multiple photos looks like.

![Multi photo](/assets/images/canvaskicks/multi_photo1.jpg)

If you press the right arrow the second image appears, as shown below.

![Multi photo 2](/assets/images/canvaskicks/multi_photo2.jpg)

As I mentioned earlier, clients can also send a message to Canvas Kicks through the [Message Me! page](https://canvaskicks.store/messageme.html).
Below is a screenshot of the page.

![Message Me! page](/assets/images/canvaskicks/send_message.jpg)

To make adding posts to the website as easy as possible (no programming experience needed), I created an interface for
Canvas Kicks to log into to see messages, add posts, edit posts, and delete posts. Below is a screenshot of the interface.

![Owner dashboard](/assets/images/canvaskicks/owner_dashboard.jpg)

## How I Built It

The backend is written in NodeJS. I can't disclose the source code because there is sensitive information (like database access links).
If you want to see specific parts of the code contact me through the methods found [here](https://ioannis.ky/).

I use MongoDB as the database to store comments, users, messages and posts. In the database a post includes four fields: a post title,
a date, a price, and the images field. The images field is a string that includes the location of the image that was uploaded with the post.
If multiple images were uploaded with the post, the images field is a string of multiple locations of each image separated
by a comma. Images are stored on the server.

The frontend was written in HTML/CSS/JavaScript and uses Bootstrap for the navbar, buttons, multiple images per post, etc..

The NPM module I use to handle image uploads is [multer](https://www.npmjs.com/package/multer). I set the maximum images for
each post to be 10. In other words, a post can have no more than 10 images. When the POST request to add a post is received
at the server, multer makes it very easy to parse the request data and save images to the server.

