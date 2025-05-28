const HOST = "172.28.0.2";
const net = require('net');

// שולח פקודה (GET / POST / DELETE) לשרת תרגיל 2
const sendToServer = (command, url) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let response = '';

    client.connect(12345, HOST, () => {
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
  
  if (urls.length === 0) {
    return false;
  }

  for (const url of urls) {
    try {
      const res = await sendToServer('GET', url);
      // בדוק גם 'true' וגם 'true true' למקרה שהשרת מחזיר פורמטים שונים
      if (res === 'true' || res === 'true true' || res.includes('true')) {
        return true;
      }
    } catch (error) {
      console.error(`>> Error checking URL ${url}:`, error);
      // במקרה של שגיאה, נמשיך לבדוק URLs נוספים
    }
  }
  return false;
};

// מוסיף קישור לרשימה האסורה
const add = async (url) => {
  const result = await sendToServer('POST', url);
  return result;
};

// מוחק קישור מהרשימה האסורה
const remove = async (url) => {
  const result = await sendToServer('DELETE', url);
  return result;
};

// מחלץ קישורים מתוך טקסט (subject או content)
const extractUrls = (text) => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const matches = text.match(urlRegex) || [];
  
  // דקודינג של URL encoding בקישורים שנמצאו
  return matches.map(url => {
    try {
      return decodeURIComponent(url);
    } catch (e) {
      console.warn("Failed to decode URL:", url, e.message);
      return url; // אם הדקודינג נכשל, השתמש ב-URL המקורי
    }
  });
};

module.exports = {
  check,
  add,
  remove
};