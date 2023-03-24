const { Client, GatewayIntentBits, EmbedBuilder, Collection, Events, ActivityType, MessageAttachment, AttachmentBuilder, GuildMember, Guild, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildChannel, ChannelType, PermissionsBitField, WebhookClient, Message, Partials } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildPresences], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });
const { token, mogodburl, dm_webhook, ping_webhook, new_server_webhook, open_api, open_org } = require('./config.json')
const mongoose = require('mongoose');
const GiveawayManager = require('./utils/gw');


client.commands = new Collection();
// Initialize the invite cache

// A pretty useful method to create a delay without blocking the whole script.
const wait = require("timers/promises").setTimeout;

client.once('ready', async () => {
    console.log('Ready!');


    if (!mogodburl) return;
    mongoose.connect(mogodburl || '', {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    if (mongoose.connect) {
        console.log("The database is running!")
    }

    let servers = await client.guilds.cache.size;
    let users = await client.guilds.cache.reduce(
        (a, b) => a + b.memberCount,
        0
    );
    let status = [
        {
            name: "/help-community",
            type: ActivityType.Watching,
        },
        {
            name: "/help-economy",
            type: ActivityType.Watching,
        },
        {
            name: "/help-moderation",
            type: ActivityType.Watching,
        },
        {
            name: `/help-games`,
            type: ActivityType.Watching,
        },
        {
            name: `${servers} Servers and ${users} Users`,
            type: ActivityType.Watching,
        },
    ];
    console.log(`✅ Enabling Status`);
    setInterval(() => {
        let random = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[random]);
    }, `2000`);
    console.log(":white_check_mark: Sucessfully Enabled Status.");
})

//   client.on(Events., member => {
//     // Send the message to a designated channel on a server:
//     const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
//     // Do nothing if the channel wasn't found on this server
//     console.log(member.user.username+"Joined the server")
//     if (!channel) console.log("No channel found");

//     const card = new Welcomer()
//     .setUsername(member.user.username)
//     .setDiscriminator(member.user.discriminator)
//     .setMemberCount(member.guild.memberCount.toLocaleString())
//     .setGuildName(member.guild.name)
//     .setAvatar(member.displayAvatarURL())
//     .setText("member-count", "-{count}x member")
//     .setText("title", "WELCOME")
//     .setText("message","welcome to BotTesting server")

//     card.build()
//     .then(buffer => channel.send(new MessageAttachment(buffer, "welcome.png")));
// //   });

// client.on(Events.GuildMemberAdd, async(member) => {
//     const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
//     // Do nothing if the channel wasn't found on this server
//     console.log(member.user.username+"Joined the server")
//     if (!channel) console.log("No channel found");

//     const card = new Welcomer()
//     .setUsername(member.user.username)
//     .setDiscriminator(member.user.discriminator)
//     .setMemberCount(member.guild.memberCount.toLocaleString())
//     .setGuildName(member.guild.name)
//     .setAvatar(member.displayAvatarURL())
//     .setText("member-count", "-{count}x member")
//     .setText("title", "WELCOME")
//     .setText("message","welcome to BotTesting server")

//     card.build()
//     .then(buffer => channel.send(new Discord.MessageAttachment(buffer, "welcome.png")));
// })


const functions = fs.readdirSync('./functions').filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");

client.giveawayManager = new GiveawayManager(client, {
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        embedColorEnd: "#000000",
        reaction: "🎁",
    },
});


(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./events");
    client.handleCommands(commandFolders, "./commands");
    client.login(token)
})();

const levelSchema = require('./Schemas.js/level');

client.on(Events.MessageCreate, async (message) => {
    try {
        const { guild, author } = message;

        if (!guild || author.bot) return;
        levelSchema.findOne({ Guild: guild.id, User: author.id }, async (err, data) => {
            if (err) throw err;

            if (!data) {
                levelSchema.create({
                    Guild: guild.id,
                    User: author.id,
                    Level: 1,
                    XP: 1
                })
            }
        });

        const channel = message.channel;

        const give = 2;
        const data = await levelSchema.findOne({ Guild: guild.id, User: author.id })
        const requiredXP = data.Level * data.Level * 20 + 20;

        if (data.XP + give >= requiredXP) {
            data.XP += give;
            data.Level += 1;
            await data.save();

            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`🎉 Congracts, ${author} you have reached level ${data.Level}`)
            channel.send({ embeds: [embed] })
        }
        else {
            data.XP += give;
            data.save()
        }
    } catch (err) {
        console.log(err)
    }

});
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const Canvas = require('canvas');
const joinschema = require('./Schemas.js/joinschema');

client.on(Events.GuildMemberAdd, async (member) => {

    const data = await joinschema.findOne({ guildid: member.guild.id })
    if (!data) return;
    var welcomeCanvas = {};
    welcomeCanvas.create = Canvas.createCanvas(1024, 500);
    welcomeCanvas.context = welcomeCanvas.create.getContext("2d");
    welcomeCanvas.context.font = "72px sans-serif";
    welcomeCanvas.context.fillStyle = "#ffffff";

    //important

    await Canvas.loadImage("https://i.ibb.co/QYTrKSk/d0aa58d1b3d2395c0b467b5b70c7b3f2.jpg").then(async (img) => {
        welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);
        welcomeCanvas.context.fillText("Welcome", 360, 360);
        welcomeCanvas.context.beginPath();
        welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
        welcomeCanvas.context.stroke();
        welcomeCanvas.context.fill();
    });

    let canvas = welcomeCanvas;
    (canvas.context.font = "42px sans-serif"),
        (canvas.context.textAlign = "center");
    canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
    canvas.context.font = "32px sans-serif";
    canvas.context.fillText(
        `You are the ${member.guild.memberCount}th Member To Join The Server`,
        512,
        455
    );
    canvas.context.beginPath();
    canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
    canvas.context.closePath();
    canvas.context.clip();
    await Canvas.loadImage(
        member.user.displayAvatarURL({ extension: "jpg", size: 1024 })
    ).then((img) => {
        canvas.context.drawImage(img, 393, 47, 238, 238);
    });

    const attachment = new AttachmentBuilder(canvas.create.toBuffer(), {
        name: "welcome.png",
    })

    process.noDeprecation = true;

    member.guild.channels.cache.get(data.channel).send({
        content: data.message
            .replace(/\{mention\}/g, member.user.toString())
            .replace(/\{user\}/g, member.user.username)
            .replace(/\{server\}/g, member.guild.name)
            .replace(/\{members\}/g, member.guild.memberCount),
        files: [attachment]
    });
})


client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    const antiswearSchema = require('./Schemas.js/antiswear');

    const guild = message.guild;

    let requireDB = await antiswearSchema.findOne({ _id: guild.id });
    if (!requireDB) return;

    if (requireDB.logs === false) return;

    const scamLinks = require('./badwords.json');
    const scamlinks = scamLinks.known_links;
    const embed = new EmbedBuilder()
        .setColor("0x2f3136")
        .setDescription(`:warning: | <@${message.author.id}> has been warned for bad word usage.`)
    for (let i in scamlinks) {
        if (message.content.toLowerCase().includes(scamlinks[i].toLowerCase())) {
            await message.delete();
            message.channel.send({ embeds: [embed] });

            // message.channel.send({
            //     embeds: [
            //         new EmbedBuilder()
            //             .setColor("0x2f3136")
            //             .setDescription(`<@${message.author.id}> has been warned for bad word usage.\n\`\`\`${message.content}\`\`\``)
            //     ]
            // });
        }
    }
})

const modSchema = require('./Schemas.js/mod');

client.on(Events.MessageCreate, async message => {
    if (message.guild) return;
    if (message.author.bot) return;
    // console.log('connected kid')

    const gu = '1055079934135107694';
    const guild = client.guilds.cache.get(gu);
    if (message.channel.type == ChannelType.DM) {
        const member = message.author
        // console.log('connected')
        // console.log(message.author)

        const { dm_webhook } = require('./config.json')
        const webhookClient = new WebhookClient({ url: `${dm_webhook}` })
        const embed1 = new EmbedBuilder()
            .setColor("Blue")
            .setTitle('Got dm')
            .setDescription(`${message.content}`)
            .addFields(
                { name: 'User', value: `${message.author.tag}` }
            )
        webhookClient.send({ embeds: [embed1] })
    }

});

client.on("messageCreate", async message => {
    // console.log('read')
    if (message.author.bot) return;
    if (!message.guild) return;
    // console.log(message.guild.name)
    // console.log(message.author.username)
    if (message.content == '$ping') {
        message.react('📩')
        message.reply(`Websocket heartbeat: ${client.ws.ping}ms.`)
        const server = client.guilds.cache.reduce((acc, srv) => acc + srv.name + '\n', "").trim();
        // console.log(server)
        const { webhook } = require('./config.json');
        const sw = new WebhookClient({ url: `${webhook}` })
        sw.send(`${server}`);
        return;
    }
})
client.on("guildMemberRemove", async member => {
    console.log('got')


    const chID = await db.get(`leavelogs_${member.guild.id}`);
    const channel = member.guild.channels.cache.get(chID);

    if (!channel) return;

    channel.send(`${member.user} just left the server`)
});
// const inviteSchema = require('./Schemas.js/invites');

// const invites = new Collection();

// client.on('ready', async () => {
//     await wait(2000);

//     client.guilds.cache.forEach(async (guild) => {
//         const clientMember = guild.members.cache.get(client.user.id);

//         if (!clientMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;

//         const firstInvites = await guild.invites.fetch().catch(err => { console.log(err) });

//         invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
//     })
// });

// client.on("guildMemberAdd", async member => {
//     if (member.user.bot) return;
//     const data = await inviteSchema.findOne({ Guild: member.guild.id });
//     if (!data) return;
//     const channel = data.Channel;

//     const ch = await member.guild.channels.cache.get(channel);
//     const newInvites = await member.guild.invites.fetch();
//     const oldInvites = invites.get(member.guild.id);

//     const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));

//     const inviter = await client.users.fetch(invite.inviter.id);



//     inviter
//         ? ch.send(`${member.user} joined the server.\nInvited by ${inviter}`)
//         : ch.send(`${member.user} just joined the server`);

// })

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    if (message.guild) return;
    message.react('📩')
    console.log(message.content)
})

const { webhook } = require('./config.json')


client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    setTimeout(() => {
        const ping = `${client.ws.ping}ms`;
        const sen = new WebhookClient({ url: `${ping_webhook}` })
        sen.send(`Bot ping - \`${ping}\``)
    }, 6000);
})

client.on("guildCreate", async (guild) => {

    const own = guild.ownerId;
    const member = guild.members.cache.get(own);

    const newserver = new WebhookClient({ url: `${new_server_webhook}` });
    const embed1 = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Added in 1 new server")
        .setDescription(`\`\`\`Server name - ${guild.name}\nOwner name - ${member.user.tag} \`\`\``)

    newserver.send({ embeds: [embed1] });


    const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Commands")
        .setDescription('Hey thanks for adding me in your server. If you want any help feel free to join our discord server')
        .addFields(
            {
                name: 'Community 💖',
                value: `\`/help-community\``
            },
            {
                name: 'Economy 💵',
                value: '\`/help-economy\`'
            },
            {
                name: 'Moderation 🛠️',
                value: '\`/help-moderation\`'
            },
            {
                name: 'Games 🏓',
                value: '\`/help-games\`'
            },
            {
                name: 'Giveaways',
                value: '\`/help-giveaways\`'
            }
        )

    try {
        member.send('Thanks for adding our bot in your server')
        member.user.send("Its safe and multitasking bot with many commands like \`spotify\` and games like \`tic tac toe\`. It has a strong moderation system and also logger and welcomer system")
        member.send("If you got any error while running any command so do not worry, join our support server and sk for help")
        member.send('Server link - https://discord.gg/hCpYyjDVGD')
        member.send({ embeds: [embed] })
    } catch (e) {
        const web = new WebhookClient({ url: `${webhook}` })
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`\`\`\`${e}`)
        return web.send({ embeds: [embed] })
    }
});


client.on("guildDelete", async (guild) => {
    try {

        const own = guild.ownerId;
        const member = guild.members.cache.get(own);

        member.send("Hope we will see you again 🥹")
        member.send("If you don't mind can you please tell us why you removed me from your server please!")
        member.send('Type messages here I will send them to my owner')

        const sn = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`\`\`\`Got removed from 1 server\`\`\`\nServer name - ${guild.name}\nUsername - ${member.user.tag}`)

        const leav = new WebhookClient({ url: `${new_server_webhook}` })
        leav.send({ embeds: [sn] })

    } catch (e) {
        return;
    }
})

client.on(Events.GuildMemberAdd, async member => {
    if (member.user.bot) return;
    if (!member.guild) return;
    const roleSchema = require('./Schemas.js/autorole');
    const data = await roleSchema.findOne({ Guild: member.guild.id })
    if (!data) return;
    if (data.Yes === true) {
        const role = data.Role;
        member.roles.add(role);
    }
    return;
})

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    const data = await db.get(`chatbot_${message.guild.id}`);
    if (!data) return;

    if (message.channel.id === data) {

        const { Configuration, OpenAIApi } = require("openai");

        const configuration = new Configuration({
            apiKey: open_api,
        });
        const openai = new OpenAIApi(configuration);

        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `${message.content}`,
                temperature: 0.5,
                max_tokens: 2000,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
                stop: ["You:"],
            });

            setTimeout(() => {
                const chatGPTResponse = response.data.choices[0].text.trim();

                if (chatGPTResponse.length >= 2000) {
                    return message.channel.send(`can you please mention a limit for response because I have generated a response greater than 2000 characters. Sadly, I can't send the response here because it is not allowed to send messages greater than 2000 characters in discord.`)
                }

                message.channel.send(chatGPTResponse)
            }, 1000);

        } catch (e) {
            console.log(e)
            return message.channel.send('got an error!')
        }
    }
})