# Feedbox

This app acts like a "dropbox" for feeds.

To increase the coverage of our [tracking feeds](https://superfeedr.com/tracker), we let anyone supply feeds to Superfeedr. These feeds are added to the system, but they're not technically subscribed to, which means notifications won't be sent to the person who added them.

This feedbox will also do some clean up and will remove all feeds which have high bozo ranks, high porn ranks, very high velocity as well as broken feeds which have not been parsed for weeks.

Resources which are not feeds are also discarded.

// When the user submits a subscribe request (using the exact same Superfeedr API); we proxy it to Superfeedr's API so we can subscribe to it too.