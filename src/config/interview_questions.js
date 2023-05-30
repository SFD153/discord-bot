import settings from './settings';

export default [
    {
        key: 'decklist',
        question:
            "Thanks for using DeckTuner! Let's get started. First, paste a link to your deck in the message box below using one of the following approved deck builder sites:",
        details: {
            title: '\u200b',
            body: settings
                .approved_sites()
                .map((x) => `${x.emoji} [${x.site_name}](${x.base_url})`)
                .join('\n'),
        },
    },
    {
        question:
            "Perfect, now tell us who your commander is along with partners.\nSeparate each commander's name with a plus sign (+) or with a new line (shift+enter).\nYou can use an autofill search although the exact name will be more accurate to the commander you're looking for.",
        key: 'commander',
    },
    {
        question: `Ok, now lets choose what kind of multiplayer experience you want this deck to create. Social, Casual, Competitive, or cEDH. Refer to [our list of categories here](https://docs.google.com/document/d/13ni10EIW3hvKNdKXSLUHo2uBaQOn-Y7A4Pxwo1IY8mU/edit) if you're not sure.`,
        key: 'desired_experience',
    },
    {
        question: [
            `Got it. Now set your budget for **changes and upgrades only**. If you also have a spending limit per card you can list that after the changes budget separated by “/”.`,
            `Please use your preferred currency denotations.`,
            `Example:`,
            '```$50/$10```',
            `If your entire deck needs to stay under a total budget, be sure to mention that in the question about tuning goals later. If you’re a supreme being with no financial restrictions just say **"No budget"**.`,
        ].join('\n'),
        key: 'budget',
    },
    {
        question: `Nice, we can work with that. Now, in a few sentences, describe how you want this deck to work and what [sub category](https://docs.google.com/document/d/13ni10EIW3hvKNdKXSLUHo2uBaQOn-Y7A4Pxwo1IY8mU/edit) you would like to target. If you're not exactly sure, try answering the following questions: How do you want to win? What's the overall strategy? Is it built around the commander(s) or a certain set of cards?`,
        key: 'deck_goals',
    },
    {
        question: `Sounds good. Now tell us what you'd like the tuners to help you with. It can be anything from “upgrade it to a competitive deck” to “help me find more Nirvana references for my janky tribute deck.`,
        key: 'tuning_goals',
    },
    {
        question: `How much would you be willing to tip your tuner if they do a great job?`,
        key: 'tip_amount',
    },
];
