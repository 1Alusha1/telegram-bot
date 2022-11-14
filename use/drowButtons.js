import { Markup } from 'telegraf';
import message from '../message.js';

export default async function drowButtons(array, text, ctx) {
  try {
    const arr = [];
    array.forEach((item) => {
      arr.push([
        Markup.button.callback(`${item.groupName}`, `${item.groupName}`),
      ]);
    });
    arr.sort((a, b) => {
      if (a[0].text < b[0].text) {
        return -1;
      } else if (a[0].text > b[0].text) {
        return 1;
      }
      return 0;
    });

    return await ctx.replyWithHTML(
      `<b>${text}</b>`,
      Markup.inlineKeyboard(arr)
    );
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(message().error);
  }
}
