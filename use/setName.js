export default function setName(scene, state) {
  try {
    scene.on('text', async (ctx) => {
      if (state.action === 'subgroup' && state.subGroup) {
        state.groupName = String(ctx.message.text);
        await ctx.reply(`Вы обрали группу ${String(ctx.message.text)}`);
        await ctx.scene.enter('setSubGroupName');
        state.subGroup = false;
      } else if (state.action === 'subgroup' && !state.subGroup) {
        state.subGroupName = String(ctx.message.text);
        await ctx.reply(`Вы обрали підгруппу ${String(ctx.message.text)}`);
        await ctx.scene.enter('setTeacherUsername');
        state.subGroup = true;
      } else if (state.action === 'group' && !state.subGroup) {
        state.groupName = String(ctx.message.text);
        await ctx.reply(`Вы обрали группу ${String(ctx.message.text)}`);
        await ctx.scene.enter('setTeacherUsername');
      }
    });
  } catch (err) {
    if (err) console.log(err);
    ctx.reply(
      'Somthings wrong. you can write me and i`wll help you! telegram: @ellisiam'
    );
  }
}
