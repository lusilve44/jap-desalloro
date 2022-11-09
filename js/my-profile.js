navbarConfig();
currentPage("./my-profile.html");
checkLoggedUser();

let userData = JSON.parse(sessionStorage.getItem('currentUser'));
let userForm = document.getElementById('userForm');
let firstName = document.getElementById('userName');
let firstSurname = document.getElementById('userSurname');
let email = document.getElementById('userEmail');
let contactNumber = document.getElementById('userPhone');
let secondName = document.getElementById('userSecondName');
let secondSurname = document.getElementById('userSecondSurname');
let displayPfp = document.getElementById('userPfp');
let profilePicture = document.getElementById('profilePicture');
let submitBtn = document.getElementById('saveUserData');
let successful = document.getElementById("successful");

function getBase64Image(img) { //https://stackoverflow.com/questions/19183180/how-to-save-an-image-to-localstorage-and-display-it-on-the-next-page
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

document.addEventListener('DOMContentLoaded', function(){
    firstName.setAttribute('value', userData.firstName);
    firstSurname.setAttribute('value', userData.firstSurname);
    email.setAttribute('value', userData.email);
    contactNumber.setAttribute('value', userData.contactNumber);
    secondName.setAttribute('value', userData.secondName);
    secondSurname.setAttribute('value', userData.secondSurname);

    if (userData.profilePicture != ''){
        displayPfp.src = userData.profilePicture;
    }
    
    submitBtn.addEventListener('click', function(){
        userForm.classList.add('was-validated');

        if (validateEmail(email.value) && firstName.value.length > 0 && firstSurname.value.length > 0 && contactNumber.value.length > 0){
            userData.firstName = firstName.value;
            userData.firstSurname = firstSurname.value;
            userData.email = email.value;
            userData.contactNumber = contactNumber.value;
            userData.secondName = secondName.value;
            userData.secondSurname = secondSurname.value;
            userData.profilePicture = getBase64Image(profilePicture);
            displayPfp.src = userData.profilePicture;

            sessionStorage.setItem('currentUser',JSON.stringify(userData));
        
            successful.classList.remove("visually-hidden");
            setTimeout(()=>{successful.classList.add("visually-hidden")},4000);
        }
    })
})