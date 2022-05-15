const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Make a poll')
        .addStringOption(option => option.setName('poll')
            .setDescription('Set the reason of the poll')
            .setRequired(true))
        .addStringOption(option => option.setName('option-1')
            .setDescription('Set option 1')
            .setRequired(true))
        .addStringOption(option => option.setName('option-2')
            .setDescription('Set option 2')
            .setRequired(true))
        .addStringOption(option => option.setName('option-3')
            .setDescription('Set option 3')
            .setRequired(false)),
    async execute(interaction) {

        const poll = interaction.options.getString('poll');
        const opt = [
            { value: interaction.options.getString('option-1'), emoji: '1️⃣' },
            { value: interaction.options.getString('option-2'), emoji: '2️⃣' },
            { value: interaction.options.getString('option-3'), emoji: '3️⃣' },
        ];


        var desc = "";

        opt.forEach(fn = i => {
            if(i.value) {
                desc += i.emoji + " " + i.value + "\n\n";
            }
        })

        const embed = new MessageEmbed()
            .setTitle(poll)
            .setDescription(desc)
            .setColor("#6441a3")

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        
        opt.forEach(fn = i => {
            if(i.value) {
                message.react(i.emoji);
            }
        });
    }
}