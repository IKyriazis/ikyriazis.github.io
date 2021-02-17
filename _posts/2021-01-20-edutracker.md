---
title: "EduTracker"
layout: post
date: 2021-01-20 07:00
image: 
headerImage: true
projects: true
hidden: true
description: "Tool that lets teachers keep track of participation in their classroom"
category: project
author: ioannis
externalLink: false
---

![Homepage](/assets/images/edutracker/homepage.jpg)

Over winter break I participated in [Hack the North 2021](https://hackthenorth.com/). At the hackathon, I met [Krish](https://www.linkedin.com/in/krish-chopra/) and
[Surya](https://www.linkedin.com/in/surya-vedula-6b1496168/). Together, we formed a team and ideated solutions to various problems. Krish's mom is a teacher and one of the problems
that she faces is keeping track of who participates in the zoom classroom. To solve this problem we put together [edutracker.tech](https://edutracker.tech), an
application that teachers upload a transcript of their zoom class after it ends and view the statistics of each student that attended class. Our project
tracks the following statistics for each student:
- Response duration (obtained by parsing the transcript file for times the student started and stopped speaking)
- Word count (obtained by counting all the words associated with a student)
- Responsiveness (obtained by counting how many times a student spoke after the teacher asked a question divided by total number of teacher questions)
- Key words (obtained from Microsoft Azure NLP API)
- Creativity (Graphical slider)
- Critical thinking (Graphical slider)

Below is what the teacher sees when viewing a student's statistics

![statistics](/assets/images/edutracker/statistics.jpg)

###How we built it
This project leverages multiple technologies to help teachers analyze data regarding their students. The technologies we used are listed below:

- Microsoft Azure: Web services were unfamiliar to everyone on the team. Nevertheless, this hackathon gave us a good opportunity
 to learn how to use Microsoft Azure to identify key phrases from a class recording transcript. We use the key phrases obtained
  from Microsoft Azure to remind the teacher of how each student contributed to the class when preparing grades.

- NodeJS: To upload transcripts and to get student data we used NodeJS. The frontend communicates with our NodeJS backend to
 upload the transcript file to be analyzed for student participation and then request those statistics from the teacher's portal.

HTML/CSS/JS: To build our frontend we used the classic trio of web development.

###Challenges we ran into
1) Microsoft Azure was giving us trouble when we tried to use it's speech to text services. It turns out we needed to specify
 how our .wav file was 44kHz stereo. After implementing the fix in the code, our team burst into celebration when we saw the
  spoken words print in the terminal.

2) Printing out the key phrases after they were returned from the Microsoft servers was a little bumpy. We didn’t realize 
that the calls to the Microsoft servers were asynchronous so we weren’t awaiting for their completion so our array with 
the key phrases was empty. Once we noticed that we had to wait for the Microsoft Azure functions to complete we added the
 ‘await’ keyword and our array filled up like we wanted it to.

###More information
If you like what you see, you can read more on our [devpost](https://devpost.com/software/edutracker). We even recorded
a presentation you could watch.


Future additions:
- aesthetic improvements
- persist statistics to generate graphs to visualize student participation over time
- Make responsiveness variable more accurate by checking if key phrases match teacher's question

