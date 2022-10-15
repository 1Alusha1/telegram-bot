import { Scenes, Markup } from 'telegraf';
import Group from '../model/Group.js';

class SceneGenerator {
  
  GenCreateGroup() {
    const createGroup = new Scenes.BaseScene('createGroup');

    createGroup.enter(async (ctx) => {
      ctx.reply('Input group name');
    });

    createGroup.on('text', async (ctx) => {
      const groupName = String(ctx.message.text);
      const group = await Group.findOne({ groupName });

      if (!group) {
        new Group({
          groupName,
          students: Array,
        }).save();

        await ctx.reply(`
          Ви створили группу ${groupName}, всі наступні повідомлення будуь відправлятися студентам
        `);
        return await ctx.scene.leave();
      }

      await ctx.reply('this group already exist');
      await ctx.scene.reenter('createGroup');
    });
    return createGroup;
  }
  
}

export default new SceneGenerator();
