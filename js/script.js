console.log('Hello from js.js!');

// CHECK NAME
document.getElementById('name').addEventListener('keyup', function(){
    let name = document.getElementById('name').value
    let tagname = document.getElementById('name')
    var czechLettersRegex = /^[a-zA-ZáčďéěíňóřšúůýžÁČĎÉĚÍŇÓŘŠÚŮÝŽ]+$/;
    if (name == 0) {
        tagname.classList.remove('short')
        tagname.classList.remove('long')
        document.getElementById('tagname').innerHTML = ""
    }
    if (name != 0){
        if (czechLettersRegex.test(name)) {
            tagname.classList.remove('short')
            tagname.classList.add('long')
            document.getElementById('tagname').innerHTML = ""
        } else {
            tagname.classList.remove('long')
            tagname.classList.add('short')
            document.getElementById('tagname').innerHTML = "Zadávejte jen písmena"
        }}
})
// CHECK SURNAME
document.getElementById('surname').addEventListener('keyup', function(){
    let surname = document.getElementById('surname').value
    let tagsurname = document.getElementById('surname')
    var czechLettersRegex = /^[a-zA-ZáčďéěíňóřšúůýžÁČĎÉĚÍŇÓŘŠÚŮÝŽ]+$/;
    if (surname == 0) {
        tagsurname.classList.remove('short')
        tagsurname.classList.remove('long')
        document.getElementById('tagsurname').innerHTML = ""
    }
    if (surname != 0) {
        if (czechLettersRegex.test(surname)) {
            tagsurname.classList.remove('short')
            tagsurname.classList.add('long')
            document.getElementById('tagsurname').innerHTML = ""
        } else {
            tagsurname.classList.remove('long')
            tagsurname.classList.add('short')
            document.getElementById('tagsurname').innerHTML = "Zadávejte jen písmena"
        }
    }
})

//LENGTH OF PASSWORD
document.getElementById('password').addEventListener('keyup', function() {
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('password2').value;
    let passwordLength = password.length;
    if (passwordLength == 0) {
        document.getElementById('password').classList.remove('long');
        document.getElementById('password').classList.remove('short');
        document.getElementById('password2').classList.remove('long');
        document.getElementById('password2').classList.remove('short');
        document.getElementById('length').innerHTML = "";
        document.getElementById('same').innerHTML = "";
    } else if (8 <= passwordLength) {
        document.getElementById('password').classList.remove('short');
        document.getElementById('password').classList.add('long');
        document.getElementById('length').innerHTML = "Heslo je dostatečně dlouhé";
        if (password == password2) {
            document.getElementById('password2').classList.remove('short');
            document.getElementById('password2').classList.add('long');
            document.getElementById('same').innerHTML = "Hesla se shodují";
            document.getElementById('password').classList.remove('short');
            document.getElementById('password').classList.add('long');
        } else if (password != password2) {
            document.getElementById('password2').classList.remove('long');
            document.getElementById('password2').classList.add('short');
            document.getElementById('same').innerHTML = "Hesla se neshodují";
            document.getElementById('password').classList.remove('short');
            document.getElementById('password').classList.add('long');
        }
    } else if (passwordLength < 8) {
        document.getElementById('password').classList.remove('long');
        document.getElementById('password').classList.add('short');
        document.getElementById('length').innerHTML = "Heslo je příliš krátké, musí mít alespoň 8 znaků";
        document.getElementById('same').innerHTML = "";
        document.getElementById('password2').classList.remove('long');
        document.getElementById('password2').classList.remove('short');
    }
})

// CHECK IF PASSWORDS ARE THE SAME
document.getElementById('password2').addEventListener('keyup', function() {
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('password2').value;
    passwordLength = password2.length;
    if (passwordLength == 0) {
        document.getElementById('password2').classList.remove('long');
        document.getElementById('password2').classList.remove('short');
        document.getElementById('same').innerHTML = "";
    } 
    else if (password != password2) {
        document.getElementById('password2').classList.remove('long');
        document.getElementById('password2').classList.add('short');
        document.getElementById('same').innerHTML = "Hesla se neshodují";
        document.getElementById('password').classList.remove('long');
        document.getElementById('password').classList.add('short');
    } 
    else if (password == password2) {
        document.getElementById('password2').classList.remove('short');
        document.getElementById('password2').classList.add('long');
        document.getElementById('same').innerHTML = "Hesla se shodují";
        document.getElementById('password').classList.remove('short');
        document.getElementById('password').classList.add('long');
    } 
})
 //AJAX for checking email
 const email = document.querySelector('input[name="email"]');
 email.addEventListener('keyup', function() {
 const xhr = new XMLHttpRequest();
 xhr.open('GET', 'func/_check_email.php?email=' + email.value);
 xhr.addEventListener('load', function() {
     if(xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            if(response.error) {
                email.classList.remove('long');
                email.classList.add('short');

            } else {
                email.classList.remove('short');
                email.classList.add('long');
            }
     }
 });
 xhr.send();
 });

function initval() {
    //ziskame referenci na AJAX
    usernameAJAX();
    
}


//ALERT FUNCTION
function showAlert() {
    alert("Jste si jisti?");
}

// Add an event listener to the button
var submitButton = document.getElementById("reset");

submitButton.addEventListener("click", function() {
    showAlert();
    });
/*
TODO: // CHECK IF EMAIL IS TAKEN BY AJAX
function validateEmail(event) {
    const inp = document.getElementById('email');
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', checkEmail);
    xhr.open('GET', '/PHP/LOGIN/func/ajax.php?email=' + encodeURI(inp.value));
    xhr.send();


}

function checkEmail(event) {
    const response = JSON.parse(this.responseText);
    const inp = document.getElementById('email');
    if (response.emailExists) {
        inp.classList.add('taken');
    } else {
        inp.classList.remove('taken');
    }
}

let timer = null
function debounce() {

    if (timer != null) {
        clearTimeout(timer);
        timer = null
    }
    timer = setTimeout(validateEmail, 300)
    console.log(timer)
}
function init() {
    //ziskame referenci na formular
    const form = document.querySelector('body form#register');
    form.addEventListener('submit', validate);

    const inp = document.querySelector('body input#name');
    inp.addEventListener('keyup', debounce);

}

function validateEmail() {
    const inp = document.querySelector('body input#email');
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function() {
        // Parse the JSON response
        const response = JSON.parse(xhr.responseText);

        // Check if the email is taken
        if (response.emailTaken) {
            alert('Email is already taken.');
        } else {
            alert('Email is available.');
        }
    });

    xhr.open('GET', '/PHP/LOGIN/func/user_database_func.php?email=' + encodeURI(inp.value));
    xhr.send();
}
function init() {
    //ziskame referenci na formular

    const inp = document.querySelector('body input#email');
    inp.addEventListener('keyup', debounce);

}
*/




