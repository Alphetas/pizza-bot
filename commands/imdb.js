const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { omdb_token } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('imdb')
        .setDescription('Looks up a movie at IMDB!')
        .addStringOption(option =>
            option.setName('movie')
                .setDescription('The movie name to search')
                .setRequired(true)),
    async execute(interaction) {

        const searchTerm = interaction.options.getString('movie');
        
        const movie = await fetchDataFromOMDB(searchTerm.replace(' ', '+'), omdb_token);
        if(!movie) {
            return interaction.reply("Couldn't find the movie");
        }

        /**
         * {
                "Title": "Die Hard",
                "Year": "1988",
                "Rated": "R",
                "Released": "20 Jul 1988",
                "Runtime": "132 min",
                "Genre": "Action, Thriller",
                "Director": "John McTiernan",
                "Writer": "Roderick Thorp, Jeb Stuart, Steven E. de Souza",
                "Actors": "Bruce Willis, Alan Rickman, Bonnie Bedelia",
                "Plot": "An NYPD officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.",
                "Language": "English, German, Italian, Japanese",
                "Country": "United States",
                "Awards": "Nominated for 4 Oscars. 8 wins & 6 nominations total",
                "Poster": "https://m.media-amazon.com/images/M/MV5BZjRlNDUxZjAtOGQ4OC00OTNlLTgxNmQtYTBmMDgwZmNmNjkxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
                "Ratings": [
                {
                "Source": "Internet Movie Database",
                "Value": "8.2/10"
                },
                {
                "Source": "Rotten Tomatoes",
                "Value": "94%"
                },
                {
                "Source": "Metacritic",
                "Value": "72/100"
                }
                ],
                "Metascore": "72",
                "imdbRating": "8.2",
                "imdbVotes": "855,706",
                "imdbID": "tt0095016",
                "Type": "movie",
                "DVD": "28 Dec 1999",
                "BoxOffice": "$83,844,093",
                "Production": "N/A",
                "Website": "N/A",
                "Response": "True"
                }
         */

        const scores = {
            imdb: "none found",
            meta: "none found",
            rotten: "none found",
        }
        movie.Ratings.forEach(rating => {
            if(rating.Source == "Internet Movie Database") {
                scores.imdb = rating.Value;
            }

            if(rating.Source == "Metacritic") {
                scores.meta = rating.Value;
            }

            if(rating.Source == "Rotten Tomatoes") {
                scores.rotten = rating.Value;
            }
        });

        const embed = new MessageEmbed()
		.setTitle(`${movie.Title} (${movie.Year})`)
		.setURL(`https://www.imdb.com/title/${movie.imdbID}`)
		.setImage(movie.Poster)
		.setColor("#6441a3")
		.addFields(	
			{ name: "IMDB rating", value: scores.imdb, inline: true },
            { name: "Rotten Tomatoes", value: scores.rotten, inline: true },
            { name: "Metacritic", value: scores.meta, inline: true },
            { name: "Plot", value: movie.Plot, inline: false},
            { name: "Runtime", value: movie.Runtime, inline: true },
            { name: "Director", value: movie.Director, inline: true },
            { name: "Genre", value: movie.Genre, inline: true },
            { name: "Starring", value: movie.Actors, inline: false },
            { name: "Box office", value: movie.BoxOffice, inline: false }
		);       

        return interaction.reply({ embeds: [embed] });
    },
};

async function fetchDataFromOMDB(searchTerm,omdb_token) {
    const url = `https://www.omdbapi.com/?t=${searchTerm}&apikey=${omdb_token}`;
    const response = await fetch(url);
    const movies = await response.json();
    return movies;
}