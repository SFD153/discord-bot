import { fromUrl, parseDomain } from 'parse-domain';
import settings from '../config/settings';

export default ({ content } = {}) => {
    const parsed = parseDomain(fromUrl(content));
    const { domain, topLevelDomains, type } = parsed;
    // this might be a useless conditional:
    if (type === 'INVALID') {
        return { content, proceed: false, error: 'Invalid link.' };
    }
    // console.log(subDomains); // ["www", "some"]
    // console.log(domain); // "example"
    // console.log(topLevelDomains); // ["co", "uk"]

    const correct_link = settings
        .approved_sites()
        .some((x) => domain === x.domain && topLevelDomains.includes(x.tld));

    if (!correct_link) {
        return {
            content,
            proceed: false,
            error: '❌ Submitted deck is not from an approved site. Check to make sure the URL is correct and then please try again.',
        };
    }

    return { content, proceed: true };
};
