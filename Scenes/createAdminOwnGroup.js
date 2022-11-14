import { Scenes } from 'telegraf';

import Groups from '../model/Groups.js';
import Admin from '../model/Admin.js';
import MainGroup from '../model/MainGroup.js';
import message from '../message.js';

export function createAdminOwnGroup() {
  const createAdminOwnGroup = new Scenes.BaseScene('createAdminOwnGroup');

  createAdminOwnGroup.enter(async (ctx) => {
    await ctx.reply(message().enterNameOfGroup);
  });

  createAdminOwnGroup.on('text', async (ctx) => {
    let groupName = String(ctx.message.text);

    new MainGroup({
      groupName,
    }).save();

    new Groups({
      groupName,
      students: [],
      admin: ctx.from.username,
    }).save();

    Admin.findOneAndUpdate(
      { groupName },
      {
        $push: { ownGroups: { groupName } },
      },
      { new: true },
      (err) => {
        if (err) console.log(err);
      }
    );
    await ctx.reply(message().ownGroupCreated);
    await ctx.scene.leave();
  });
  return createAdminOwnGroup;
}
