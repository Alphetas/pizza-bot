const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eventrole')
        .setDescription('Gives or takes away the Event role.'),
    async execute(interaction) {
        const role = interaction.guild.roles.cache.find(role => role.name === 'Events');
        if(interaction.member.roles.cache.some(role => role.name === 'Events')) {
            //user has role
            interaction.member.roles.remove(role);
            return interaction.reply('Removed your Events role');
        } else {
            //user doesnt have role
            interaction.member.roles.add(role);
            return interaction.reply('Added your Events role');
        }

    },
};