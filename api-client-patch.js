const fs = require('fs');

// Read the current API client
let content = fs.readFileSync('src/lib/api-client-v2.ts', 'utf8');

// Find the request method and modify it to include token
if (content.includes('private async request<TResponse, TBody = unknown>')) {
  // Replace the headers section to include token
  content = content.replace(
    /const init: RequestInit = {[^}]+}/,
    `const token = localStorage.getItem('auth_token');\n\t\tconst init: RequestInit = {\n\t\t\tmethod,\n\t\t\tcredentials: "include",\n\t\t\theaders: { \n\t\t\t\t...this.defaultHeaders, \n\t\t\t\t...(token && { 'Authorization': \\`Token \\${token}\\` }),\n\t\t\t\t...headers \n\t\t\t},\n\t\t\tsignal,\n\t\t}`
  );
  
  fs.writeFileSync('src/lib/api-client-v2.ts', content);
  console.log('✅ API client updated to use token authentication');
} else {
  console.log('❌ Could not find request method to patch');
}
