---
title: "Integrate Admidio and Stripe for Minimum-Cost Club Membership Payments"
layout: post
date: 2024-11-20 07:00
image: 
headerImage: true
projects: true
hidden: true
description: "Follow this tutorial to set up Stripe with Admidio, a free and open source self hosted club membership platform."
category: project
author: ioannis
externalLink: false
---

# Introduction

If you manage a club, association, or any big group of people I hope you've heard about Admidio. It's the free WildApricot. Why pay $96 a month for the lowest tier of WildApricot when you can self host Admidio for free! Anyways, since I was elated when I found an alternative to WildAPricot because I didn't want to spend $96 a month managing my club.

Admidio is free and open source software that is actively maintained and has a community. It is the perfect hub for your membership needs. It has an announcements page where you can update your community with important posts, an events page to let the community members when your club is hosting events, a messaging system that lets members chat. It has file uploads so that members can share photos and documents. And many tools for the administrator to manage the club.

Admidio also has many plugins that include additional functionality. For example, the membership fee plugin. With this plugin, you can track members who have and haven't paid for their membership fee. This lets you use Admidio as a central hub for managing all aspects of your club, even financial.

The one thing the membership fee plugin lacks is a payment processer integration. Which is understandable, as this project is available for free and the principal maintainer has limited time resources. Good news though! I added stripe to accept payments and update the members' statuses all automatically and you can to if you follow the instructions below.

# Instructions

This tutorial assumes you already have [Admidio](https://www.admidio.org/dokuwiki/doku.php?id=en:2.0:installation) and the membership fee [plugin](https://www.admidio.org/dokuwiki/doku.php?id=en:plugins:mitgliedsbeitrag) already installed. If anything is confusing here reach out to me.

## Add a "Donate Now" link to the modules sidebar.
<!-- add image of link -->

## 