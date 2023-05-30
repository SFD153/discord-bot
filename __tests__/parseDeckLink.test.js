const parseDeckLink = require('../src/utils/parseDeckLink').default;

const passingCases = [
    'https://archidekt.com/decks/1454127#Extus',
    'https://www.archidekt.com/decks/1454127#Extus',
    'archidekt.com/decks/1454127#Extus',
    'https://www.moxfield.com/decks/P5aVonnMIkim1NtJ5IrFSg',
    'moxfield.com/decks/P5aVonnMIkim1NtJ5IrFSg',
    'https://tappedout.net/mtg-decks/anje-wheel-2/',
    'https://www.tappedout.net/mtg-decks/anje-wheel-2/',
    'tappedout.net/mtg-decks/anje-wheel-2/',
    'https://deckstats.net/decks/188315/2198750-white-black-vampire/en',
    'https://www.deckstats.net/decks/188315/2198750-white-black-vampire/en',
    'deckstats.net/decks/188315/2198750-white-black-vampire/en',
    'https://aetherhub.com/Deck/scarab-barely-knew-em-584927',
    'https://www.aetherhub.com/Deck/scarab-barely-knew-em-584927',
    'aetherhub.com/Deck/scarab-barely-knew-em-584927',
];

const invalidCases = [
    "google.com",
    "https://www.google.com",
    "https://www.google.com",
    'https://archidektcom/decks/1454127#Extus',
    'https://www.moxfieldcom/decks/P5aVonnMIkim1NtJ5IrFSg',
    'https://tappedoutnet/mtg-decks/anje-wheel-2/',
    'https://deckstatsnet/decks/188315/2198750-white-black-vampire/en',
    'https://aetherhubcom/Deck/scarab-barely-knew-em-584927',
]

describe('passing valid links to parseDeckLink', () => {
    it.each(passingCases)('%p should be a valid link', (content) => {
        const output = parseDeckLink({ content });

        expect(output).toHaveProperty('content');
        expect(output).toHaveProperty('proceed', true);
    });
});

describe('passing invalid links to parseDeckLink in the form of invalid links', () => {
    it.each(invalidCases)('%p should be a invalid link', (content) => {
        const output = parseDeckLink({ content });

        expect(output).toHaveProperty('content');
        expect(output).toHaveProperty('proceed', false);
        expect(output).toHaveProperty('error');
    });
});
