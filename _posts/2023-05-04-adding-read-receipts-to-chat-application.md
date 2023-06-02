---
title: "Adding Read Receipts to a NodeJS, Express, React-Native, and MySQL Chat Application"
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

The point of this post is to explain how I implemented read receipts in my chat application using NodeJS, Express, React-Native, and MySQL as the tech stack. If you are here purely for the how-to, skip this section. Otherwise, keep reading.

Since my last post I graduated from college, was hired as a software engineer, worked for two years and was laid off last month. Over the past year I have been working on a communication application. 

The going name I am using for it is qarmagnet (pronounced carmagnet lol I know it's bad I'm trying to come up with a better one, feel free to send me a suggestion by scanning the qr code below). The app leverages qr codes to facilitate communication between strangers. The owner of the qr code downloads the app, registers their qr code under their account, and puts the qr code somewhere. 

For example, say they put it on their car. Now, if a passerby notices that the car's windows are down and there is no one in the car, they can scan the qr code with their phone and send a message directly to the owner. No logging in or downloading any apps. EZPZ. The passerby can now inform the car owner that they left the windows down and the car owner will receive the message through the app. No phone numbers or other personal identification involved. This can be used for a plethora of other situations as well. You unintentionally/intentionally blocking someone in with your car, someone hitting your car and wanting to leave their information with you but not having pens/paper, etc.

If you want a qr code for yourself let me know by scanning the qr code down below and sending me a message.

Anyways, the inspiration for this post comes from my quest to implement read receipts. I thought it would be a cool feature to implement, and helpful to the user to see which of their qr codes have unread chats. I tried researching this process to see if there were any smarter ways to do this but I didn't find much so here's my implementation. If you have any ideas on how to make the process more efficient, let me know and I will update this post. Or you can just submit a pull request [here](https://github.com/IKyriazis/ikyriazis.github.io/blob/master/_posts/2023-05-04-adding-read-receipts-to-chat-application.md).

Message me at the qr code below or click [here](https://qarmagnet.com/chat/7bea431c-9c2f-4683-894e-f2dcc1c69ec0):

![MyQRCode](/assets/images/qarmagnetreadreceipts/qarmagnet_qr.png)

## Backend Changes
To implement this functionality, I had to make some changes to the table that stores all the messages and to the endpoints the application uses to retrieve/send messages.

### Database Changes

Here is the current schema of the messages table:


<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0pky">id</th>
    <th class="tg-0pky">recipient</th>
    <th class="tg-0pky">sender</th>
    <th class="tg-0pky">message_content</th>
    <th class="tg-0pky">time</th>
    <th class="tg-0lax">seen</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">int unsigned</td>
    <td class="tg-0pky">binary(16)</td>
    <td class="tg-0pky">binary(16)</td>
    <td class="tg-0pky">varchar(256)</td>
    <td class="tg-0pky">datetime</td>
    <td class="tg-0lax">tinyint</td>
  </tr>
</tbody>
</table>

I added the "seen" field to the table to distinguish the read messages from the unread. I decided to use the tinyint datatype because of [this](https://stackoverflow.com/questions/289727/which-mysql-data-type-to-use-for-storing-boolean-values) StackOverflow post. So a 0 or null in the column would mean that the message is unread, and anything else would be considered read.

### NodeJS Changes
Now that I updated the messages table, I had to update some of my endpoints. This was a little tricky because there are multiple levels to this chat application. Because a user can have multiple qr codes they need to see an accurate number of unread messages for each qr code. And then once they open the qr code they need to see all the unread messages for each conversation. Here is a visual example. Take this screenshot of the home page:

![home_with_unread_messages](/assets/images/qarmagnetreadreceipts/home_with_unread_messages.png){:height="599px"}

There are multiple qr codes with unread messages. Now if I tap on the "Tesla" qr code I can see all the conversations I have through the qr code I put on my car. 

![inbox_with_unread_messages](/assets/images/qarmagnetreadreceipts/inbox_view_with_unread_convo.png){:height="599px"}

As you can see, the different conversations also have an unread messages count. 

#### /getUserQRCodes
This endpoint is responsible for populating the home screen of the app with all the qr codes that a user owns. All qr codes are stored in the mappings table:

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0pky">uuid</th>
    <th class="tg-0pky">label</th>
    <th class="tg-0pky">user</th>
    <th class="tg-0pky">isDeleted</th>
    <th class="tg-0pky">dateDeleted</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">binary(16)</td>
    <td class="tg-0pky">varchar(32)</td>
    <td class="tg-0pky">varchar(32)</td>
    <td class="tg-0pky">tinyint</td>
    <td class="tg-0pky">datetime</td>
  </tr>
</tbody>
</table>

The uuid is the unique id of the qr code, the label is the text that appears on the qr code on the home screen, the user is the username of the qr code owner, isDeleted is whether the qr code is deleted, and dateDeleted is when the qr code was deleted.

The SQL query below gets all the qr codes a user owns that aren't deleted and orders the results by the latest message to/from that qr code:
```sql
SELECT BIN_TO_UUID(uuid) as uuid, label FROM mappings ma 
LEFT JOIN messages me ON ma.uuid = me.recipient OR ma.uuid = me.sender 
WHERE ma.user = ? AND (ma.isDeleted = 0 OR ma.isDeleted IS NULL) 
GROUP BY ma.uuid ORDER BY MAX(me.time) DESC
```

To count all the unread messages, I had to add the following to the query: 
```sql
COUNT(CASE WHEN me.seen = 0 AND me.recipient=uuid THEN 1 END) as unread
```
The code snippet above counts all the messages with the "seen" field set to 0 that are sent to each qr code.


Together the query looks like this:
```sql
SELECT BIN_TO_UUID(uuid) as uuid, label, 
COUNT(CASE WHEN me.seen = 0 AND me.recipient=uuid THEN 1 END) as unread 
FROM mappings ma 
LEFT JOIN messages me ON ma.uuid = me.recipient OR ma.uuid = me.sender 
WHERE ma.user = ? AND (ma.isDeleted = 0 OR ma.isDeleted IS NULL)
GROUP BY ma.uuid ORDER BY MAX(me.time) DESC
```

#### /getDistinctSenders
This endpoint is responsible for getting all the conversations from the given qr code. The response includes the uuid of the sender, the nickname of the sender (a random three word slug so an ugly uuid string isn't shown on the ui), the time of the latest message, and the message content of the lates message (so the user can see a preview of the latest message). The three word slug comes from a table that maps the uuid of the person who scans the qr code with a nickname. The schema just includes the binary(16) datatype for the uuid and a varchar for the nickname field. Here is the SQL query I use to get all the response data:
```sql
SELECT DISTINCT BIN_TO_UUID(m.sender) AS sender, su.nickname, 
MAX(m.time) AS latest_message_time, 
(SELECT message_content FROM messages 
WHERE (sender = m.sender AND recipient = UUID_TO_BIN(?)) 
OR 
(recipient = m.sender AND sender = UUID_TO_BIN(?)) 
ORDER BY time DESC LIMIT 1) AS lastMessage, 
FROM messages m LEFT JOIN scanchat_users su ON m.sender = su.uuid 
WHERE m.recipient = UUID_TO_BIN(?) 
GROUP BY m.sender ORDER BY latest_message_time DESC, sender
```

I added this to get the number of unread messages for each conversation:
```sql
COUNT(CASE WHEN m.seen = 0 AND m.recipient = UUID_TO_BIN(?) THEN 1 END) AS unread
```

Here is the complete query I use:
```sql
SELECT DISTINCT BIN_TO_UUID(m.sender) AS sender, su.nickname, 
MAX(m.time) AS latest_message_time, 
(SELECT message_content FROM messages 
WHERE (sender = m.sender AND recipient = UUID_TO_BIN(?)) 
OR (recipient = m.sender AND sender = UUID_TO_BIN(?)) 
ORDER BY time DESC LIMIT 1) AS lastMessage, 
COUNT(CASE WHEN m.seen = 0 AND m.recipient = UUID_TO_BIN(?) THEN 1 END) AS unread 
FROM messages m LEFT JOIN scanchat_users su ON m.sender = su.uuid 
WHERE m.recipient = UUID_TO_BIN(?) 
GROUP BY m.sender ORDER BY latest_message_time DESC, sender
```

#### /getMessagesAsAppUser
This endpoint is responsible for retrieving all the messages within a conversation. I had to modify this endpoint so that it marks all the unread messages as read when the user tries getting all the messages.
After all the messages are retrieved from the database, I hold onto the message ids and send an update query to the database for all the messages to the user that are unread. All the update query does is set the seen field to 1 for all the unread messages sent to the user. I use a for loop to build the query string and then submit it. Here is the code snippet:

```javascript
let  updateSeenQuery = "UPDATE messages SET seen = 1 WHERE recipient = UUID_TO_BIN(?) AND (seen = 0 OR seen IS NULL) AND id IN (";
for (let  i = 0; i < messages.length; i++) {
  if (i === messages.length - 1) {
    updateSeenQuery += messages[i].id + ")";
  }
  else {
    updateSeenQuery += messages[i].id + ", ";
  }
}
connection.query(updateSeenQuery, [uuid], (err) => {
  if (err) {
    getMessagesAsAppUserLogger.error({error:  err, message:  "couldn't update message seen status"});
    return;
  }
  else {
    getMessagesAsAppUserLogger.info({message:  "changed seen status of messages"});
    return;
  }
});
```

With this addition to the endpoint, I can update the unread status of the message. Again, I'm sure this process can be improved but I'm not sure how, so if anyone has any feedback let me know!

But what happens when the app user is in the conversation already? While the app user is in the conversation, the websocket server is responsible for transporting the message to the app user's device. For this I had to create a new endpoint.

#### /markMessageSeen
This endpoint takes a message id and updates the message's seen field to 1. So that whenever the app user receives a message while they are in the conversation, the app sends a post request to this endpoint with the message id and this endpoint marks that message as seen. Again, this is the best way I thought of doing it, so if you have any better ideas with this let me know. It doesn't sound the cleanest but it's what I have for now until I think of something better. Here's the code snippet for this endpoint:

```javascript
app.post("/api/markMessageSeen", (req, res) => {
  const  user = req.session.user;
  const  id = req.body.id;
  const  markMessageSeenLogger = wlogger.child({
    user,
    ip:  req.header('cf-connecting-ip'),
    id,
    endpoint:  "/api/markMessageSeen"
  });
  if (!user) {
    markMessageSeenLogger.warn({message:  "not logged in"});
    res.json({message:  "not logged in"});
    return;
  }
  else  if (!id) {
    markMessageSeenLogger.warn({message:  "id undefined"});
    res.json({message:  "id undefined"});
    return;
  }
  else {
    // make sure that user owns the uuid of the message id
    connection.query("SELECT BIN_TO_UUID(uuid) AS uuid FROM mappings WHERE user = ?", [user], (err, uuids) => {
      if (err) {
        markMessageSeenLogger.error({error:  err, message:  "couldn't get uuids from user"});
        res.json({message:  "db error"});
        return;
      }
      else  if (uuids.length === 0) {
        markMessageSeenLogger.warn({message:  "trying to set message seen with no uuids"});
        res.json({message:  "no uuids found"});
        return;
      }
    else {
      let  uuidList = [];
      uuids.forEach(uuid  => {
        uuidList.push(uuid.uuid);
      });
      connection.query("SELECT BIN_TO_UUID(recipient) as recipient FROM messages WHERE id = ?", [id], (err, recipient) => {
        if (err) {
          markMessageSeenLogger.error({error:  err, message:  "couldn't get recipient using id"});
          res.json({message:  "db error"});
          return;
        }
        else  if (recipient.length === 0) {
          markMessageSeenLogger.warn({message:  "message doesn't exist with given id"});
          res.json({message:  "message not found"});
          return;
        }
        else {
          let  fraud = true;
          uuidList.forEach(uuid  => {
            if (uuid === recipient[0].recipient) {
              fraud = false;
            }
          });
          if (fraud) {
            markMessageSeenLogger.warn({message:  "user trying to set message seen when not recipient"});
            res.json({message:  "forbidden"});
            return;
          }
          else {
            connection.query("UPDATE messages SET seen = 1 WHERE id = ?", [id], (err) => {
              if (err) {
                markMessageSeenLogger.error({error:  err, message:  "couldn't update message seen"});
                res.json({message:  "db error"});
                return;
              }
              else {
                markMessageSeenLogger.info({message:  "updated seen for message"});
                res.json({message:  "success"});
                return;
              }
            });
          }
        }
      });
    }
  });
}});
```

## UI Changes

To communicate the amount of unread notifications to the user I had to make some changes to the ui. There were two screens I had to make changes to. The home screen and the inbox screen.

### Home screen changes

This is what the home screen looked like before I added the read receipt functionality.

![homescreen_no_unread_messages](/assets/images/qarmagnetreadreceipts/home_screen_no_unread_messages.png){:height="599px"}

I decided to show unread messages per qr code with a bubble in the top right corner that sums up all the unread messages to that qr code. I styled it like ios styles their push notifications. This is what the changes look like visually.

![homescreen_with_unread_messages](/assets/images/qarmagnetreadreceipts/home_with_unread_messages.png){:height="599px"}

As for the code changes, it was relatively straight forward. I started by adding a View with a border radius that would turn it into a circle. I added text inside the View so that the user can see how many unread messages they have. Here is the code snippet of the React Native code that generates the QR Code tile on the home screen.

```jsx
const  QRCodeTile = ({label, uuid, unread}) => {
  return(
    <TouchableOpacity  onPress={() => {navigation.navigate("InboxView", {label, uuid})}}>
      <View  style={{height:  90, width:  90, margin:  10, backgroundColor:  'white', borderColor:  "white", borderWidth:  5, flexDirection:  'column', justifyContent:  "space-between"}}>
        <View  style={{justifyContent:  "space-between", flexDirection:  "row"}}>
          <View  style={{height:  25, width:  25, backgroundColor:  "white", borderWidth:  3.5, justifyContent:  "center", alignItems:  "center"}}>
            <View  style={{height:  10, width:  10, backgroundColor:  "black"}}  />
          </View>
          <View  style={{height:  25, width:  25, backgroundColor:  "white", borderWidth:  3.5, justifyContent:  "center", alignItems:  "center"}}>
            <View  style={{height:  10, width:  10, backgroundColor:  "black"}}  />
          </View>
        </View>
        <Text  numberOfLines={1}  adjustsFontSizeToFit  style={{color:  'black', fontFamily:  "Dongle-Light", fontSize:  17, textAlign:  "center" }}>{label}</Text>
        <View  style={{height:  25, width:  25, backgroundColor:  "white", borderWidth:  3.5, justifyContent:  "center", alignItems:  "center"}}>
          <View  style={{height:  10, width:  10, backgroundColor:  "black"}}  />
        </View>
      </View>
      {unread !== 0 && <View  style={{flex:  1, justifyContent:  "center", alignContent:  "center", height:  25, width:  25, alignSelf:  "flex-end", position:  "absolute", borderRadius:  25, backgroundColor:  "#1a9bb2"}}  >
          <Text  numberOfLines={1}  adjustsFontSizeToFit  style={{alignSelf:  "center", color:  "white", fontFamily:  "Dongle-Light", fontSize:  20}}>
            {unread > 99? "99+" : unread}
          </Text>
       </View>}
    </TouchableOpacity>
  );
}
```

As part of the read receipt update, I added this section.
```jsx
{unread !== 0 && <View  style={{flex:  1, justifyContent:  "center", alignContent:  "center", height:  25, width:  25, alignSelf:  "flex-end", position:  "absolute", borderRadius:  25, backgroundColor:  "#1a9bb2"}}  >
  <Text  numberOfLines={1}  adjustsFontSizeToFit  style={{alignSelf:  "center", color:  "white", fontFamily:  "Dongle-Light", fontSize:  20}}>
    {unread > 99? "99+" : unread}
  </Text>
</View>}
```
The View is in curly braces so that when ``unread`` is 0 the bubble is hidden. As I was testing my application, I noticed that when the amount of unread messages was in the hundreds the ui looked bad so I added that if ``unread`` is greater than 99 than display 99+ as the amount of unread messages.

### Inbox screen changes
This is what the inbox screen looked like before I updated it to add a visual cue for unread messages.

![inbox_view_no_unread](/assets/images/qarmagnetreadreceipts/inbox_view_no_unread.png){:height="599px"}

To add the visual cue I thought of two approaches. 

![inbox_view_mockup_1](/assets/images/qarmagnetreadreceipts/inbox_view_mockup_1.png){:height="599px"}

and

![inbox_view_mockup_2](/assets/images/qarmagnetreadreceipts/inbox_view_mockup_2.png){:height="599px"}

I decided to go with the second option because I thought it was a clever use of the message icon I had already implemented. I also didn't want to clutter up the ui. 

Here is the code snippet responsible for generating the inbox items.

```jsx
const  DistinctSender = ({nickname, uuid, lastMessage, sender, unread}) => {
  return (
    <TouchableOpacity  onPress={() => {navigation.navigate("Messages", {sender, uuid, nickname, isSupport:  false})}}>
      <View  style={{flexDirection:  "row"}}>
        <MaterialIcons  style={{margin:  10, marginLeft:  0, fontSize:  40, color:  unread > 0? "#1a9bb2" : "white"}}  name="chat-bubble"  />
        <Text  numberOfLines={1}  adjustsFontSizeToFit  style={{marginLeft:  15, alignSelf:  "center", position:  "absolute", color:"white", fontFamily:  "Dongle-Regular", fontSize:  20}}>
          {unread > 0? unread > 9? "9+" : unread : ""}
        </Text>
        <View  style={{marginLeft:  15, flexDirection:  "column"}}>
          <Text  style={{fontFamily:  "Dongle-Regular", color:  "white", fontSize:  25}}>{nickname !== null? nickname.length > 25? nickname.substring(0, 25) + "..." : nickname : sender.substring(0, 20) + "..."}</Text>
          <Text  style={{fontFamily:  "Dongle-Regular", color:  "gray", fontSize:  15}}>{lastMessage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
```

The code that I altered/added in that snippet is here:

```jsx
<MaterialIcons style={{margin: 10, marginLeft: 0, fontSize: 40, color: unread > 0? "#1a9bb2" : "white"}} name="chat-bubble" />  
<Text numberOfLines={1} adjustsFontSizeToFit style={{marginLeft: 15, alignSelf: "center", position: "absolute", color:"white", fontFamily: "Dongle-Regular", fontSize: 20}}>  {unread >  0? unread >  9?  "9+"  : unread :  ""}  
</Text>
```

I added the ternary operator when configuring the color of the message icon so that the message icon would be blue when there were unread messages. I also added the text field so that the user can see how many unread messages they have. Like before, I noticed that the formatting got ugly when there were more than 9 unread messages, so I decided to condense the number by showing 9+ if there were more than 9 unread messages in the conversation.


## Conclusion

If you got to this point in the article, congrats! We covered a lot of ground. I talked about the app I've been working on for about a year, the changes I made to my NodeJS server to add the unread messages functionality, the database schema changes, and the React Native code changes to show the user the unread messages. 

I hope you learned some new development techniques or had some interesting thoughts that you would like to share with me (at the qr code above, c'mon, send me a message and put the new ui stuff you just read about to work on my device). If you want to read more of my articles, go to the posts section of this website, if you want to connect with me on linkedin, I have that link under my profile image on the home screen of this site. Also, I recently went car camping in Acadia. If you want to check that out, here's the [link](https://www.youtube.com/watch?v=GAsPgU3NPbU&t=10s&ab_channel=IoannisKyriazis).