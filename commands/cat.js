const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { cat_api_token } = require("../config.json");
const { querystring } = require("querystring");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Looks up a cat picture!'),
    async execute(interaction) {
        const cat_img = await fetchDataFromCatApi(cat_api_token);
        if(!cat_img) {
            return interaction.reply("Couldn't find any picture");
        }
        const breeds = cat_img[0].breeds[0];
        const embed = new MessageEmbed()
		.setTitle(`${breeds.name}`)
		.setURL(`${breeds.wikipedia_url}`)
		.setImage(cat_img[0].url)
		.setColor("#6441a3")
		.addFields(	
			{ name: "Weight", value: breeds.weight.metric +" kg", inline: true },
            { name: "Life span", value: breeds.life_span.toString() +" years", inline: true },
            { name: "Origin", value: breeds.origin, inline: true },
            { name: "Affection", value: breeds.affection_level.toString(), inline: true },
            { name: "Adaptability", value: breeds.adaptability.toString(), inline: true },
            { name: "Intelligence", value: breeds.intelligence.toString(), inline: true },
            { name: "Description", value: breeds.description, inline: false}
        );    
        return interaction.reply({embeds: [embed]});//{ embeds: [embed] });
    },
};

async function fetchDataFromCatApi(cat_token) {
    const queryParams ={
        "has_breeds":true,
        "mime_type":"jpg,png",
        "size":"small",
        "limit": 1
    };
    const queryString = Object.keys(queryParams).map(key => key+"="+queryParams[key]).join("&");//querystring.stringify(queryParams);
    
    const url = "https://api.thecatapi.com/v1/images/search?"+queryString;
    
    const response = await fetch(url,{headers: {"X-API_KEY":cat_token}});
    const cat_img = await response.json();
    
    return cat_img;
}