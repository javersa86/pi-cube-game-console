const { execSync, exec } = require('child_process');
const fs = require('fs');

const STATE_FILE = process.env.NODE_ENV === 'production'
  ? '/etc/brightness.state'
  : `${process.env.HOME}/.brightness.state`;

function detectDisplay() {
  try {
    const output = execSync('ddcutil detect --brief 2>/dev/null').toString();
    const match = output.match(/I2C bus:\s+(\/dev\/i2c-\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function applyBrightness(value) {
  // value is 0.0 - 1.0, ddcutil expects 0-100
  const level = Math.round(value * 100);
  try {
    execSync(`ddcutil setvcp 10 ${level} 2>/dev/null`);
    fs.writeFileSync(STATE_FILE, String(value));
    return true;
  } catch {
    return false;
  }
}

function loadBrightness() {
  try {
    const val = parseFloat(fs.readFileSync(STATE_FILE, 'utf8').trim());
    return isNaN(val) ? 1.0 : Math.min(1.0, Math.max(0.0, val));
  } catch {
    return 1.0;
  }
}

module.exports = { applyBrightness, loadBrightness, detectDisplay };