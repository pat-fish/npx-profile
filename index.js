#!/usr/bin/env node
'use strict';

import chalk from 'chalk'
import boxen from 'boxen'
import clear from 'clear'
import inquirer from 'inquirer'
import Enquirer from 'enquirer'
import open from 'open'
import terminalImage from 'terminal-image';
import got from 'got';
import playSound from 'play-sound';
import fetch from 'node-fetch';

// import fs from 'fs'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let songPath = "./assets/1979.mp3";
let songFile = path.resolve(__dirname, `${songPath}`);

const mountains = await got("https://github.com/PatrickFish-8/npx-profile/blob/master/assets/mountains.jpg?raw=true").buffer();
const mountains2 = await got("https://github.com/PatrickFish-8/npx-profile/blob/master/assets/mountains2.jpg?raw=true").buffer();

clear();

const data = {
    name: chalk.bold.hex('#ADA7C9')("@pfish"),
    github: chalk.hex('#787878')("https://github.com/pat-fish"),
    npx: chalk.hex('#787878')("npx pfish"),
    email: chalk.hex('#787878')("patrickfish10@icloud.com"),

    labelGitHub: chalk.hex('#9E9E9E').bold("git:"),
    labelEmail: chalk.hex('#9E9E9E').bold("eml:"),
    labelCard: chalk.hex('#9E9E9E').bold("npm:"),

}

const card = boxen(
    [
    `${data.name}`,
    ``,
    `${data.labelGitHub} ${data.github}`,
    `${data.labelCard} ${data.npx}`,
    `${data.labelEmail} ${data.email}`,
    ``,
    `${chalk("c'est la vie.")}`,
    `${chalk.italic("it's the life.")}`,
    ].join("\n"),
    {
        margin:0,
        padding: { top: 1, bottom: 1, right: 2, left: 2},
        borderStyle: "double",
        borderColor: "white"
    }
);

console.log(card);
console.log();

const options = {
    type: 'list',
    name: 'actions',
    message: 'select action', 
    choices: [
        {
            name: '| resume',
            value: async () => {
                console.log("opening resume ...")
                open("https://docs.google.com/document/d/1ww4sUPmC81j8lw_XrHVBjQQ61HpWrnSYz5TosbV7zSI/edit?tab=t.0");
            }
        },
        {
            name: '| mountains',
            value: async () => {
                try {
                    console.log(await terminalImage.buffer(mountains, {width: '100%'}));
                    console.log('isn\'t that a nice view?')
                    let e = await Enquirer.prompt({
                        type: "toggle",
                        name: "opinion",
                        message: "do you want to see another mountain?",
                        default: true
                    });
                    if (e.opinion == true) {
                        console.log(await terminalImage.buffer(mountains2, {width: '100%'}));
                        console.log("this one is a really cool picture too!")
                    } else {
                        return;
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        },
        {
            name: '| magma',
            value: async () => {
                try {
                    open("https://www.youtube.com/watch?v=PKVQ5pugma0");
                    console.log("i love this video.  i am a big skier and the \ntricks that these guys do are super impressive.");
                } catch (err) {
                    console.log(err);
                }
            }
        },
        {
            name: '| song',
            value: async () => {
                try {
                    console.log("playing 1979 ...");
                    const player = playSound();
                    let audio = player.play(songFile, function(err){
                        if (err && !err.killed) throw err
                    });

                    let e = await Enquirer.prompt({
                        type: "toggle",
                        name: "opinion",
                        message: "do you like this song?",
                        default: true
                    });

                    if(e.opinion == true) {
                        console.log("i like this song too!");
                    } else {
                        console.log("i'm sorry you don't like this song. it's one of my favorites.");
                        audio.kill();
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        },
        '- exit'
    ]
}

function main() {
    inquirer.prompt(options).then(async answer => {
        if (answer.actions == "- exit") {
            return;
        } 
        else {
            console.log('-'.repeat(40))
            await answer.actions();
            console.log('-'.repeat(40))

            Enquirer.prompt({
                type: "toggle",
                name: "again",
                message: "exit?",
                default: false
            }).then(answer => {
                if (answer.again == false) {
                    main();
                }
            });
        }
    });
}


main();
