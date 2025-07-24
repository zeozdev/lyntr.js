export { Client } from './functions.js';

// Example
const bot = new Client("your_token_here");

// send a message on a post
bot.SendMessage("post_id", "Hello, World!");
