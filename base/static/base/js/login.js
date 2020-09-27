window.addEventListener('DOMContentLoaded', ()=>{
    //form container
    const loginContainer = document.getElementById('login-container')
    const signupContainer = document.getElementById('signup-container');

    const signup = document.getElementById('signup-direct');
    const signin = document.getElementById('signin-direct');
    signup.addEventListener('click', ()=>{
        loginContainer.style.display = "none";
        signupContainer.style.display = "flex";
    })
    signin.addEventListener('click', ()=>{
        loginContainer.style.display = "flex";
        signupContainer.style.display = "none";
    })

    signupForm(loginContainer, signupContainer)
})


function signupForm(loginContainer,signupContainer){
    const form = document.getElementById('signup-form');
    const usernameMessage = document.getElementById('username-message')
    const passwordMessage = document.getElementById('password-message')
    const confirmPasswordMessage = document.getElementById('confirm-password-message')
    const submitBtn = document.getElementById('submit-btn')
    const emailMessage = document.getElementById('email-message')

   
    form.elements[0].addEventListener('blur', ()=>{
        if(form.elements[0].value.length < 4 && form.elements[0].value.length != 0){
            usernameMessage.innerHTML = "Your username is too short"

        }
    })

    form.elements[0].addEventListener('input', ()=>{
        if(form.elements[0].value.length == 0 ||form.elements[0].value.length >= 4 ){
            usernameMessage.innerHTML = ""
        }
    })
    form.elements[1].addEventListener('blur', ()=>{
        if(form.elements[1].value.length < 6){
            passwordMessage.innerHTML = "Your password is too short"
           
        }
    })
    form.elements[1].addEventListener('input', ()=>{
        if(form.elements[1].value.length >= 6){
            passwordMessage.innerHTML = ""
           
        }
    })
    form.elements[2].addEventListener('input', ()=>{
        if(form.elements[1].value == form.elements[2].value){
            confirmPasswordMessage.innerHTML = ""
        }
        if (form.elements[2].value == ""){
            confirmPasswordMessage.innerHTML = ""
        }
    })
    form.elements[2].addEventListener('blur', ()=>{
        if(form.elements[1].value != form.elements[2].value && form.elements[2].value != ""){
            confirmPasswordMessage.innerHTML = "The password you entered do not match";
            submitable = false;
        } 
    })
    form.elements[3].addEventListener('blur', ()=>{
        if( !form.elements[3].value.includes("@") && form.elements[3].value!= ""){
            emailMessage.innerHTML = "Invalid Email Address"
        }
    })
    form.elements[3].addEventListener('input', ()=>{
        if(form.elements[3].value.includes("@") || form.elements[3].value== "" ){
            emailMessage.innerHTML = ""
        }
    })

    submitBtn.addEventListener('click', ()=>{
        event.preventDefault()

        if(form.elements[1].value == form.elements[2].value && form.elements[0].value.length >= 4  && form.elements[1].value.length >= 6 && form.elements[3].value.includes("@")){
            var url = '/authentication/signup';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken':csrftoken,
                },
                body:JSON.stringify({'username': form.elements[0].value, 'password': form.elements[1].value, 'email': form.elements[3].value})
            })
    
            .then((response)=>{
                return response.text() 
            })
    
            .then((text)=>{
                if(text == "ok"){
                    loginContainer.style.display = "flex";
                    signupContainer.style.display = "none";

                    message();
                }
                else{
                    usernameMessage.innerHTML = text;
                }
            })
        }
    })
}   

function message(){
    
    const messageContainer = document.getElementById('message-container');
    messageContainer.style.animation = "popup 2s none"
    messageContainer.addEventListener('animationend', ()=>{
        messageContainer.style.animation = ""
    })
  
}