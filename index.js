import { Bard } from "googlebard";
import { Client, Intents, MessageAttachment, MessageEmbed, version } from "discord.js";
const client = new Client({
  ws: {
    properties: {
      browser: 'Discord iOS'
    }
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const bot = new Bard("__Secure-1PSID=" + process.env.bardKey, {
  protocol: "https",
});

client.on("ready", () => {
  console.log(client.user.tag + ' ✓');

  client.user.setActivity({
    name: 'www.google.com',
    type: 'PLAYING'
  });
});

async function send(message, result) {
  function reply(content) {
    message.channel.send(content);
  }
  const embeds = [];
  let tryCount = 3;
  while (result.length > 0 && tryCount > 0) {
    try {
      let end = Math.min(5000, result.length);
      embeds.push(new MessageEmbed().setDescription(`${result.slice(0, end)}`).setColor('BLUE'));
      result = result.slice(end, result.length);
    } catch (e) {
      tryCount--;
      console.error(e);
    }
  }
  if (embeds.length > 8) {
    reply({
      files: [
        new MessageAttachment(Buffer.from(result, "utf-8"), "message.txt"),
      ],
    });
  } else {
    reply({
      embeds,
    });
  }
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== '1151194346595565598') return;
  const content = message.content;

  message.channel.sendTyping();
  try {
    const result = await bot.ask(content);
    await send(message, result);
  } catch (e) {
    console.error(e);
  }
});

client.on("messageCreate", async (message) => {
  if (message.channel.type === 'DM') {
    if (message.author.bot) return;
    const content = message.content;

    message.channel.sendTyping();
    try {
      const result = await bot.ask(content);
      await send(message, result);
    } catch (e) {
      console.error(e);
    }
  }
});

client.login(process.env.token);
