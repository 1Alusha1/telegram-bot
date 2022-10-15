import { Scenes, Markup } from 'telegraf';
import actionButton from '../use/actionButtons.js';
import Group from '../model/Group.js';

export default function chooseGroup() {
  const chooseGroup = new Scenes.BaseScene('chooseGroup');

  chooseGroup.enter(async (ctx) => {
    const group = await Group.find();

    if (!group) {
      return ctx.reply('Груп поки немає');
    }

    await ctx.reply('Обери свою групу');

    const arr = [];
    group.forEach((item) => {
      arr.push(
        Markup.button.callback(`${item.groupName}`, `${item.groupName}`)
      );
    });

    await ctx.replyWithHTML('<b>Групи:</b>', Markup.inlineKeyboard([arr]));
    await actionButton(group, chooseGroup);
  });

  return chooseGroup;
}
