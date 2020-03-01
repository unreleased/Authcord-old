# Readme

Please note. This readme is still under construction. <br/>

Hi, thank you for downloading and testing out this free dashboard, not much has been implemented except the basics. You'll notice there isn't any payments implemented and most-likely there won't be. There isn't too much error handling, you'll have to resolve a lot of the issues yourself, just consider this a very basic template.

You will need some devops/developer ability in order to set this up, i'm sure you could find somebody who is willing to do it for you for cheap, that person is not me.

The bot is built into this, once you start the server the bot will be started alongside it.

### Contents

- [Features](#features)
- [Setup](#setup)

# Features

- Login/registration through Discord OAuth
- Admin panel to:
  - Edit keys
  - Generate key
  - View users
    - View servers a user is in
- Activation system
  - Activate keys (user is added to server once they activate their key, however they are not automatically removed)

# Setup

Follow the different guides below to setup this on your server.

- [Enable Discord Developer Mode](#enable-discord-developer-mode)
- [Setting up .env](#setting-up-envtemplate)

### Enable Discord Developer Mode

Visit your Discord user settings. It should be at the bottom-left of your screen.

<div>
    <img src="https://i.imgur.com/8Q9nJyr.png" width="450" height="auto" />
</div>

<br>

Visit "Appearance" and scroll down to "Advanced". The first option will let you enable developer mode.

<div>
    <img src="https://i.imgur.com/Eaq1S7A.png" width="750" height="auto" />
</div>

<br>

Test it's working. Right click a user on your friends list and if you see the option to "Copy ID". You've successfully enabled Discord developer mode.

<div>
    <img src="https://i.imgur.com/I2nh893.png" width="250" height="auto" />
</div>

### Setting up `.env.template`

`PORT` The port you want the server to run on. The default is set to 3000 for testing. <br/>
`DISCORD_CLIENT_ID` The client ID for your Discord Bot. Visit [Discord developers](https://discordapp.com/developers/applications) and select your application to view your client ID.<br/>
`DISCORD_CLIENT_SECRET` The client secret for your Discord Bot. You can get it from the same place as `DISCORD_CLIENT_ID`<br/>
`DISCORD_BOT_TOKEN` The Discord Bot token which can be found under the "Bot" section on the [Discord developers](https://discordapp.com/developers/applications) panel.<br/>
`DISCORD_REDIRECT_URI` The redirect URI for your Discord login. You need to change this to the URL with the same `/discord/callback` path if you plan on deploying the server to a website rather than just testing on localhost.<br/>
`DISCORD_SCOPES` Scopes used by the Discord login. Editing without correct configuration may cause bugs. I recommend using the defaults.<br/>
`DISCORD_SERVER_ID` You can get this after you've enabled [Discord developer mode](#enable-discord-developer-mode). Right click on the server and click "Copy ID".<br/>
`DEFAULT_ROLE` The default role to give users once they're added to the server (After activating their key). You can get the role ID by enabling [Discord developer mode](#enable-discord-developer-mode) and clicking "Copy ID" on the role of a user.<br/><br/>
`DB_HOST` The IP/host for your MySQL database.<br/>
`DB_NAME` The name of your Database.<br/>
`DB_USER` The username for the account of your database.<br/>
`DB_PASS` The password for the account of your database.<br/>

### Importing the MySQL Database

- Please follow the `.env.template` tutorial and fill in ALL the details, you should enable developer mode if not already under your Discord appearance settings, right clicking often lets you "copy id"
- Please create a mysql database and import the import.sql file to get the basic configuration for the server to work
- I recommend using pm2 or forever to run the server constantly, check their documentation for instruction
- Make sure you run `npm install` to install the required dependencies for the software to work. You can test it by running `npm start` if you see any errors, chances are you haven't set it up successfully. The default url will be: http://localhost:3000
