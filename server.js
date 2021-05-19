// Dependencies
 const express = require('express');

 // Configure & Run the http server
 const app = express();

 app.use(express.static(__dirname + '/_site', { dotfiles: 'allow' } ));
 app.get("/survey", (req, res) => {
	 res.redirect("https://docs.google.com/forms/d/e/1FAIpQLSegCzK4g52VCJDnA0-JPLF4QV0eFqrfVANEX7LRvDnJpI2iUA/viewform?usp=sf_link");
	 console.log("click");
 });
 const listener = app.listen(5031, () => {
   console.log('HTTP server running on port ' + listener.address().port);
   });
