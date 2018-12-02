'use strict';
const Alexa = require('alexa-sdk');
const fetch = require("node-fetch");
const console = require("console");

const SKILL_NAME = 'BetaSeries';
const GET_FACT_MESSAGE = "Les séries du jour sont : ";
const HELP_MESSAGE = 'Vous pouvez me demander les séries du jour.';
const HELP_REPROMPT = 'Vous voulez connaître les séries du jour ?';
const STOP_MESSAGE = 'OK, je la ferme !';

const handlers = {
    'LaunchRequest': function () {
        this.emit('recherche_series');
    },
    'recherche_series': function () {
        let accessKey = process.env.ConstellationAccessKey;

        fetch(`https://constellation.roddone.ovh/rest/consumer/RequestStateObjects?SentinelName=Consumer&PackageName=Alexa&AccessKey=${accessKey}&package=BetaSeries&name=Planning`)
            .then(response => response.json())
            .then(json => {

                let today = new Date();
                let date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
                let response = json[0].Value;
                let custom = false;
                let episodes = [];
                let episodes_card = [];

                if (this.event.request.intent.slots
                    && this.event.request.intent.slots.date
                    && this.event.request.intent.slots.date.value) {
                    date = this.event.request.intent.slots.date.value;
                    custom = true;
                }

                for (let item of response) {
                    if (item.date != date) {
                        continue;
                    }
                    else {
                        let title = item.show.title.replace(/ *\([^)]*\)$/g, ""); // remove parenthesis

                        episodes.push(process.env.Lang ? `<lang xml:lang="${process.env.Lang}">${title}</lang>` : title);

                        episodes_card.push(item.show.title);
                    }
                }

                let episodes_str = episodes.join(' , ');
                let pos = episodes_str.lastIndexOf(',');
                if (pos != -1) {
                    episodes_str = episodes_str.substring(0, pos) + "et" + episodes_str.substring(pos + 1);
                }

                let episodes_card_str = episodes_card.join(' , ');
                pos = episodes_card_str.lastIndexOf(',');
                if (pos != -1) {
                    episodes_card_str = episodes_card_str.substring(0, pos) + "et" + episodes_card_str.substring(pos + 1);
                }

                this.response.cardRenderer(SKILL_NAME, `${date} - ${episodes_card_str || "pas d'épisodes"}`);

                if (episodes.length == 0) {
                    this.response.speak(`Il n'y a pas de nouveaux épisodes ${custom ? "le jour demandé" : "aujourd'hui"}`);
                }
                else {
                    this.response.speak(`Les épisodes ${custom ? "du jour demandé" : "d'aujourd'hui"} sont : ${episodes_str}`);
                }
                this.emit(':responseReady');

            });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {

    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = process.env.AppId;

    alexa.registerHandlers(handlers);
    alexa.execute();
};
