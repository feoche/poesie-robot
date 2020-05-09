import Twitter from "twitter";
import minimist from "minimist";
import MarkovChain from "markovchain";
import data from "./data.js";
import fs from "fs";

// Retrieve args
const args = minimist(process.argv.slice(2));

let tweets = data || [];

// create an object using the keys we just determined
const twitterAPI = new Twitter({
  consumer_key: process.env.CONSUMER_TOKEN || args.consumer_key,
  consumer_secret: process.env.CONSUMER_SECRET || args.consumer_secret,
  access_token_key: process.env.ACCESS_TOKEN_KEY || args.access_token_key,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || args.access_token_secret
});

const tweet = newTweet => {
  if (!args.test) {
    twitterAPI.post("statuses/update", { status: newTweet.substring(0, 280) },
      error => {
        if (error) {
          console.error("Error: ", error);
        }
      }
    );
  }
};

const generateMarkov = () => {
  const markov = new MarkovChain(tweets.join("\n"));

  let newTweet = markov.end(30).process(); // Set the word limit to 30

  // Prettify the output
  newTweet = newTweet.charAt(0).toUpperCase() + newTweet.slice(1);
  newTweet = newTweet.replace(/([,!] )(\w)/g, (match, $1, $2) => {
    return `${$1}\n${$2.toUpperCase()}`;
  }).substring(0, 280);

  console.info(
    "\x1b[96m", ("[" + new Date().toLocaleTimeString() + "]").padStart(10),
    "\x1b[0m", newTweet.padEnd(125)
  );

  tweet(newTweet.substring(0, 280));
};


generateMarkov();

