let btn = document.getElementById('ingresar');

btn.addEventListener('click', function(event){
    let email = document.getElementById('floatingInput');
    let pwrd = document.getElementById('floatingPassword');

    if (email.value == 0 || pwrd.value == 0){
        event.preventDefault();
        email.classList.add('is-invalid');
        pwrd.classList.add('is-invalid')
    }
    else {
        sessionStorage.setItem('currentloggedin_email', email.value);
        sessionStorage.setItem('currentloggedin_pwrd', pwrd.value);
        sessionStorage.setItem('status','loggedIn')
        location.href = "/proyecto-desarrollo-web-jap/index.html";
    }
})