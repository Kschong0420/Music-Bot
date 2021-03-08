const Discord = require('discord.js')

module.exports = {
  name: 'help',
  description: 'Command List',
  execute (client, message, args) {
    const newEmbed = new Discord.MessageEmbed()
      .setColor('#FFE666')
      .setTitle('Vanilla Command List')
      .setDescription('Type v <command> to use me!')
      .addFields(
        { name: 'butter', value: 'fly ~' },
        { name: 'cute', value: 'praise Vanilla bot' },
        { name: 'ms', value: 'show the bot ping in ms' },
        { name: 'userinfo', value: 'check for user detail' },
        { name: 'a_userinfo', value: 'more detail for user checked' },
        { name: 'trivia', value: 'answer some trivia' },
        { name: 'ping', value: 'show bot and api ms' },
        { name: 'mjl', value: 'shows member joined leaderboard' },
        { name: 'emojify <message>', value: 'emojify your message' },
        { name: 'roast <ping someone>', value: 'insult the person you ping' },
        { name: 'membercount', value: 'show the amount of users and bot in the server' },
        { name: 'silence', value: 'someone too noisy? use this command!' },
        { name: 'hentai', value: 'realise someone is hentai? use this command!' },
        { name: 'character', value: 'SPOILERS WARNING! get details for Nekopara' },
        { name: 'op', value: 'get a list for nekopara opening song' },
        { name: 'ed', value: 'get a list for nekopara ending song' },
        { name: 'avatar', value: 'check for your profile picture' },
        { name: 'song', value: 'get a list for song command' },
        { name: 'serverinfo', value: 'show the server info' },
        { name: 'mcserver <ip> <port>', value: 'check the server detail' },
        { name: 'translate <language> <name>', value: 'translate your things into the language you want' },
        { name: 'tictactoe <ping someone>', value: 'play tictactoe with the person you ping' },
        { name: 'urban <name>', value: 'check the detail you want from urban dictionary' },
        { name: 'avatar <ping someone or more than 2>', value: 'check for the person who you ping avatar' },
        { name: 'image <name>', value: 'send the first google image according to the things you want' },
        { name: 'image <link>', value: 'send the picture according to the link given' },
        { name: 'say <message>', value: 'let the bot help you to say something' },
        { name: 'weather <city/country/city country>', value: 'get about some weather detail for the city or country' },
        { name: 'report', value: 'if realise the bot got bug please use this command to report to the owner quickly' },
        { name: 'cal add <number1> <number2>', value: 'get the result when <number1> add to <number2>' },
        { name: 'cal subtract <number1> <number2>', value: 'get the result when <number1> subtract <number2>' },
        { name: 'cal multiply <number1> <number2>', value: 'get the result when number 1 multiply <number2>' },
        { name: 'cal divide <number1> <number2>', value: 'get the result when <number1> divided by <number2>' },
        { name: 'purge <2 ~ 100>', value: 'clear the amount of message, for person who have manage messages permission only' }
      )
      .setImage('https://cdn.discordapp.com/attachments/814445307764670495/814449916822290452/ezgif-2-5516e48d1a75.gif')

    message.channel.send(newEmbed)
  }
}
