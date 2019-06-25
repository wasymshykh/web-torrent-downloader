const WebTorrent = require("webtorrent");
const cli = require("cli-progress");

let _wt = new WebTorrent();

// magnet url
let torrentMagnet =
    "magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fbig-buck-bunny.torrent";

_wt.add(torrentMagnet, function(torrent) {
    let torrentsize = 0;
    torrent.files.forEach(file => {
        torrentsize += file.length / (1024 * 1024);
    });

    const _bar = new cli.Bar(
        {
            format:
                "[{bar}] {percentage}% - ETA: {timeeta} - {value}Mb/{total}Mb - Speed: {speed}Kb/s"
        },
        cli.Presets.shades_grey
    );
    _bar.start(torrentsize.toFixed(2), 0);

    torrent.on("done", () => {
        console.log("Finished downloading");
        _bar.stop();
        _wt.destroy();
    });

    torrent.on("download", () => {
        let rem_seconds = torrent.timeRemaining / 1000;
        let rem_hours = parseInt(rem_seconds / 3600); // remaining hours
        rem_seconds = rem_seconds % 3600; // remaining seconds after - sub hours
        let rem_minutes = parseInt(rem_seconds / 60); // remaining minutes
        rem_seconds = parseInt(rem_seconds % 60); // remaing seconds after - sub minutes

        _bar.update((torrent.downloaded / (1024 * 1024)).toFixed(2), {
            timeeta: `${rem_hours}h ${rem_minutes}m ${rem_seconds}s`,
            speed: (torrent.downloadSpeed / 1024).toFixed(0)
        });
    });

    torrent.on("error", err => {
        console.log("Error!");
        _bar.stop();
        _wt.destroy();
    });
});
