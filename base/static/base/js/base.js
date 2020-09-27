const status = document.getElementById('status')
const userStatus = status.getAttribute('data-userStatus')
const memberId = status.getAttribute('data-memberId')

window.addEventListener('click', event=>{
    const element = event.target;
    
    if(userStatus){
        if(element.closest('.user-box')){
            //pass
         }//open and close userbox
         else if(element.id == "user-box-thumbnail"){
            
             document.getElementById('user-box').classList.toggle('hide')
         }
         else{  // close the userbox when being clicked outside
             document.getElementById('user-box').classList.add('hide')
         }
    }
})
