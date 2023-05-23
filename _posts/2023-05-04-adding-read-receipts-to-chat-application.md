---
title: "How to Add Read Receipts to a Chat Application"
layout: post
date: 2023-05-04 07:00
image: 
headerImage: true
projects: true
hidden: true
description: "A walkthrough so that you can add read receipts to your chat application using NodeJS, Express, MySQL, and React Native. Follow this tutorial to allow your users to track which messages they have opened."
category: project
author: ioannis
externalLink: false
---

# Adding Read Receipts to a NodeJS, Express, React-Native, and MySQL Application

The point of this post is to explain how I implemented read receipts in my chat application using NodeJS, Express, React-Native, and MySQL as the tech stack. If you are here purely for the how-to, skip this section. Otherwise, keep reading.

Since my last post I graduated from college, was hired as a software engineer, worked for two years and was laid off last month. Over the past year I have been working on a communication application. 

The going name I am using for it is qarmagnet (pronounced carmagnet lol I know it's bad I'm trying to come up with a better one, feel free to send me a suggestion by scanning the qr code below). The app leverages qr codes to facilitate communication between strangers. The owner of the qr code downloads the app, registers their qr code under their account, and puts the qr code somewhere. 

For example, say they put it on their car. Now, if a passerby notices that the car's windows are down and there is no one in the car, they can scan the qr code with their phone and send a message directly to the owner. No logging in or downloading any apps. EZPZ. The passerby can now inform the car owner that they left the windows down and the car owner will receive the message through the app. No phone numbers or other personal identification involved.

If you want a qr code for yourself let me know by scanning the qr code down below and sending me a message.

Anyways, the inspiration for this post comes from my quest to implement read receipts. I thought it would be a cool feature to implement, and helpful to the user to see which of their qr codes have unread chats. I tried researching this process to see if there were any smarter ways to do this but I didn't find much so here's my implementation. If you have any ideas on how to make the process more efficient, let me know and I will update this post. Or you can just submit a pull request [here](https://github.com/IKyriazis/ikyriazis.github.io/blob/master/_posts/2023-05-04-adding-read-receipts-to-chat-application.md).

Message me at this qr code
[image of qr code]

## Backend Changes
To implement this functionality I had to make some changes to the table that stores all the messages and some changes to the endpoints the application uses to retrieve/send messages.

### Database Changes
Here is the current schema of the messages table:
| id           | recipient  | sender     | message_content | time     | seen    |
|--------------|------------|------------|-----------------|----------|---------|
| int unsigned | binary(16) | binary(16) | varchar(256)    | datetime | tinyint |
I added the "seen" field to the table to distinguish the read messages from the unread. I decided to use the tinyint datatype because of [this](https://stackoverflow.com/questions/289727/which-mysql-data-type-to-use-for-storing-boolean-values) StackOverflow post. So a 0 or null in the column would mean that the message is unread, and anything else would be considered read.

### NodeJS Changes
Now that I updated the messages table, I had to update some of my endpoints. This was a little tricky because there are multiple levels to this chat application. Because a user can have multiple qr codes they need to see an accurate number of unread messages for each qr code. And then once they open the qr code they need to see all the unread messages for each conversation. Here is a visual example. Take this screenshot of the home page:
[screenshot of home page with multiple qr codes with unread messages]

There are multiple qr codes with unread messages. Now if I tap on the "Tesla" qr code I can see all the conversations I have through the qr code I put on my car. 

[screenshot of tesla qr code with unread messages for each conversation but also have read conversations]

As you can see, the different conversations also have an unread messages count. 

#### /getUserQRCodes
This endpoint is responsible for populating the home screen of the app with all the qr codes that a user owns. All qr codes are stored in the mappings table:

| uuid       | label       | user        | isDeleted | dateDeleted |
|------------|-------------|-------------|-----------|-------------|
| binary(16) | varchar(32) | varchar(32) | tinyint   | datetime    |

The uuid is the unique id of the qr code, the label is the text that appears on the qr code on the home screen, the user is the username of the qr code owner, isDeleted is whether the qr code is deleted, and dateDeleted is when the qr code was deleted.

The SQL query below gets all the qr codes a user owns that aren't deleted and orders the results by the latest message to/from that qr code:
```sql
SELECT BIN_TO_UUID(uuid) as uuid, label FROM mappings ma LEFT JOIN messages me ON ma.uuid = me.recipient OR ma.uuid = me.sender WHERE ma.user = ? AND (ma.isDeleted = 0 OR ma.isDeleted IS NULL) GROUP BY ma.uuid ORDER BY MAX(me.time) DESC
```

To count all the unread messages, I had to add the following to the query: 
```sql
COUNT(CASE WHEN me.seen = 0 AND me.recipient=uuid THEN 1 END) as unread
```
The code snippet above counts all the messages with the "seen" field set to 0 that are sent to each qr code.


Together the query looks like this:
```sql
SELECT BIN_TO_UUID(uuid) as uuid, label, COUNT(CASE WHEN me.seen = 0 AND me.recipient=uuid THEN 1 END) as unread FROM mappings ma LEFT JOIN messages me ON ma.uuid = me.recipient OR ma.uuid = me.sender WHERE ma.user = ? AND (ma.isDeleted = 0 OR ma.isDeleted IS NULL) GROUP BY ma.uuid ORDER BY MAX(me.time) DESC
```





## UI Changes

## Conclusion
