module.exports = {
    name: "volume",
    aliases: ["v", "set", "set-volume"],
    inVoiceChannel: true,
    async execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
        const volume = parseInt(args[0])
        if (isNaN(volume)) return message.channel.send(`${client.emotes.error} | Please enter a valid number!`)
        client.distube.setVolume(message, volume)
        message.channel.send(`${client.emotes.success} | Volume set to \`${volume}\``)
    }
}