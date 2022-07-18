const { SlashCommandBuilder } = require('@discordjs/builders');
const { translate } = require('free-translate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vittu')
        .setDescription('Translates a message')
        .addStringOption(option => option.setName('messageid')
            .setDescription('The ID of the message to be translated')
            .setRequired(false))
        .addStringOption(option => option.setName('language')
            .setDescription('The desired language')
            .setRequired(false)),
    async execute(interaction) {
        const messageid = interaction.options.getString('messageid');
        language = interaction.options.getString('language');
        lastMessage = null;
        if(!(messageid == null)) {
            await interaction.channel.messages.fetch(messageid).then(message => {
                lastMessage = message;
            })
        } else {
            await interaction.channel.messages.fetch({ limit: 1 }).then(messages => {
                lastMessage = messages.first();
            })
        }
        if(language == null){
            language = 'en';
        }
        interaction.reply({ content: 'Translating...'});
        const translatedText = await translate(lastMessage.content, {to: language});
        lastMessage.reply({
            content: lastMessage.author.username + " said: " + translatedText,
            allowedMentions: {
                repliedUser: false
            }
        });
        interaction.deleteReply();
        return 
    },
};