let btn = document.getElementById('ingresar');
let pageTo = sessionStorage.getItem("currentPage");
let redirectTo = pageTo ? pageTo : "./index.html"

if (sessionStorage.getItem('status') == 'loggedIn') {
    location.href = redirectTo;
}

btn.addEventListener('click', function(event){
    let email = document.getElementById('floatingInput').value;
    let pwrd = document.getElementById('floatingPassword').value;
    let form = document.getElementById('formLogin');

    form.classList.add("was-validated");

    if (validateEmail(email) && pwrd.length >= 8) {
        let user = {
            email:email,
            firstName:'',
            secondName:'',
            firstSurname:'',
            secondSurname:'',
            contactNumber:'',
            profilePicture:''
        };
        sessionStorage.setItem('currentloggedin_email', email);
        sessionStorage.setItem('status','loggedIn');
        sessionStorage.setItem('currentUser',JSON.stringify(user));
        location.href = redirectTo;
    }
})