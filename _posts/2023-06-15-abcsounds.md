---
title: "Web App to Teach Children Letter Sounds"
layout: post
date: 2023-06-14 07:00
image: 
headerImage: true
projects: true
hidden: true
description: "After I couldn't find any free sites to teach my cousin the letter sounds I created one myself. "
category: project
author: ioannis
externalLink: false
---

Around three months ago, I was on the couch with my five year old cousin, Chrysa. I was trying to teach her how to read so I pulled The Art of War by Sun Tzu off the shelf. Just kidding, I grabbed a book called Hug by Jez Alborough. 

The whole book is basically the word "hug", but the words "Bobo" and "Mommy" also make an appearance. I thought this would be great for her. It started out a little rough. Even though the first eight words of the book stayed "hug", she would still say another word like "leg" or "tree" until we were about four words in. 

Once she finally got the hang of sounding out the letters it was smooth sailing. 

Until we got to the word "Bobo". 

My memory is faulting on me but I'm pretty sure she said "hug" for this one too. AGHH. I asked her what sound the letter "B" made, she said "I don't know". I told her "buh", I asked her what sound the "o" makes she said "I don't know", I told her "oh". I'm not sure if she remembered the sounds for the second part of "Bobo", but I know that she had trouble putting all the letter sounds together to form the whole word. 

Looking back, it's interesting that she doesn't know how to read because I read a lot and take the act of putting the sounds that the letters in a word make together for granted. While Chrysa, who isn't capable of doing that yet is struggling. Just like anyone who doesn't know something struggles to learn. Like someone who picks up a skateboard for the first time wobbles on it because they haven't learned to balance on it yet.

Anyways, at this point my brother Christianos and cousin Caleb wanted me to play with them so I started looking for a tool online Chrysa could use to learn the sounds of the letters. Sort of like the caterpillar toy from leap frog that Christianos got when he was around three years old that would say the letters of the alphabet when it's feet were pushed down. And then if the toggle was switched to letter sounds it would pronounce the letter sounds.

![alphabet pal](https://static.wikia.nocookie.net/leapfrog/images/a/af/Green_pillar.jpg)

I wanted to find that, but an online version. I couldn't find anything free that required no sign up in the ten minutes that I looked for it. So, I decided to make one. And since Christianos and Caleb were bugging me, I would use them as my ~~slaves~~ voice actors.

To best capture their voice acting abilities, I used Audacity. It took about twenty minutes for Christianos to record all the letter names and another twenty minutes for Caleb to record the letter sounds. I exported all the recordings as mp3 as that had the best compatibility with most browsers.

Christianos and Caleb had the sound bites down, now I needed pretty graphics for the website. I asked my girlfriend Theresa to make the letters for me and they came out pretty great! She made them in Adobe Illustrator and exported them as pngs for the transparent background.

I had the pretty letters and all the audio files. All that was left was to put everything together using good ol' html/css/javascript. I was rushing to put everything together so I thought this stack was perfect for a simple and stateless application. I didn't want the overhead of using a javascript framework to make this simple app. Although, eventually I'd like to repeat this site in Svelte just to get some exposure to the framework, as I already have experience with Angular and React.

To serve the application, I used a simple nodejs express server running on my $5 a month linode debian vm. I know, I know, why am I running a nodejs express server instead of using nginx or apache to serve the static files? Because I was too lazy to write an nginx directive to route the requests to the right directory. 

Plus, I already have a system set up with my numerous other side projects that all use cloudflare to mask my the IP and to turn everything into https. Letsencrypt for the ssl certificates, and nodejs to host apis or static files. Nginx for the reverse proxy. Maybe once I feel like it, or something goes viral I'll do it the right way and serve static files through nginx. But until then I'll deal with the minuscule performance consequences.

So now that I had this whole thing built it was time for the cousins to go home. Chrysa wasn't able to use it that night. But from what I've heard she used [abcsounds](https://abcsounds.ioannis.ky) around two weeks ago to read another book with minimal help.

