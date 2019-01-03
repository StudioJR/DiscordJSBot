I've then ended up with this (actually pretty much copy and paste but I've limited my copy and paste actions to : ok first read the code - second understand the code - third what can you learn from the code - forth copy and paste - fifth add comments to make it easier to understand the code
Here is the code
//Load FS API
const fs = require('fs');
//Load Discord.js
const Discord = require('discord.js');
//load config file
const { prefix, token } = require('./config.json');
//creates Discord Client/Bot
const client = new Discord.Client();
//creates basic Command Collection
client.commands = new Discord.Collection();
//Read Dir - scans for js files only
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//handle file list
for (const file of commandFiles) {
//load file 	const command = require(./commands/${file});
//append file to Command Collection 	client.commands.set(command.name, command);
}
//basic Cooldown
const cooldowns = new Discord.Collection();
//log ready when bot is ready
client.once('ready', () => { 	console.log('Ready!');
});
//message Listener
client.on('message', message => {
//Stop if message doesn't start with prefix or author = bot 	
  if (!message.content.startsWith(prefix) || message.author.bot) return;
//read + save args and cmd 
  const args = message.content.slice(prefix.length).split(/ +/); 
  const commandName = args.shift().toLowerCase();  	
  const command = client.commands.get(commandName)  	|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
//stop if entered command is no commander 	if (!command) return;
//Security System
//error if Commans can only be executed on a server 
  if (command.guildOnly && message.channel.type !== 'text') {  	return message.reply('I can't execute that command inside DMs!'); 	}
//error if cmd requires all args but user didn't enter all 
                                                                                     if (command.args && !args.length) {  	let reply = You didn't provide any arguments, ${message.author}!;
//error on wrong command usage  
                                                                                                                        if (command.usage) {   	reply += \nThe proper usage would be: \${prefix}${command.name} ${command.usage}`;  	}   	return message.channel.send(reply); 	}
//Cooldown 	
if (!cooldowns.has(command.name)) {  	cooldowns.set(command.name, new Discord.Collection()); 	}
//create Date/Time Obj 
const now = Date.now();  	const timestamps = cooldowns.get(command.name);
//add cooldown 
const cooldownAmount = (command.cooldown || 3) * 1000;
//check for running Cooldown
if (timestamps.has(message.author.id)) {
//saves cooldown end  	
const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
//test if cooldown has end  
if (now < expirationTime) {
//error if cooldown still exists   
const timeLeft = (expirationTime - now) / 1000;   	return message.reply(please wait ${timeLeft.toFixed(1)} more second(s) before reusing the `${command.name}` command.`);  	} 	}
//add timestamp 	t
                                                             imestamps.set(message.author.id, now);
//remove timestamp after timeout 
                                                             setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);  	try {
//execute command  
                                                               command.execute(message, args,Discord); 	} 	catch (error) {
//On Error  
                                                                 console.error(error);  	message.reply('there was an error trying to execute that command!'); 	}
});
//Login
client.login(token);
