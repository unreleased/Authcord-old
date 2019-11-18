# Readme

Hi, thank you for downloading and testing out this free dashboard, not much has been implemented except the basics. You'll notice there isn't any payments implemented and most-likely there won't be. There isn't too much error handling, you'll have to resolve a lot of the issues yourself, just consider this a very basic template.

You will need some devops/developer ability in order to set this up, i'm sure you could find somebody who is willing to do it for you for cheap, that person is not me.

The bot is built into this, once you start the server the bot will be started alongside it.

### Contents

[Features](#features)
[Setup](#setup)

# Features

* Login/registration through Discord OAuth
* Admin panel to:
  * Edit keys
  * Generate key
  * View users
* Activation system
  * Activate keys (user is added to server once they activate their key, however they are not automatically removed)

# Setup
Follow the different guides below to setup this on your server.

[Enable Discord Developer Mode](#enable-discord-developer-mode)

#### Enable Discord Developer Mode

Visit your Discord user settings. It should be at the bottom-left of your screen.
<div>
    <img src="https://i.imgur.com/8Q9nJyr.png" width="450" height="auto" />
</div>

Visit "Appearance" and scroll down to "Advanced". The first option will let you enable developer mode.
![](https://i.imgur.com/Eaq1S7A.png)

Test it's working. Right click a user on your friends list and if you see the option to "Copy ID". You've successfully enabled Discord developer mode.
![](https://i.imgur.com/I2nh893.png)

#### Setting up `.env.template`
#### Importing the MySQL Database
#### 


* Please follow the `.env.template` tutorial and fill in ALL the details, you should enable developer mode if not already under your Discord appearance settings, right clicking often lets you "copy id"
* Please create a mysql database and import the import.sql file to get the basic configuration for the server to work
* I recommend using pm2 or forever to run the server constantly, check their documentation for instruction
* Make sure you run `npm install` to install the required dependencies for the software to work. You can test it by running `npm start` if you see any errors, chances are you haven't set it up successfully. The default url will be: http://localhost:3000