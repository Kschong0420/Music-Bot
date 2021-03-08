module.exports = {
    name: "skip",
    inVoiceChannel: true,
    async execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
        try {
            client.distube.skip(message)
            message.channel.send(`${client.emotes.success} | Skipped! Now playing:\n${queue.songs[0].name}`)
        } catch (e) {
            message.channel.send(`${client.emotes.error} | ${e}`)
        }
    }
}