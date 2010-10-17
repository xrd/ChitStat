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

![ChitStat sample layout](http://github.com/xrd/ChitStat/raw/master/html/sample.png)