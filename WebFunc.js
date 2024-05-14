
//index is 1 through 3
let index = 1;
let Endindex = 3;

//Prev and Next Button
let Prevbtn = document.getElementById("Previousbtn");
let Nextbtn = document.getElementById("Nextbtn");

//Top 3 buttons
let Welcomebtn = document.getElementById("Welcome");
let Missionbtn = document.getElementById("MissionNValues");
let FirstWeekbtn = document.getElementById("FirstWeek");
 
//Inactive/Active colors
let NonActiveColor = "rgba(120, 195, 233, 0.50)";
let ActiveColor =   "rgba(120, 195, 233, 0.99)";


//All layouts 

let CurrentLayout = document.getElementById(`Layout${index}`);

// Previous Button Functionality
Prevbtn.addEventListener("click", function() {
    if (index > 1) {
        index--;
        checkWhichActive();
        
    }
    updateButtonStates();
});



//Making top buttons clickable as well

let topbtnlayout = document.querySelector(`.Layout${1}`);


Welcomebtn.addEventListener("click", function() {

     //initalizing it based on button
    topbtnlayout = document.querySelector(`.Layout${1}`);

    topbtnlayout.style.display = 'block';
    topbtnlayout = document.querySelector(`.Layout${2}`);
    topbtnlayout.style.display = 'none';
    topbtnlayout = document.querySelector(`.Layout${3}`);
    topbtnlayout.style.display = 'none';

    //Changing the colors
    Welcomebtn.style.backgroundColor = ActiveColor;
    Missionbtn.style.backgroundColor = NonActiveColor;
    FirstWeekbtn.style.backgroundColor = NonActiveColor;
     
});


document.getElementById('FirstArrow').addEventListener('click', function(event) {
    event.preventDefault();

    var instructions = document.querySelectorAll('.Instructions');
    var newButtons = [document.getElementById('CompanyStructure'), document.getElementById('Contacts')];
    var topText = document.getElementById('Toptxt'); // Get the element to adjust
    var arrowImage = document.getElementById('FirstArrow').querySelector('img');

    // Check if new buttons are visible
    var isVisible = newButtons.some(button => button.style.display === 'block');

    // Toggle visibility of new buttons and instructions
    if (isVisible) {
        newButtons.forEach(button => button.style.display = 'none');
        instructions.forEach(instr => instr.style.display = 'block');
        topText.style.top = '15vh'; // Reset back to original position when showing instructions
        arrowImage.src = 'DownArrow.png';
    } else {
        newButtons.forEach(button => button.style.display = 'block');
        instructions.forEach(instr => instr.style.display = 'none');
        topText.style.top = '20vh'; // Move down a bit when instructions are hidden
        arrowImage.src = 'UpArrow.png';
    }
});






Missionbtn.addEventListener("click", function() {

     //initalizing it based on button
     topbtnlayout = document.querySelector(`.Layout${2}`);

     topbtnlayout.style.display = 'block';
     topbtnlayout = document.querySelector(`.Layout${1}`);
     topbtnlayout.style.display = 'none';
     topbtnlayout = document.querySelector(`.Layout${3}`);
     topbtnlayout.style.display = 'none';

     //Changing the colors
     Welcomebtn.style.backgroundColor = NonActiveColor;
    Missionbtn.style.backgroundColor = ActiveColor;
    FirstWeekbtn.style.backgroundColor = NonActiveColor;
});

FirstWeekbtn.addEventListener("click", function(){

    //initalizing it based on button
    topbtnlayout = document.querySelector(`.Layout${3}`);

    topbtnlayout.style.display = 'block';
    topbtnlayout = document.querySelector(`.Layout${1}`);
    topbtnlayout.style.display = 'none';
    topbtnlayout = document.querySelector(`.Layout${2}`);
    topbtnlayout.style.display = 'none';

    //changing the colors
    Welcomebtn.style.backgroundColor = NonActiveColor;
    Missionbtn.style.backgroundColor = NonActiveColor;
    FirstWeekbtn.style.backgroundColor = ActiveColor;
});


Nextbtn.addEventListener("click", function() {
    //Check if it's submit button First. This way
    

     if(Nextbtn.innerText === "Submit")
     { 
        Checksubmit();
     }
    if (index < Endindex) {
        index++;
        checkWhichActive();
        
    }
    updateButtonStates();

    // Adjust this block to only prepare the button for submission without calling Checksubmit
    if (index === Endindex) {
        Nextbtn.innerText = "Submit"; // Change text to Submit
        // Remove Checksubmit call from here to prevent immediate execution
    }//end of if
});



//Handling image uploads
function handleImageUpload(event) {
    var imageFile = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = document.querySelector('.Paperclip img'); // Selects the image to replace
        img.src = e.target.result; // Sets the source of the image to the uploaded file
        img.style.width = '80px'; // Set this to the desired width
        img.style.height = 'auto'; // Adjust height automatically to keep aspect ratio
    };
    reader.readAsDataURL(imageFile);
    CreateImageReference();
}

function CreateImageReference()
{

}


//Checking active buttons and loading correct divs
function checkWhichActive() {
   

  // Three Layouts
  const totalLayouts = 3;
    
  // Loop through all possible layout numbers
  for (let i = 1; i <= totalLayouts; i++) {
      let layout = document.querySelector(`.Layout${i}`);
      if (layout) {
          if (i === index) {
              // Show the layout that matches the current index
              layout.style.display = 'block';
          } else {
              // Hide other layouts
              layout.style.display = 'none';
          }
      }
  }

    // Update button colors
    [Welcomebtn, Missionbtn, FirstWeekbtn].forEach((div, idx) => {
        div.style.backgroundColor = (idx + 1 === index) ? ActiveColor : NonActiveColor;
        

    });

       // Update Next and Previous button states based on index
    switch (index) {
        case 1:
            Nextbtn.style.backgroundColor = ActiveColor;
            Prevbtn.style.backgroundColor = NonActiveColor;
           
            break;
        case 2:
            Nextbtn.style.backgroundColor = ActiveColor;
            Prevbtn.style.backgroundColor = ActiveColor;
            Nextbtn.innerText = "Next";
            Nextbtn.style.textAlign = "Center";
            Nextbtn.style.lineHeight = 3.2;
            break;
        case 3:
            Nextbtn.style.backgroundColor = NonActiveColor;
            Prevbtn.style.backgroundColor = ActiveColor;
           
            break;
    }


    }//End of checkwhich active

    //Start of updating button stats 
function updateButtonStates() {
    Prevbtn.disabled = (index === 1);
}

// Initialize
checkWhichActive();
updateButtonStates();

async function Checksubmit() {
    let isValid = true; // Assume form is valid initially
    let errorMessage = ""; // To accumulate error messages

    // Selecting input and textarea elements by their name attribute
    let companyName = document.querySelector('input[name="companyName"]').value.trim();
    let employeeQuote = document.querySelector('input[name="employeeQuote"]').value.trim();
    let firstValue = document.querySelector('input[name="FValue"]').value.trim();
    let secondValue = document.querySelector('input[name="SValue"]').value.trim();
    let thirdValue = document.querySelector('input[name="TValue"]').value.trim();
    let fourthValue = document.querySelector('input[name="FoValue"]').value.trim();
    let fifthValue = document.querySelector('input[name="FiValue"]').value.trim();
    let companyMission = document.querySelector('.CompanyMField textarea').value.trim();
    let companyDescription = document.querySelector('.DescriptionField textarea').value.trim();
   
    let firstWeekItems = document.querySelector('.Layout3MainField textarea').value.trim();
   let validItems = /^(?:[^,\n]+,)*[^,\n]+[.]?$/.test(firstWeekItems);

    var imageFile = document.getElementById('imageUpload').files[0];
    //Add ability to handle photo here add variable for photo

    // Basic field presence check
    if (!companyName || !employeeQuote || !firstValue || !secondValue || !thirdValue || !fourthValue || !fifthValue || !companyMission || !companyDescription || !firstWeekItems) {
        alert("All fields must be filled out.");
        return false; // Form is not valid
    }

    // Company Name Validation
    if (!companyName.match(/^[a-zA-Z0-9,.&' -]+$/)) {
        isValid = false;
        errorMessage += "Invalid Company Name. Use only alphanumeric characters, spaces, and basic punctuation.\n";
    }

    // Description Validation (more than one word)
    if (!companyDescription.match(/^[\w\W]{2,}$/) || !companyDescription.includes(" ")) {
        isValid = false;
        errorMessage += "Invalid Description. Must contain more than one word.\n";
    }

    // Company Mission Validation
    if (!companyMission.match(/^[\w\W]{2,}$/) || !companyMission.includes(" ")) {
        isValid = false;
        errorMessage += "Invalid Mission. Must contain more than one word.\n";
    }

    // Employee Quote Validation
    if (!employeeQuote.match(/^[\w\W]+$/)) {
        isValid = false;
        errorMessage += "Invalid Employee Quote. Please enter a valid quote.\n";
    }

    // Values Validation
    [firstValue, secondValue, thirdValue,fourthValue,fifthValue].forEach((value, index) => {
        if (!value.match(/^[a-zA-Z0-9,.&' -]+$/)) {
            isValid = false;
            errorMessage += `Invalid Value ${index + 1}. Use only alphanumeric characters, spaces, and basic punctuation.\n`;
        }
    });

    // First Week Items Validation
    if (!firstWeekItems.match(/^(.+)(,[\s]*.+)+$/) && validItems) {
        isValid = false;
        errorMessage += "Invalid First Week Checklist. Ensure items are listed and separated by commas.\n";
    }
    //If there's no image
    if (!imageFile) {
        alert("Image file must be uploaded.");
        return false; // Form is not valid
    }

    // If not valid, log errors and prevent form submission
    if (!isValid) {
        alert(errorMessage);
        return false; // Form is not valid
    }

    // Assuming image validation is done elsewhere since it involves checking the file type on change event

    // If everything is okay, log the form data (consider sending it to a server or processing it as needed)
    //Assuming FormData is your validated form data object
    let formData = new FormData();

    
    formData.append('companyName', companyName);
    formData.append('employeeQuote',employeeQuote);
    formData.append('firstValue', firstValue);
    formData.append('secondValue', secondValue);
    formData.append('thirdValue', thirdValue);
    formData.append('fourthValue', fourthValue);
    formData.append('fifthValue', fifthValue);
    formData.append('companyMission', companyMission);
    formData.append('companyDescription', companyDescription);
    
    
    firstWeekItems = firstWeekItems.replace(/,/g, '.').trim();
    
    formData.append('firstWeekItems', firstWeekItems);
    formData.append('CEOImage', imageFile);//This would be the reference to the image
      
    try {
       
        const response = await fetch('http://localhost:2999/submit-form', {
            method: 'POST',
            body: formData,
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        
        const data = await response.json();
       
        
        // Perform the redirect
   
        window.location.href = 'download.html';
    } catch (error) {
        console.error('Error during form submission:', error);
    }
}
//testing autofille


document.getElementById('autofillBtn').addEventListener('click', function() {
    document.querySelector('input[name="companyName"]').value = 'Demo Company';
    document.querySelector('input[name="employeeQuote"]').value = 'This is a great place to work!';
    document.querySelector('input[name="FValue"]').value = 'Integrity';
    document.querySelector('input[name="SValue"]').value = 'Commitment';
    document.querySelector('input[name="TValue"]').value = 'Innovation';
    document.querySelector('input[name="FoValue"]').value = 'Respect';
    document.querySelector('input[name="FiValue"]').value = 'Excellence';
    document.querySelector('.CompanyMField textarea').value = 'To provide the best service...';
    document.querySelector('.DescriptionField textarea').value = 'We are leaders in...';
    // Add other fields as needed
});
