import fs from 'fs';

async function pollVercel() {
    const url = 'https://livaro-frontend.vercel.app/api/analyze';
    console.log(`Polling ${url} ...`);
    
    let attempts = 0;
    while (attempts < 30) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: 'What is the outlook for commercial plots in DHA Phase 6?' })
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log("Success! Writing HTML...");
                
                const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Staging API Verification</title>
    <style>
        body { background-color: #0d1117; color: #c9d1d9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; padding: 40px; }
        h2 { color: #58a6ff; font-size: 24px; margin-bottom: 5px; }
        .url { color: #8b949e; font-size: 14px; margin-bottom: 20px; font-family: monospace;}
        pre { background-color: #161b22; padding: 20px; border-radius: 6px; border: 1px solid #30363d; overflow: auto; white-space: pre-wrap; font-size: 15px; color: #e6edf3; }
        .status { margin-bottom: 15px; font-weight: bold; font-size: 18px; display: inline-block; padding: 5px 10px; border-radius: 4px; }
        .success { color: #3fb950; border: 1px solid rgba(63, 185, 80, 0.4); background: rgba(63, 185, 80, 0.1); }
    </style>
</head>
<body>
    <h2>Livaro API Staging Verification</h2>
    <div class="url">POST https://livaro-frontend.vercel.app/api/analyze</div>
    <div class="status success">HTTP 200 OK</div>
    <pre id="output">${JSON.stringify(data, null, 2)}</pre>
</body>
</html>`;
                fs.writeFileSync('test_staging_success.html', html);
                process.exit(0);
            } else {
                console.log(`Attempt ${attempts}: HTTP ${res.status} - Not ready yet.`);
            }
        } catch (e) {
            console.log(`Attempt ${attempts}: Network Error (${e.message})`);
        }
        attempts++;
        await new Promise(r => setTimeout(r, 10000)); // wait 10 seconds between attempts
    }
    console.error("Failed to get 200 OK after 5 minutes.");
    process.exit(1);
}

pollVercel();
