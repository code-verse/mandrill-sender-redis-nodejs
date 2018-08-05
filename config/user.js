var registration = `
		<div style='background: #f77841; text-align: center; font-size: 1.2em; color: #ffffff; padding: 30px;'>
			User Registration
		</div>
		<div style='padding: 30px; margin-top: 5px; background: #ffffff; color: #aaaaaa;'>
			Hello %s,
			<br><br>
			Thank you for registering to our site.
			<br><br>
			Our administrator is currently evaluating your registration.
			<br>
			We'll inform you shortly for our evaluation result.
		</div>`;

var verification = `
		<div style='background: #f77841; text-align: center; font-size: 1.2em; color: #ffffff; padding: 30px;'>
			User Registration
		</div>
		<div style='padding: 30px; margin-top: 5px; background: #ffffff; color: #aaaaaa;'>
			Hello %s,
			<br><br>
			We have approved your registration.
			<br><br>
			You can use these details for signing-in to our site.
			<br>
			username: %s
			password: %s
		</div>`;

module.exports = {
	'registration': registration,
	'verification': verification
}