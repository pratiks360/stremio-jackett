import getTorrentInfo from "../jackett/utils/getTorrentInfo.js";
import processXML from "../jackett/utils/processXML.js";

async function getItemsFromUrl(url) {
	const res = await fetch(url);

	const items = await processXML(await res.text());

	return items;
}

export async function jackettCache(jackettUrl, jackettApi, list, category) {
	const results = [];
	if (category === "movie") {
		if (list.length !== 0) {
			for (const elem of list) {
				console.log(elem.title);
				const searchUrl = `${jackettUrl}/api/v2.0/indexers/all/results/torznab/api?apikey=${jackettApi}&t=movie&cat=2000&q=${encodeURIComponent(elem.title)}&year=${elem.year}`;
				const items = await getItemsFromUrl(searchUrl);
				let increment = 0;
				for (const item of items) {
					if (increment === 20) break;
					results.push({
						title: item.title,
						size: item.size,
						link: item.link,
						seeders: item.seeders,
						torrentInfo: await getTorrentInfo(item.link),
						dateAdded: Date.now(),
					});
					increment += 1;
				}
			}
		}
	}
	if (category === "series") {
		if (list.length !== 0) {
			for (const elem of list) {
				const searchUrl = `${jackettUrl}/api/v2.0/indexers/all/results/torznab/api?apikey=${jackettApi}&t=search&cat=5000&q=${encodeURIComponent(elem.title)}`;
				const items = await getItemsFromUrl(searchUrl);
				let increment = 0;
				for (const item of items) {
					if (increment === 20) break;
					results.push({
						title: item.title,
						size: item.size,
						link: item.link,
						seeders: item.seeders,
						torrentInfo: await getTorrentInfo(item.link),
						dateAdded: Date.now(),
					});
					increment += 1;
				}
			}
		}
	}
	return results;
}
