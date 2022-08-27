let btn = document.getElementById('ingresar');

if (sessionStorage.getItem('status') == 'loggedIn') {
    location.href = "./index.html";
}

btn.addEventListener('click', function(event){
    let email = document.getElementById('floatingInput');
    let pwrd = document.getElementById('floatingPassword');
    event.preventDefault();

    if (email.value.length == 0 && pwrd.value == ''){
        email.classList.add('is-invalid');
        pwrd.classList.add('is-invalid');   
    }
    else if (email.value != 0 && pwrd.value == 0){
        pwrd.classList.add('is-invalid');
        email.classList.remove('is-invalid');
    }
    else if (email.value == 0 && pwrd.value != 0){
        email.classList.add('is-invalid');
        pwrd.classList.remove('is-invalid');
    }
    else {
        sessionStorage.setItem('currentloggedin_email', email.value);
        sessionStorage.setItem('status','loggedIn');
        location.href = "./index.html";
    }
})