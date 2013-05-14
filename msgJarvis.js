var xmpp = require('simple-xmpp'),
	exec = require('child_process').exec,
	config = require('./config.json');

xmpp.on('online', function() {
    console.log('CONNECTED!');
});

xmpp.on('chat', function(from, message) {
	if (from && config.acceptedUsers.indexOf(from) >= 0) {
		//we got a message from an authorized user	
	  	console.log("message: " + message + '\n');
	    
	    //was the message a valid command
	    if(message && config.msgToCommand[message]){
	        console.log("executing command: " + config.msgToCommand[message] + '\n');
	      	xmpp.send(from, 'executing the following script: ' + config.msgToCommand[message]);

	    	exec(config.msgToCommand[message], function(error, stdout, stderr){
				console.log('stdout: ' + stdout);
				xmpp.send(from, 'stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				xmpp.send(from, 'stderr: ' + stderr);
				if(error !== null){
					console.log('error: ' + error);
					xmpp.send(from, 'error: ' + error);
				}
			});

	    }
	    else{
	      console.log('Command not found');
	      xmpp.send(from, 'Command not found');
	    }

 	}
  	else{
  		console.log('Received a message from an unauthorized user - ignoring it...');
  	}
});

xmpp.on('error', function(err) {
    console.error(err);
});

xmpp.on('subscribe', function(from) {
if (from && config.acceptedUsers.indexOf(from) >= 0) {
    	xmpp.acceptSubscription(from);
    }
});

xmpp.connect({
    jid                 : config.username,
    password        	: config.password,
    host                : config.host,
    port                : config.port
});