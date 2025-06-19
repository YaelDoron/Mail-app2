//const HOST = "server";  // IP address of the TCP server (Exercise 2)
const HOST= "172.28.0.2"
const net = require('net'); // Node.js core module for TCP sockets

// Sends a command (GET / POST / DELETE) to the TCP server
const sendToServer = (command, url) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let response = '';
    // Connect to the server on port 12345
    client.connect(3800, HOST, () => {
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

// Checks if any URL from subject or content is blacklisted
const check = async (subject, content) => {
  const urls = [
    ...extractUrls(subject),
    ...extractUrls(content)
  ];
  
  if (urls.length === 0) {
    return false;  // No URLs to check
  }

  for (const url of urls) {
    try {
      const res = await sendToServer('GET', url);
      console.log(">>> Checking URL:", url, "| Server response:", res); //debug
      if (res.includes('true true')) {
        return true;  // URL is blacklisted
      }
    } catch (error) {
      console.error(`>> Error checking URL ${url}:`, error);
      // Continue checking other URLs even if one fails
    }
  }
  return false;  // No blacklisted URLs found
};

// Adds a URL to the blacklist via the TCP server
const add = async (url) => {
  const result = await sendToServer('POST', url);
  return result;
};

// Removes a URL from the blacklist via the TCP server
const remove = async (url) => {
  const decodedUrl = decodeURIComponent(url);
  const result = await sendToServer('DELETE', decodedUrl);
  console.log(">>> Removed from blacklist:", url, "| Result:", result); //debug
  return result;
};

// Extracts URLs from a given text (e.g., subject or content)
const extractUrls = (text) => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const matches = text.match(urlRegex) || [];
  
  // Decode any percent-encoded URLs
  return matches.map(url => {
    try {
      return decodeURIComponent(url);
    } catch (e) {
      console.warn("Failed to decode URL:", url, e.message);
      return url; // // Fallback to original URL if decoding fails
    }
  });
};

module.exports = {
  check,
  add,
  remove,
  extractUrls
};