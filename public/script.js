document.getElementById('paletteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = document.getElementById('prompt').value;
    try {
        const response = await fetch('/generate-palette', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const colorData = await response.json();
        displayPalette(colorData);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating the palette. Please try again.');
    }
});

function displayPalette(colorData) {
    const paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';
    colorData.forEach(({ color, hexCode }) => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        
        const hexText = document.createElement('p');
        hexText.textContent = hexCode;
        hexText.className = 'hex-code';
        
        colorBox.appendChild(hexText);
        paletteDiv.appendChild(colorBox);
    });
}