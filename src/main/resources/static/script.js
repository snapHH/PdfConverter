document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const browseButton = document.getElementById('browseButton');
    const convertButton = document.getElementById('convertButton');
    const fileInfo = document.getElementById('fileInfo');
    const downloadLink = document.getElementById('downloadLink');

    uploadArea.addEventListener('click', () => fileInput.click());
    browseButton.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('pulse');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('pulse');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('pulse');
        fileInput.files = e.dataTransfer.files;
        updateFileInfo();
    });

    fileInput.addEventListener('change', updateFileInfo);

    function updateFileInfo() {
        const file = fileInput.files[0];
        if (file) {
            fileInfo.textContent = `Selected file: ${file.name}`;
            convertButton.disabled = false;
        } else {
            fileInfo.textContent = '';
            convertButton.disabled = true;
        }
    }

    convertButton.addEventListener('click', convertFile);

    async function convertFile() {
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a Word file.");
            return;
        }

        convertButton.disabled = true;
        convertButton.textContent = 'Converting...';
        convertButton.classList.add('pulse');

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch('/api/files/convert', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = "converted.pdf";
                link.textContent = "Download PDF";
                downloadLink.innerHTML = "";
                downloadLink.appendChild(link);
                
                convertButton.textContent = 'Conversion Complete!';
                setTimeout(() => {
                    convertButton.textContent = 'Convert to PDF';
                    convertButton.disabled = false;
                }, 3000);
            } else {
                alert("Failed to convert file.");
                convertButton.textContent = 'Convert to PDF';
                convertButton.disabled = false;
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
            convertButton.textContent = 'Convert to PDF';
            convertButton.disabled = false;
        }

        convertButton.classList.remove('pulse');
    }
});