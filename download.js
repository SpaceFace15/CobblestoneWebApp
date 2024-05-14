// download.js

// This function will be called when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/latest-submission')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); 
        // Replace placeholders in p and li elements
        document.querySelectorAll('p, li').forEach(element => {
            element.innerHTML = element.innerHTML.replace(/{CompanyNameHere}/g, data.companyName)
                                                  .replace(/{CompanyD}/g, data.companyDescription)
                                                  .replace(/{CMissionHere}/g, data.companyMission)
                                                  .replace(/{EQuote}/g, data.employeeQuote);
        });

        // Replace value placeholders
        document.getElementById('Box1').textContent = data.firstValue;
        document.getElementById('Box2').textContent = data.secondValue;
        document.getElementById('Box3').textContent = data.thirdValue;
        document.getElementById('Box4').textContent = data.fourthValue;
        document.getElementById('Box5').textContent = data.fifthValue;
       
        // Replace the image
        const imageUrl = `http://localhost:3000/${data.image.replace(/\\/g, '/')}`;
        console.log('Image URL:', imageUrl);
        const imgElement = new Image();
        imgElement.src = imageUrl;
        imgElement.alt = 'CEO';
        imgElement.width = 300; // Set the width you desire

        // Center the image
        imgElement.style.display = "block"; // Use block display
        imgElement.style.margin = "auto"; // Auto margins work with block elements

        // Append the dynamically created image to the CEOImageContainer
        const ceoImageContainer = document.getElementById('CEOImageContainer');
        ceoImageContainer.appendChild(imgElement);

        // Handling the first week checklist
        const checklistItems = data.firstWeekItems.split('.').filter(Boolean); // Split by '.' and remove empty strings
        const checklistHtml = checklistItems.map(item => `<li>${item.trim()}</li>`).join(''); // Create list items
        document.getElementById('FirstWeekItems').innerHTML = `<ul>${checklistHtml}</ul>`; // Insert as an unordered list
    })
    .catch(error => {
        console.error('Error fetching the last submission:', error);
        alert('Failed to fetch data. Please check the server and the network connection.');
    });
});

  // Add event listener to the "Redo" button
  document.getElementById('redoBtn').addEventListener('click', function() {
    fetch('http://localhost:3000/delete-last-submission', {
        method: 'GET', // Assuming your endpoint is a GET request
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete the last submission');
        }
        return response.json();
    })
    .then(data => {
        console.log('Last submission deleted:', data.message);
        // Redirect to index.html
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
//Add Generate Document functionality here

 // Add event listener to the "Generate Document" button
 document.getElementById('downloadBtn').addEventListener('click', function() {
    fetch('http://localhost:2999/generate-document')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to generate the document');
            }
            // Check for a valid content type before attempting to download
            if (response.headers.get("Content-Type").includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                // Retrieve the filename from the Content-Disposition header
                const disposition = response.headers.get('Content-Disposition');
                let filename = "OnboardingDocument.docx";
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) { 
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }

                // Convert the response into a Blob and create an object URL
                return response.blob().then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a); // Append the anchor for Firefox
                    a.click(); // Simulate click to download
                    window.URL.revokeObjectURL(url); // Clean up
                    a.remove(); // Clean up
                });
            } else {
                throw new Error('Invalid content type for download');
            }
        })
        .catch(error => {
            console.error('Error downloading the document:', error);
            // Optionally inform the user (e.g., through an alert or a message on the page)
            alert('An error occurred while trying to download the document. Please try again.');
        });
});