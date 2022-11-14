import { Scenes } from 'telegraf';
import actionButton from '../use/connectToGroup.js';
import MainGroup from '../model/MainGroup.js';
import drowButtons from '../use/drowButtons.js';
import message from '../message.js';

export default function chooseGroup() {
  const chooseGroup = new Scenes.BaseScene('chooseGroup');

  chooseGroup.enter(async (ctx) => {
    try {
      const mainGroup = await MainGroup.find();
      if (!mainGroup) {
        return ctx.reply(message().groupNotFound);
      }

      await ctx.reply(message().chooseYourGroup);

      await drowButtons(mainGroup, 'Обери свою групу:', ctx);
      await actionButton(mainGroup, chooseGroup);
    } catch (err) {
      if (err) console.log(err);
      ctx.reply(message().error);
    }
  });

  return chooseGroup;
}
