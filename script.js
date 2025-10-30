document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const imagePreview = document.getElementById('imagePreview');
    const resultsSection = document.querySelector('.results-section');
    const probabilityElement = document.getElementById('probability');
    const classificationElement = document.getElementById('classification');
    const latencyElement = document.getElementById('latency');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    const API_URL = 'https://cxr.yashmishra.xyz'; // Update this with your API URL

    // Preview image when selected
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                resultsSection.style.display = 'none';
                errorElement.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle image upload and analysis
    uploadBtn.addEventListener('click', async () => {
        const file = imageInput.files[0];
        if (!file) {
            showError('Please select an image first.');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Show loading state
            loadingElement.style.display = 'block';
            uploadBtn.disabled = true;
            errorElement.style.display = 'none';

            // Send request to API
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Process results
            const result = await response.json();
            
            // Display results
            probabilityElement.textContent = `${(result.probability * 100).toFixed(2)}%`;
            classificationElement.textContent = result.label === 1 ? 'Pneumonia Detected' : 'Normal';
            latencyElement.textContent = `${result.latency_ms.toFixed(2)}ms`;
            
            // Show results section
            resultsSection.style.display = 'block';
        } catch (error) {
            showError('Error analyzing image. Please try again.');
            console.error('Error:', error);
        } finally {
            // Hide loading state
            loadingElement.style.display = 'none';
            uploadBtn.disabled = false;
        }
    });

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
});