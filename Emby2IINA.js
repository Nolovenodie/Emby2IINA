// ==UserScript==
// @name         Emby2IINA
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description:zh-cn emby调用iina
// @author       @Nolovenodie
// @include       *你的Emby域名或IP地址*
// @include       *:8*
// @run-at      document-start
// @grant       unsafeWindow
// ==/UserScript==

const originFetch = fetch;
unsafeWindow.fetch = (...arg) => {
	if (arg[0].indexOf("/PlaybackInfo?UserId") > -1 && arg[0].indexOf("IsPlayback=true") > -1) {
		embyIINA(arg[0]);
        return;
	}
    return originFetch(...arg);
};

async function getItemInfo(itemInfoUrl) {
	let response = await fetch(itemInfoUrl);
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.statusText);
	}
}

async function getEmbyMediaUrl(itemInfoUrl) {
	let itemInfo = await getItemInfo(itemInfoUrl);

	let url = itemInfo.MediaSources[0].Path.replace("你的Rclone路径", "你的OneIndex地址");
    // let sub = itemInfo.MediaSources[0].MediaStreams[itemInfo.MediaSources[0].DefaultSubtitleStreamIndex].Path.replace("你的Rclone路径", "你的OneIndex地址");

    console.log("影片地址: ", url)
    // console.log("字幕地址: ", sub)
	return url;
}

async function embyIINA(itemInfoUrl) {
	let mediaUrl = await getEmbyMediaUrl(itemInfoUrl);
	let iinaUrl = `iina://open?full_screen=1&url=${encodeURI(mediaUrl)}`;

	window.open(iinaUrl);
}
