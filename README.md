ChitStat is an attempt at building a collaborative R language environment.  Another way to say it, ChitStat is a visual R language REPL.  Or, ChitStat is a fun way to review R transcripts for learning and sharing.

How you use it:

* You login using OpenID (Google, Yahoo!, Hotmail, etc.)
* You either create a new room or enter an existing room
* You can choose to enter an "R" command, which the backend interprets as a R command
* You can choose to enter a chat command, which is simply a chat command
* If you enter an R command, the system manipulates the current session data
* If you enter an R command and it affects the visualization of the data, a new image is loaded into the coverflow.
* You can jump around in the coverflows and see how the data is shifting when visualized

Other Fun Features (I would like to build someday)

* All chat rooms have a permantent URL which allows you to review a chat transcript
* Any chat or R message is uniquely identifiable, so you can "seek" to a place in a live chat, and then fork from there to do different mutations on the original statistics
* Pull data from any URL, specify a CSS ID to retrieve table data and load it as an R array

Why I Think This is Cool

* I think it would be fun to have archived R transcripts
* Statisticians could use this to collaborate in real time when building statistically representations
* People wanting to learn R could use this to review transcripts of other R profressionals

Technologies:

* Built on top of node.js, http://nodejs.org/
* Uses R in the backend: http://www.r-project.org/
* RIAK for storage: http://basho.com
* JanRain Engage for OpenID login:  http://www.janrain.com/, http://github.com/xrd/connect-rpx
* Uses the contentflow JS library:  http://www.jacksasylum.eu/ContentFlow/

Bugs

* Not really functional, just a proof of concept
* Could be dangerous if someone entered a shell command and the R interpreter executed it
* Need to fork a new R interpreter for each chat session
* Better interpretation of what is an R command and what is a normal message.  Maybe anything is R unless we use a format like "user:  some message here" where we must specify a username, or "all:" for everyone in the room.  Then we could do away with the select menu.
* Tricky to handle responses from the R interpreter since calculations could take a long time. Node.js asynchronous code could really help here.

How To Run:
(this needs a lot of work)
* install node, connect, etc.
* cd chitstat-server
* ./connect &
* cd ../node-lib/riak-0.11.0-osx-x86_64
* ./bin/riak start

Enjoy!  Of course, lots is broken right now.

A sample transcript on the server side:

...  (some server startup messages)

Data: > 
[riak-js] POST /riak/messages/
[riak-js] POST /riak/messages/
[riak-js] POST /riak/messages/
Data: png('5d9f83d32c09a7590ca564b1796-1287300031187.png')

Data: > a <- 
Data: c(1,2,3,4)
> 
[riak-js] POST /riak/messages/
Data: Error: unexpected symbol in "I just"

Data: png('5d9f83d32c09a7590ca564b1796-1287300051201.png')
> I just created a new array.
> 
[riak-js] POST /riak/messages/

* We posted a few messages to the server.  
* Then, I changed the message type to "R" and entered the command a <- c(1,2,3,4) which created an R vector on the server.  
* I then accidentally forgot to switch back to "chat" type of message, and the server tried to interpret the message as an R command.  
* Any time the server gets an R message it tries to create a new PNG with the output.  If the command did create a new PNG, we should have the server send it back and insert into the contentflow.
* Oops.  Once I switched this back, the message is interpreted as a normal chat message and inserted into the chat.

![ChitStat sample layout](http://github.com/xrd/ChitStat/raw/master/html/sample.png)

