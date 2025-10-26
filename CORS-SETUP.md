# CORS Proxy Setup

The error "Using fallback data - API connection failed" occurs because of CORS (Cross-Origin Resource Sharing) restrictions when accessing the API from a browser.

## Quick Fix: Run CORS Proxy Server

1. **Install Node.js** (if not already installed)
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the proxy server:**
   ```bash
   npm start
   ```
4. **Keep the proxy running** while testing the website

## What the Proxy Does

- Runs on `http://localhost:3001`
- Fetches data from the real APIs
- Serves it without CORS restrictions
- Automatically detects localhost and uses proxy

## Alternative Solutions

### Option 1: Use Browser with CORS Disabled
```bash
# Chrome (macOS)
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

# Chrome (Windows)
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
```

### Option 2: Deploy to Netlify
The CORS issue only affects local development. When deployed to Netlify, the APIs should work fine.

### Option 3: Use Fallback Data
The website already includes fallback data, so it will work even without API access.

## Testing

1. Start the proxy server: `npm start`
2. Open the website: `http://127.0.0.1:5500`
3. The error message should disappear and real data should load
