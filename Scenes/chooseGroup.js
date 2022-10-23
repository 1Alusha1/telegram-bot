import { Scenes, Markup } from 'telegraf';
import actionButton from '../use/actionButtons.js';
import MainGroup from '../model/MainGroup.js';

export default function chooseGroup() {
  try {
    const chooseGroup = new Scenes.BaseScene('chooseGroup');

    chooseGroup.enter(async (ctx) => {
      const mainGroup = await MainGroup.find();
      if (!mainGroup) {
        return ctx.reply('Груп поки немає');
      }

      await ctx.reply(`Тепер обери свою групу та підгрупу (за необхідності) 🤍
      ‼️ уважно слідуй вказівкам куратора ‼️`);

      await ctx.replyWithHTML(
        '<b>Обери свою групу:</b>',
        Markup.inlineKeyboard(drowButtons(mainGroup))
      );
      await actionButton(mainGroup, chooseGroup, ctx);
    });

    return chooseGroup;
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}

export function drowButtons(array) {
  try {
    const arr = [];
    array.forEach((item) => {
      arr.push([
        Markup.button.callback(`${item.groupName}`, `${item.groupName}`),
      ]);
    });
    return arr.sort((a, b) => {
      if (a[0].text < b[0].text) {
        return -1;
      } else if (a[0].text > b[0].text) {
        return 1;
      }
      return 0;
    });
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}
