# readme

Hi, thank you for downloading and testing out this free dashboard, not much has been implemented except the basics. You'll notice there isn't any payments implemented and most-likely there won't be. There isn't too much error handling, you'll have to resolve a lot of the issues yourself, just consider this a very basic template.

You will need some devops/developer ability in order to set this up, i'm sure you could find somebody who is willing to do it for you for cheap, that person is not me.

The bot is built into this, once you start the server the bot will be started alongside it.

# what comes with this dashboard?

- Login/registration through Discord OAuth
- Admin panel to:
    * Edit keys
    * Generate keys
    * View users
- Activation system
    * Activate keys (user is added to server once they activate their key, however they are not automatically removed)

# to setup

- Please follow the .env.template tutorial and fill in ALL the details, you should enable developer mode if not already under your Discord appearance settings, right clicking often lets you "copy id"
- Please create a mysql database and import the import.sql file to get the basic configuration for the server to work
- I recommend using pm2 or forever to run the server constantly, check their documentation for instruction
- Make sure you run `npm install` to install the required dependencies for the software to work. You can test it by running `npm start` if you see any errors, chances are you haven't set it up successfully. The default url will be: http://localhost:3000


