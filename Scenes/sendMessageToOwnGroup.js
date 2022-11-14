import { Scenes } from 'telegraf';
import { state } from '../state.js';

import message from '../message.js';
import Groups from '../model/Groups.js';
import sendMessageToStudent from '../use/sendMessageToStudent.js';

export function sendMessageToOwnGroup() {
  const sendMessageToOwnGroup = new Scenes.BaseScene('sendMessageToOwnGroup');
  sendMessageToOwnGroup.on('text', async (ctx) => {
    const group = await Groups.findOne({ groupName: state.groupName });
    sendMessageToStudent(ctx, group);
    await ctx.reply(message().messageSent);
    ctx.scene.leave();
  });

  return sendMessageToOwnGroup;
}
