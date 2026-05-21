function timeToMs(timeStr) {
  const [hms, ms] = timeStr.split(',');
  const [h, m, s] = hms.split(':').map(Number);
  return h * 3600000 + m * 60000 + s * 1000 + Number(ms || 0);
}

function msToTimeStr(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function parseSRT(content) {
  const blocks = content.split(/\n\s*\n/).filter(block => block.trim());
  const subtitles = [];

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 2) continue;

    const timecodeLine = lines[1];
    const [startTime] = timecodeLine.split(' --> ');

    if (!startTime) continue;

    const text = lines.slice(2).join('\n').trim();
    if (!text) continue;

    const startMs = timeToMs(startTime.trim());
    const startTimeStr = msToTimeStr(startMs);

    subtitles.push({
      time_msec: startMs,
      start_time: startTimeStr,
      recognition0: text
    });
  }

  return subtitles;
}

module.exports = { parseSRT };
