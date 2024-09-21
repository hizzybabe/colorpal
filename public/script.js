document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('paletteForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await generatePalette();
    });
});


async function generatePalette() {
    const prompt = document.getElementById('prompt').value;
    try {
        const response = await fetch('/generate-palette', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawResponse = await response.text();
        console.log('Raw response:', rawResponse);
        
        let colors;
        try {
            colors = JSON.parse(rawResponse);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            colors = rawResponse.split(',').map(color => color.trim());
        }
        console.log('Processed colors:', colors);
        
        displayPalette(colors);
    } catch (error) {
        console.error('Detailed Error:', error);
        alert(`An error occurred while generating the palette: ${error.message}`);
    }
}


function displayPalette(colors) {
    const paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';
    colors.forEach(color => {
        console.log('Processing color:', color);
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        const colorValue = typeof color === 'object' ? color.hex : color;
        colorBox.style.backgroundColor = colorValue;
        
        const colorCode = document.createElement('div');
        colorCode.className = 'color-code';
        colorCode.textContent = colorValue;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.onclick = () => copyToClipboard(colorValue);
        
        colorItem.appendChild(colorBox);
        colorItem.appendChild(colorCode);
        colorItem.appendChild(copyButton);
        paletteDiv.appendChild(colorItem);
    });
}

function copyToClipboard(text) {  
    navigator.clipboard.writeText(text).then(() => {  
        alert('Color code copied to clipboard!');  
    }, (err) => {  
        console.error('Could not copy text: ', err);  
    });  
}  

// Theme toggle functionality  
const themeToggle = document.getElementById('theme-toggle');  
const htmlElement = document.documentElement;  

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
});

// Check for saved theme preference or prefer-color-scheme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    applyTheme(savedTheme);
} else if (prefersDark) {
    applyTheme('dark');
} else {
    applyTheme('light');
}

function applyTheme(theme) {
    console.log('Applying theme:', theme);
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }