const fs = require('fs');

let content = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Find the index of the second `import { useState, useEffect } from "react";`
const marker = 'import { useState, useEffect } from "react";';
const firstIndex = content.indexOf(marker);
const secondIndex = content.indexOf(marker, firstIndex + marker.length);

if (secondIndex !== -1) {
    // Check if `getImageUrl` is imported in the second half
    let newContent = content.substring(secondIndex);
    if (!newContent.includes('import { getImageUrl }')) {
        newContent = 'import { getImageUrl } from "@/lib/utils";\n' + newContent;
    }
    fs.writeFileSync('src/pages/Checkout.jsx', newContent);
    console.log('Fixed duplication');
} else {
    // If we only have one, let's make sure it's valid code at least.
    console.log('No duplication found.');
}
