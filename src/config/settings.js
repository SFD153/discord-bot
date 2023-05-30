const settings = {
    channels: {
        get_help: {
            development: '846013084896067614',
            production: '847356745986867240',
        },
        bounty_board: {
            development: '846020389062443028',
            production: '851479909532434453',
        },
        workshop_category: {
            development: ['847460751940780072', '861229077784428584', '861229129159802920'],
            production: ['852304713478176779', '858074483159203920', '858074558782111755'],
        },
        history: {
            development: '850215136962936902',
            production: '852304818553749505',
        },
    },
    servers: {
        development: '845671055384772698',
        production: '845023235422421056',
    },
    images: {
        bot_logo: 'https://i.imgur.com/ZgRIZKY.png',
    },
    emojis: {
        colors: {
            development: {
                B: '<:black:849853807646998569>',
                G: '<:green:849853807834824724>',
                W: '<:white:849853807680815135>',
                U: '<:blue:849806177193295883>',
                R: '<:red:849853807831810058>',
                X: '<:colorless:850699473159323718>',
            },
            production: {
                B: '<:black:852309843804815371>',
                G: '<:green:852309843753828403>',
                W: '<:white:852309843963412490>',
                U: '<:blue:852309843905347646>',
                R: '<:red:852309843477397516>',
                X: '<:colorless:852309844073381938>',
            },
        },
        site_logos: {
            development: {
                archidekt: '<:archidekt:851756895358550016>',
                moxfield: '<:moxfield:851757319067140106>',
                tappedout: '<:tappedout:851757413836259369>',
                deckstats: '<:deckstats:851757582339014678>',
                aetherhub: '<:aetherhub:851757268894482462>',
            },
            production: {
                archidekt: '<:archidekt:852311100183281664>',
                moxfield: '<:moxfield:852311110794084372>',
                tappedout: '<:tappedout:852311086975811666>',
                deckstats: '<:deckstats:852311069333913600>',
                aetherhub: '<:aetherhub:852311166130585650>',
            },
        },
        loading: {
            development: '<a:loading:861712249054822410>',
            production: '<a:loading:861723188719255602>',
        },
    },
    approved_sites: [
        {
            base_url: 'https://archidekt.com/',
            site_name: 'Archidekt',
            domain: 'archidekt',
            tld: 'com',
            get emoji() {
                return settings.emojis.site_logos[process.env.NODE_ENV].archidekt;
            },
        },
        {
            base_url: 'https://www.moxfield.com/',
            site_name: 'Moxfield',
            domain: 'moxfield',
            tld: 'com',
            get emoji() {
                return settings.emojis.site_logos[process.env.NODE_ENV].moxfield;
            },
        },
        {
            base_url: 'https://tappedout.net/',
            site_name: 'TappedOut',
            domain: 'tappedout',
            tld: 'net',
            get emoji() {
                return settings.emojis.site_logos[process.env.NODE_ENV].tappedout;
            },
        },
        {
            base_url: 'https://deckstats.net/',
            site_name: 'DeckStats',
            domain: 'deckstats',
            tld: 'net',
            get emoji() {
                return settings.emojis.site_logos[process.env.NODE_ENV].deckstats;
            },
        },
        {
            base_url: 'https://aetherhub.com/',
            site_name: 'AetherHub',
            domain: 'aetherhub',
            tld: 'com',
            get emoji() {
                return settings.emojis.site_logos[process.env.NODE_ENV].aetherhub;
            },
        },
    ],
};

export default {
    channel: (channel) => {
        const { NODE_ENV } = process.env;
        if (NODE_ENV === 'development' || NODE_ENV === 'production') {
            return settings.channels[channel][NODE_ENV];
        } else {
            throw new Error(
                'channel() method: Environment variable: "NODE_ENV" has unknown value.'
            );
        }
    },
    server: () => {
        const { NODE_ENV } = process.env;
        if (NODE_ENV === 'development' || NODE_ENV === 'production') {
            return settings.servers[NODE_ENV];
        } else {
            throw new Error('server() method: Environment variable: "NODE_ENV" has unknown value.');
        }
    },
    image: (arg) => {
        return settings.images[arg];
    },
    emoji: (arg) => {
        const { NODE_ENV } = process.env;
        return settings.emojis[arg][NODE_ENV];
    },
    approved_sites: () => {
        return settings.approved_sites;
    },
};
