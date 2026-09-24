const { exec } = require('child_process');

const MIN_DB = -10239;
const MAX_DB = 400;

function dbToLevel(db) {
    return Math.max(0, Math.min(1, (db - MIN_DB) / (MAX_DB - MIN_DB)));
}

function levelToDb(level) {
    return Math.round(MIN_DB + level * (MAX_DB - MIN_DB));
}

function getVolume() {
    return new Promise((resolve, reject) => {
        exec("amixer -c 2 cget numid=1", (err, stdout) => {
            if (err) return reject(err);
            console.log('amixer output:', stdout);
            const line = stdout.split('\n').find(l => l.includes(': values='));
            if (!line) return reject(new Error('Could not find values line'));
            const db = parseInt(line.split('values=')[1].trim());
            if (isNaN(db)) return reject(new Error('Could not parse db value'));
            resolve(dbToLevel(db));
        });
    });
}

function setVolume(level) {
    return new Promise((resolve, reject) => {
        if (level < 0 || level > 1) return reject(new Error('Volume must be between 0.0 and 1.0'));
        const db = levelToDb(level);
        exec(`amixer -c 2 cset numid=1 -- ${db}`, (err) => {
            if (err) return reject(err);
            resolve(level);
        });
    });
}

function toggleMute() {
    return new Promise((resolve, reject) => {
        exec("amixer -c 2 cget numid=2", (err, stdout) => {
            if (err) return reject(err);
            const line = stdout.split('\n').find(l => l.includes(': values='));
            const muted = line && (line.includes('values=off') || line.includes('values=0'));
            const newVal = muted ? 'on' : 'off';
            exec(`amixer -c 2 cset numid=2 ${newVal}`, (err2) => {
                if (err2) return reject(err2);
                resolve(!muted);
            });
        });
    });
}

module.exports = { getVolume, setVolume, toggleMute };