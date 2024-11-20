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

This tutorial assumes you already have [Admidio](https://www.admidio.org/dokuwiki/doku.php?id=en:2.0:installation) and the membership fee [plugin](https://www.admidio.org/dokuwiki/doku.php?id=en:plugins:mitgliedsbeitrag) already installed. You also need a Stripe account with at least one subscription product defined. If anything is confusing here reach out to me.

## Add a "Donate Now" link to the modules sidebar.
<!-- add image of link -->

## Make the Payment Portal

For this step I will be using the [Astro](https://astro.build) web framework to build the payment portal because it's my favorite web framework, if you have a programmer background use whatever framework you want, the concepts are all the same anyways. For this, you'll need to install [Node.js](https://nodejs.org/en). Once you have it installed, run the following in the terminal.

```bash
npm create astro@latest
```

Just select all the default options when asked.

### Create Landing Page

Now that you have a fresh Astro project we have to fill out the landing page. Here's what index.astro should be filled out with. Careful though, there are club specific things that you will need to replace for it to make sense for your own club. Also, get rid of all the css in the Layout.astro file.

```Astro
---
import Layout from '../layouts/Layout.astro';
const id = Astro.url.searchParams.get('id') || '';
// replace URL with your URL
let response = await fetch(`https://<URL>/api/get-data`, {
	method: "POST",
	headers: {
		"Accept": "application/json",
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		id
	}),
});

response = await response.json();

if (response.message === "success") {
	return Astro.redirect(response.stripe);
}

---

<Layout title="Payment Portal">

    <!-- Replace all the text below with your own custom text, this is displayed when a member has already paid -->
	<div class="container" role="presentation">
        <!-- Header Section -->
        <header class="header" role="banner">
            <h1>Thank You For Donating</h1>
        </header>

        <!-- Body Section -->
        <main class="body" role="main">
            <p>You're donation means a lot. <strong>The club</strong> is happy to have you as a member.</p>
            <p>We're looking forward to seeing you at our upcoming events.</p>
        </main>

        <!-- Call-to-Action -->
        <div class="cta-container">
            <a href="<REPLACE WITH YOUR DONATION LINK>" class="cta-button" aria-label="Donate Again">Donate Again</a>
        </div>

        <!-- Footer Section -->
        <!-- <footer class="footer" role="contentinfo">
            &copy; 2024 Your Company | <a href="#" aria-label="View Privacy Policy">Privacy Policy</a> | <a href="#" aria-label="Unsubscribe from Emails">Unsubscribe</a>
        </footer> -->
    </div>
</Layout>

<style>
	/* Global Styles */
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

	body {
		margin: 0;
		padding: 0;
		font-family: 'Roboto', Arial, sans-serif;
		background-color: #121212;
		color: #e0e0e0;
		line-height: 1.6;
	}
	.container {
		max-width: 600px;
		margin: 50px auto;
		background: #1e1e1e;
		border-radius: 16px;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
		overflow: hidden;
		border: 1px solid #333;
		animation: fadeIn 1s ease;
	}

	/* Animation */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Header Section */
	.header {
		background: linear-gradient(135deg, #6a1b9a, #8e24aa);
		color: white;
		text-align: center;
		padding: 50px 20px;
	}
	.header h1 {
		margin: 0;
		font-size: 28px;
		font-weight: bold;
		letter-spacing: 1px;
	}
	.header p {
		font-size: 16px;
		margin-top: 10px;
		opacity: 0.9;
	}

	/* Body Section */
	.body {
		padding: 30px 20px;
		text-align: center;
	}
	.body p {
		margin: 10px 0;
		font-size: 18px;
		color: #bdbdbd;
	}
	.body strong {
		color: #8e24aa;
	}

	/* Call-to-Action Button */
	.cta-container {
		text-align: center;
		margin: 20px 0;
	}
	.cta-button {
		display: inline-block;
		padding: 15px 40px;
		background: #6a1b9a;
		color: white;
		font-size: 16px;
		font-weight: bold;
		text-transform: uppercase;
		text-decoration: none;
		border-radius: 30px;
		box-shadow: 0 6px 15px rgba(106, 27, 154, 0.4);
		transition: all 0.3s ease;
	}
	.cta-button:hover {
		background: #4a0072;
		box-shadow: 0 8px 20px rgba(74, 0, 114, 0.6);
	}

	/* Footer Section */
	.footer {
		background: #212121;
		text-align: center;
		padding: 20px;
		font-size: 14px;
		color: #757575;
		border-top: 1px solid #333;
	}
	.footer a {
		color: #8e24aa;
		text-decoration: none;
		font-weight: bold;
	}
	.footer a:hover {
		text-decoration: underline;
	}

	/* Responsive Design */
	@media (max-width: 600px) {
		body {
			padding: 10px;
		}
		.container {
			margin: 20px auto;
		}
		.header h1 {
			font-size: 24px;
		}
		.header p {
			font-size: 14px;
		}
		.body {
			font-size: 16px;
			padding: 20px;
		}
		.cta-button {
			font-size: 14px;
			padding: 12px 30px;
		}
	}
</style>

```

### Create Endpoint to Redirect To Stripe Checkout Session

#### Connect to Admidio Database

### Create Stripe Webhook Endpoint To Update Admidio Database

##### Connect to Admidio Database
