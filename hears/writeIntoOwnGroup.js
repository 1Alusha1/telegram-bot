import Groups from '../model/Groups.js';

import drowButtons from '../use/drowButtons.js';
import { state } from '../state.js';
export default async function (bot, ctx) {
  const groups = await Groups.find({ admin: ctx.from.username });

  await drowButtons(groups, 'Обери групу: ', ctx);

  groups.forEach((item) => {
    bot.action(item.groupName, async (ctx) => {
      await ctx.reply(`Написати повідомлення у групу ${item.groupName}`);
      state.groupName = item.groupName;
      ctx.scene.enter('sendMessageToOwnGroup');
    });
  });
}
