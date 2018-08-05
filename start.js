var template_user 		= require('./config/user.js');
var config 				= require('./config/mandrill.js');

var subscriber 			= require("redis").createClient();
var mandrill 			= require('mandrill-api/mandrill');
var mandrill_client 	= new mandrill.Mandrill(config.api_key);
var util 				= require('util');
var file_system 		= require('fs');

subscriber.on("message", function(channel, message) {
	var data 			= JSON.parse(message);

	var subject 		= data.subject;
	var message_html 	= "";

	if (data.template == "user") {
		if(data.action == "registration") {
			message_html = util.format(template_user.registration, data.to.name);
		} else if(data.action == "verification") {
			message_html = util.format(template_user.verification, data.to.name, data.username, data.password);
		}	
	}

	// Setup recipients including bccs
	var recipients = [{ "email": data.to.email, "name": data.to.name, "type": "to" }];
	if (data.bcc != null && data.bcc.length > 0) {
		for (var bcc_index = 0; bcc_index < data.bcc.length; bcc_index++) {
			var bcc_data 		= data.bcc[bcc_index];
			var bcc_recipient 	= { "email": bcc_data.email, "name": bcc_data.name, "type": "bcc" };
			recipients.push(bcc_recipient);
		}
	}

	// Setup mandrill message
  	var message = {
	    "html": message_html,
	    "subject": subject,
	    "from_email": config.sender_email,
	    "from_name": config.sender_name,
	    "to": recipients,
	    "important": false,
	    "track_opens": null,
	    "track_clicks": null,
	    "auto_text": null,
	    "auto_html": null,
	    "inline_css": null,
	    "url_strip_qs": null,
	    "preserve_recipients": null,
	    "view_content_link": null,
	    "tracking_domain": null,
	    "signing_domain": null,
	    "return_path_domain": null,
	};

	// Setup attachment, for example: file in uploads/sample.pdf
	if(data.attachment != null) {
		var current_dir 	= __dirname;
		var attachment_dir 	= current_dir + "/uploads/";
		var file_path 		= attachment_dir + data.attachment;
		var readed_file 	= file_system.readFileSync(file_path);
		var attachment_file = new Buffer(readed_file).toString('base64');
	    message.attachments = [{
	        "type": "application/pdf",
	        "name": "sample.pdf",
	        "content": attachment_file
	    }];
	}

	var async = false;
	mandrill_client.messages.send({"message": message, "async": async}, function(result) {
		// Output sending mail result, in case for debugging
	    console.log(result);
	}, function(e) {
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	});
});

var date = new Date();
console.log("Starting Up Email Worker at " + date);

subscriber.subscribe("email-worker");
