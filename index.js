const Discord = require('discord.js')
const DisTube = require("distube")
require('dotenv').config()
const client = new Discord.Client()
const fetch = require('node-fetch')
const querystring = require('querystring')
const fs = require("fs")

const memberCounter = require('./counters/member-counter')
const config = require("./config.json")
client.distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true, leaveOnFinish: false })
client.emotes = config.emoji
client.aliases = new Discord.Collection()

client.commands = new Discord.Collection()
client.events = new Discord.Collection()

fs.readdir("./commands/", (err, files) => {
  if (err) return console.log("Could not find any commands!")
  const jsFiles = files.filter(f => f.split(".").pop() === "js")
  if (jsFiles.length <= 0) return console.log("Could not find any commands!")
  jsFiles.forEach(file => {
      const cmd = require(`./commands/${file}`)
      console.log(`Loaded ${file} ✅`)
      client.commands.set(cmd.name, cmd)
  })
})

client.once('ready', () => {
  client.user.setActivity('Chocola', {
    type: 'WATCHING'
  })
})

client.once('ready', () => {
  console.log('Member Counter Started Countdown!')
  memberCounter(client)
})

client.on('messageDelete', async message => {
  const logchannel = message.guild.channels.cache.find(ch => ch.name === 'logchannel')
  if (!logchannel) return
  const embed = new Discord.MessageEmbed()
    .setColor('#0352fc')
    .setTitle('Deleted Message')
    .addFields(
      { name: 'Author', value: `${message.author.tag}` },
      { name: 'Deleted Message', value: `${message.content}` },
      { name: 'Channel', value: `${message.channel.name}` }
    )
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setFooter(`User ID: ${message.author.id}`)
  logchannel.send(embed)
})

client.on('messageUpdate', async message => {
  const logchannel = message.guild.channels.cache.find(ch => ch.name === 'logchannel')
  if (!logchannel) return
  const embed = new Discord.MessageEmbed()
    .setColor('#fca503')
    .setTitle('Edited Message')
    .addFields(
      { name: 'Author', value: `${message.author.tag}` },
      { name: 'Message Before Edited', value: `${message.content}` },
      { name: 'Channel', value: `${message.channel.name}` }
    )
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setFooter(`User ID: ${message.author.id}`)
  logchannel.send(embed)
})

client.on('message', async message => {
  const prefix = process.env.PREFIX
  const args = message.content.substring(prefix.length).split(' ')

  if (message.content.startsWith(`${prefix}urban`)) {
    const searchString = querystring.stringify({ term: args.slice(1).join(' ') })

    if (!args.slice(1).join(' ')) {
      return message.channel.send(new MessageEmbed()
        .setColor('BLUE')
        .setDescription('You need to specify something you want to search the urban dictionary')
      )
    }

    const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${searchString}`).then(response => response.json())

    try {
      const [answer] = list

      const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str)

      const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle(answer.word)
        .setURL(answer.permalink)
        .addFields(
          { name: 'Definition', value: trim(answer.definition, 1024) },
          { name: 'Example', value: trim(answer.example, 1024) },
          { name: 'Rating', value: `${answer.thumbs_up} 👍. ${answer.thumbs_down} 👎.` }
        )
      message.channel.send(embed)
    } catch (error) {
      console.log(error)
      return message.channel.send(new Discord.MessageEmbed()
        .setColor('BLUE')
        .setDescription(`No results were found for **${args.slice(1).join(' ')}**`)
      )
    }
  }
});

client.afk = new Map();
client.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = process.env.PREFIX;
  let messageArray = message.content.split(" ");
  let command = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

  // return message.channel.send(`**${user_tag}** is currently afk. Reason: ${key.reason}`);
  // return message.reply(`you have been removed from the afk list!`).then(msg => msg.delete(5000));
  const mentionedUser = message.mentions.users.first();
  if (message.content.includes(message.mentions.members.first())) {
    let mentioned = client.afk.get(message.mentions.users.first().id);
    if (mentioned) message.channel.send(`**${mentionedUser.username}** is currently afk. Reason: ${mentioned.reason}`);
  }
  let afkcheck = client.afk.get(message.author.id);
  if (afkcheck) return [client.afk.delete(message.author.id), message.reply(`you have been removed from the afk list!`).then(msg => msg.delete(5000))];

  if (!command.startsWith(prefix)) return;

  let cmd = client.commands.get(command.slice(prefix.length));
  if (cmd) cmd.run(client, message, args);
});

['command_handler', 'event_handler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, Discord)
})

client.on("ready", () => {
  console.log(`${client.user.tag} is ready to play music.`)
//const server = client.voice.connections.size
//client.user.setActivity({ type: "PLAYING", name: `music on ${server} servers` })
})

client.on("message", async message => {
  const prefix = config.prefix
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (cmd.inVoiceChannel && !message.member.voice.channel) return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
  try {
      cmd.run(client, message, args)
  } catch (e) {
      console.error(e)
      message.reply(`Error: ${e}`)
  }
})

const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
client.distube
  .on("playSong", (message, queue, song) => message.channel.send(
    `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`
  ))
  .on("addSong", (message, queue, song) => message.channel.send(
    `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
  ))
  .on("playList", (message, queue, playlist, song) => message.channel.send(
    `${client.emotes.play} | Play \`${playlist.title}\` playlist (${playlist.total_items} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
  ))
  .on("addList", (message, queue, playlist) => message.channel.send(
    `${client.emotes.success} | Added \`${playlist.title}\` playlist (${playlist.total_items} songs) to queue\n${status(queue)}`
  ))
  // DisTubeOptions.searchSongs = true
  .on("searchResult", (message, result) => {
    let i = 0
    message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
  })
  // DisTubeOptions.searchSongs = true
  .on("searchCancel", message => message.channel.send(`${client.emotes.error} | Searching canceled`))
  .on("error", (message, err) => message.channel.send(`${client.emotes.error} | An error encountered: ${err}`))


client.login(process.env.DISCORD_TOKEN)

// { name: 'Edited Message', value: `${message.edit.content}` },

// Special Thanks
// Thank for the following tutorial youtuber below for teach the code to bot creator for this bot:
// 1.codelyon  - newbie suitable tutorial 
// 2.fusion terror - useful code and clear
// 3.reconlx (and his npm package) - make bot more fun and fuction with lot of npm package

