import yargs from "yargs";
import {fetchCards} from "./api/cards.js";

export const cliParams = yargs(process.argv).argv;

if (!cliParams.email) {
    console.error('--email is required param');
    process.exit();
}

if (!cliParams.token) {
    console.error('--token is required param');
    process.exit();
}

console.log('==> Download cards');
const cards = await fetchCards();

console.log(cards);
