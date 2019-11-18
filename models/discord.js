const knex    = require('./database')
const discord = require('discord.js')
const moment  = require('moment')
const request = require('request-promise').defaults({
    simple: false,
    resolveWithFullResponse: true
})

/**
 * Imports
 */

const Discord = {}


Discord.exchangeCode = (code) => {
    const opts = {
        url: 'https://discordapp.com/api/oauth2/token',
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        form: {
            'client_id'    : process.env.DISCORD_CLIENT_ID,
            'client_secret': process.env.DISCORD_CLIENT_SECRET,
            'grant_type'   : 'authorization_code',
            'code'         : code,
            'redirect_uri' : process.env.DISCORD_REDIRECT_URI,
            'scope'        : 'identify email guilds guilds.join'
        },
        json: true,
    }

    return request(opts).then(res => {
        return res.body;
    }).catch(err => {
        return err;
    })
}

Discord.getUser = (token) => {
    const opts = {
        url: 'https://discordapp.com/api/users/@me',
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        json: true,
    }

    return request(opts).then(res => {
        return res.body;
    }).catch(err => {
        return err;
    })
}

Discord.saveUser = async (tokens, user) => {
    try {
        const exists = await knex('discords')
                .where('id', user.id)
                .first()
        
        if (!exists) {
            // Save user if they don't exist
            await knex('discords').insert({
                id            : user.id,
                username      : user.username,
                discriminator : user.discriminator,
                email         : user.email,
                avatar        : user.avatar,
                refresh_token : tokens.refresh_token,
                access_token  : tokens.access_token,
                token_expires : moment().add(tokens.expires_in, 'seconds').format('YYYY-MM-DD HH:mm:ss')
            })
        }

        return true
    } catch(err) {
        console.log(err)
        return false
    }
}

Discord.addToServer = async (id) => {
    const guild  = await global.discordClient.guilds.get(process.env.DISCORD_SERVER_ID)
    const token  = await Discord.getAccessToken(id)
    console.log(token)

    const resp  = await guild.addMember(id, {
        accessToken : token,
        roles: [ process.env.DEFAULT_ROLE ]
    })

    return true

}

Discord.getAccessToken = async (id) => {
    try {
        const user  = await knex('discords')
            .where('id', id)
            .first()

        if (user) {
            // Check if bearer token has expired
            if (moment(user.token_expires).isAfter(moment())) {
                return user.access_token
            } else {
                // return fresh token
                return await Discord._getNewToken(user.refresh_token)
            }
        } else {
            return false
        }
        
        return token
    } catch(err) {
        console.log(err)
        return false
    }
}

Discord._getNewToken = async (token) => {
    const opts = {
        url: 'https://discordapp.com/api/oauth2/token',
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        form: {
            'client_id'     : process.env.DISCORD_CLIENT_ID,
            'client_secret' : process.env.DISCORD_CLIENT_SECRET,
            'refresh_token' : token,
            'grant_type'    : 'refresh_token',
            'redirect_uri'  : process.env.DISCORD_REDIRECT_URI,
            'scope'         : process.env.DISCORD_SCOPES
        },
        json: true,
    }

    return request(opts).then(async (res) => {
        try {
            await knex('discords').update({
                refresh_token : res.body.refresh_token,
                access_token  : res.body.access_token,
                token_expires : moment().add(res.body.expires_in, 'seconds').format('YYYY-MM-DD HH:mm:ss')
            }).where({
                refresh_token: token
            })

            return res.body.access_token;
        } catch(err) {
            console.log(err)
            return false;
        }
    }).catch(err => {
        console.log(err)
        Sentry.captureException(err)
        return false;
    })
}

Discord.findServers = async (id) => {
    const token = await Discord.getAccessToken(id)
    console.log("TOKEN!")
    console.log(token)

    if (token) {
        const opts  = {
            url     : 'https://discordapp.com/api/users/@me/guilds',
            method  : 'GET',
            json    : true,
            headers : {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    
        return request(opts).then(res => {
            console.log(res.body)
            return res.body
        }).catch(err => {
            console.log(err)
            return false
        })
    } else {
        console.log("no token")
        return false
    }
}


module.exports = Discord