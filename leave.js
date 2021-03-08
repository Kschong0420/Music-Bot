module.exports = {
    name: "leave",
    aliases: ["disconnect", "stop"],
    inVoiceChannel: true,
    async execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
        client.distube.stop(message)
        message.channel.send(`${client.emotes.success} | Stopped!`)
    }
}