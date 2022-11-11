import { writable } from 'svelte/store';

import JSON1 from '../../data/staffel-1.json';
import JSON2 from '../../data/staffel-2.json';

export const storedData = writable([]);

// videos
//  https://www.youtube.com/watch?v=
//  img.youtube.com/vi/[Video-ID]/0.jpg
//  img.youtube.com/vi/[Video-ID]/default.jpg
const youtubeVideoUrl = (ID) => !!ID ? `https://www.youtube.com/watch?v=${ID}` : '';
const youtubeThumbUrl = (ID) => `https://img.youtube.com/vi/${ID}/default.jpg`;
const preparedStores = [{status: 0, reactions: [], videos: []}, JSON1, JSON2];

preparedStores.map((store, storeIndex) => {
    if (store.status === 0) {
        return store;
    }

    Object.entries(store.status).map(challenger => {
        const tmp = ('' + challenger[1]).split('=');
        const challengePoints = tmp[0].split('|').map((i) => parseInt(i));
        const endResult = challengePoints.reduce((pv, cv) => pv + cv, 0);
        const isOut = challenger[0].includes('*');
        const isWinner = challenger[0].includes('!');
        const tmp2 = ('' + challenger[0]).split('*');
        const exitDay = tmp2.length > 0 ? tmp2[1] : -1;
        store.status[challenger[0]] = {
            name: challenger[0].replace(/\*|\!|\d/g, ''),
            challengePoints,
            endResult,
            isOut,
            isWinner,
            exitDay,
        }
    });

    // @ts-ignore
    const videosLength = store.videos.length;
    store.videos = store.videos.map((video, index) => {
        let reactions = 0;
        Object.keys(store.reactions).map(challenger => {
            if (video.short in store.reactions[challenger]) {
                reactions++;
            }
        });

        const [youtubeID, duration] = video.id.split('|');

        return {
            id: videosLength - index,
            title: video.title,
            url: youtubeVideoUrl(youtubeID),
            thumb: youtubeThumbUrl(youtubeID),
            date: video.date,
            short: video.short,
            duration,
            reactions,
        }
    });

    Object.keys(store.reactions).map(challenger => {
        Object.entries(store.reactions[challenger]).map(episode => {
            if (!!episode[1]) {
                store.reactions[challenger][episode[0]] = {
                    url: youtubeVideoUrl(episode[1]),
                    thumb: youtubeThumbUrl(episode[1]),
                }
            }
        })
    })

    preparedStores[storeIndex] = store;
})


// @ts-ignore
storedData.set(preparedStores);
