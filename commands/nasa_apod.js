const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { nasa_token } = require("../config.json");
const { querystring } = require("querystring");
const cat = require('./cat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apod')
        .setDescription('Returns the astronomy picture of the day from NASA')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of items to search. This will return random images.')
                .setRequired(false)),
    async execute(interaction) {
        const count = interaction.options.getInteger('count');
        embeds=[];
        if(count==null) {
            const img = await fetchDataFromCatApi(nasa_token);
            embeds.push(dataToEmbed(img));
        } else {
            const img = await fetchDataFromCatApi(nasa_token, count.toString());
            for(const item of img) {
                embeds.push(dataToEmbed(item));
            }
        }
        return interaction.reply({embeds: embeds});//{ embeds: [embed] });
        
    },
};

function dataToEmbed(data){
    if(data.media_type === 'image') {
        const embed = new MessageEmbed()
        .setTitle(`${data.title}`)
        .setURL(`${data.hdurl}`)
        .setImage(data.url)
        .setColor("#6441a3")
        .addFields(	
            { name: "Date", value: data.date, inline: true },
            //{ name: "Copyright", value: data.copyright, inline: true },
            { name: "Explanation", value: data.explanation.length > 1024 ? data.explanation.substring(0, 1024 - 3) + "..." : data.explanation, inline: false }
        );
        return embed;
    } else {
        console.log("Item from NASA is not an image")
    }
}

async function fetchDataFromCatApi(nasa_token, count="") {
    const queryParams ={
        "api_key":nasa_token,
        "count":count
    };
    const queryString = Object.keys(queryParams).map(key => key+"="+queryParams[key]).join("&");//querystring.stringify(queryParams);
    const url = "https://api.nasa.gov/planetary/apod?"+queryString;
        
    const response = await fetch(url);
    const cat_img = await response.json();
    
    return cat_img;
}