const net = require('net');

// שולח פקודה (GET / POST / DELETE) לשרת תרגיל 2
const sendToServer = (command, url) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let response = '';

    client.connect(12345, 'localhost', () => {
      client.write(`${command} ${url}\n`);
    });

    client.on('data', (data) => {
      response += data.toString();
      client.destroy(); // סוגרים אחרי קבלת תשובה
      resolve(response.trim());
    });

    client.on('error', reject);
  });
};

// בודק אם אחד הקישורים מתוך subject + content מופיע ב־blacklist
const check = async (subject, content) => {
  const urls = [
    ...extractUrls(subject),
    ...extractUrls(content)
  ];
  if (urls.length === 0) return false;

  for (const url of urls) {
    const res = await sendToServer('GET', url);
    if (res === 'true true') return true;
  }

  return false;
};

// מוסיף קישור לרשימה האסורה
const add = async (url) => {
  return await sendToServer('POST', url);
};

// מוחק קישור מהרשימה האסורה
const remove = async (url) => {
  return await sendToServer('DELETE', url);
};

// מחלץ קישורים מתוך טקסט (subject או content)
const extractUrls = (text) => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.match(urlRegex) || [];
};

module.exports = {
  check,
  add,
  remove
};
