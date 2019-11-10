const moment = require('moment')

/**
 * Imports
 */

const knex    = require('./database')
const Discord = require('./discord')


const User = {}

User.getSelf = async (id) => {
    // Get user session to set
    try {
        const key  = await knex('keys').where('discord_id', id).first()
        const user = await knex('discords').where('id', id).first()
    
        // Tidy things up
        if (key) {
            key.expires_at_formatted = moment(key.expires_at).format('Do MMMM, YYYY')
            user.isMember = (moment(key.expires_at).isAfter(moment()))
        } else {
            user.isMember = false
        }
    
        return { ...user, key: key }
    } catch(err) {
        console.log(err)
        return false
    }
    
}

User.activate = async (id, activation_key) => {
    try {
        // Check if key has been activated or not
        const key = await knex('keys')
                .where('activation_key', activation_key)
                .first()

        if (key.discord_id !== null) {
            return 'Activation key already in use.'
        }

        if (key) {
            // Activate the key
            await knex('keys')
                .update('discord_id', id)
                .where('activation_key', activation_key)
            
            await Discord.addToServer(id)
            return true
        } else {
            return 'Activation key does not exist.'
        }
    } catch(err) {
        console.log(err)
        return 'Could not activate key.'
    }
}

module.exports = User