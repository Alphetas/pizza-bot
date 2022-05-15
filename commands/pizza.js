const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pizza')
        .setDescription('Check pizza'),
    async execute(interaction) {
        return interaction.reply('Pizza is sleeping don\'t disturb...');
    },
};