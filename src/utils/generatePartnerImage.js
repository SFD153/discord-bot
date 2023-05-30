import { MessageAttachment } from 'discord.js';
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');

export default async ({ fetched_commander_list }) => {
    try {
        let file;
        if (fetched_commander_list.length > 1) {
            let images = fetched_commander_list.map((x) => {
                return {
                    src: x.image_normal,
                    x: 0,
                    y: 0,
                };
            });
            images[1].x = 488;
            const b64 = await mergeImages(images, {
                Canvas: Canvas,
                Image: Image,
                width: 488 * 2,
            });

            let buff = new Buffer.from(b64.split(';base64,').pop(), 'base64');
            file = new MessageAttachment(buff, 'commanders.jpg');
        }

        return file;
    } catch (e) {
        console.log(e);
    }
};
