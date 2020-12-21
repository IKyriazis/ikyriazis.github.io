---
title: "Enlighten Me"
layout: post
date: 2020-10-21 07:00
image: 
headerImage: true
projects: true
hidden: true
description: "What started off as a hackathon idea became my group's WebWare final project"
category: project
author: ioannis
externalLink: false
---

#Enlighten Me

[enlighten-me](enlightenme.ioannis.ky) is a platform where people go to debate controversial topics. Each round of debate
lasts five minutes. Before each round, the user votes on whether they agree with the published topic. During the round, users
send chats to whoever is logged into the site and they can up or down -vote individual messages. After the round ends, the user
votes on whether they agree on the topic again to see whether they've changed their mind. They also vote on which category the next
controversial topic will be from. After this, the statistics from the round are displayed and the new round begins.

Below are images of the platform.

The Homepage:
![Homepage](/assets/images/enlighten-me/homepage.PNG)

The Pre-Round Voting:
![Pre-Round Voting](/assets/images/enlighten-me/pre_vote.jpg)

The Chatting:
![Chatting](/assets/images/enlighten-me/chatting.jpg)

The Post-Round Voting:
![Post-Round Voting](/assets/images/enlighten-me/post_vote.jpg)

The Statistics:
![Statistics](/assets/images/enlighten-me/stats.jpg)

#How It Was Built

Originally, this started out as a project for [hackMIT](https://hackmit.org/) in Python using Flask. Then, for a group project
in my WebWare class, we ported the application over to NodeJS and added more features to satisfy the group project requirements.
The code is stored [here](https://github.com/IKyriazis/enlighten-me). We used the following technologies:
- NodeJS to implement the server logic
- MongoDB to store users
- HTML/CSS/Bootstrap/JavaScript to create the frontend
- WebSockets to implement the chat and voting

