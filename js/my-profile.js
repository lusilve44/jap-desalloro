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
let deletePfp = document.getElementById('clearPfp');
let defaultPfp = "./img/default-profile-icon.jpg";
let currentPfp;
let submitBtn = document.getElementById('saveUserData');
let successful = document.getElementById("successful");

document.addEventListener('DOMContentLoaded', function(){
    firstName.setAttribute('value', userData.firstName);
    firstSurname.setAttribute('value', userData.firstSurname);
    email.setAttribute('value', userData.email);
    contactNumber.setAttribute('value', userData.contactNumber);
    secondName.setAttribute('value', userData.secondName);
    secondSurname.setAttribute('value', userData.secondSurname);

    if (userData.profilePicture != ''){
        currentPfp = userData.profilePicture;
        displayPfp.setAttribute('src', currentPfp);
    }
    
    profilePicture.addEventListener('change', function(){
        const reader = new FileReader();
        reader.addEventListener('load', function(){
            currentPfp = reader.result;
            displayPfp.setAttribute('src', currentPfp);
        })
        reader.readAsDataURL(this.files[0]);
    })

    deletePfp.addEventListener('click', function(){
        profilePicture.setAttribute('value', null);
        displayPfp.setAttribute('src', defaultPfp);
        currentPfp = '';
    })

    submitBtn.addEventListener('click', function(){
        userForm.classList.add('was-validated');

        if (validateEmail(email.value) && firstName.value.length > 0 && firstSurname.value.length > 0 && contactNumber.value.length > 0){
            userData.firstName = firstName.value;
            userData.firstSurname = firstSurname.value;
            userData.email = email.value;
            userData.contactNumber = contactNumber.value;
            userData.secondName = secondName.value;
            userData.secondSurname = secondSurname.value;
            userData.profilePicture = currentPfp;

            sessionStorage.setItem('currentUser',JSON.stringify(userData));
        
            successful.classList.remove("visually-hidden");
            setTimeout(()=>{successful.classList.add("visually-hidden")},4000);
        }
    })
})