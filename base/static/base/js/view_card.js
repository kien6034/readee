window.addEventListener('DOMContentLoaded', ()=>{
    deleteCard()
    editCard()
   
})
const canvas = document.getElementById('canvas');
const deleteBox = document.getElementById('delete-alert-box');

function deleteCard(){
    document.querySelectorAll('.delete-card').forEach(btn =>{
        btn.addEventListener('click', ()=>{
            const cardId = btn.getAttribute('data-id');

            canvas.classList.remove('hide');
            deleteBox.classList.remove('hide');

            document.getElementById('no-btn').addEventListener('click', ()=>{
                canvas.classList.add('hide');
                deleteBox.classList.add('hide');
            })
            document.getElementById('yes-btn').addEventListener('click', ()=>{
                removeCard(cardId)
            })
           
        })
    })
}

function editCard(){
   
    document.querySelectorAll('.edit-card').forEach(btn =>{
        btn.addEventListener('click', ()=>{
            const cardId = btn.getAttribute('data-id');
           
            //open the edit box
            openEditBox(cardId)
            closeEditbox(cardId)
        });
    })
}
function closeEditbox(cardId){
  
    const tmp = "addCardBoard-" + cardId
    const board = document.getElementById(tmp);

    board.querySelector('.utils .close-card-btn').addEventListener('click', ()=>{
        
        board.classList.add('hide')
        document.getElementById('canvas').classList.add('hide')

        //remove event handler 

    })
}
function openEditBox(cardId){
    const tmp = "addCardBoard-" + cardId
    const board = document.getElementById(tmp);
    const canvas = document.getElementById('canvas');

    board.classList.remove('hide');
    canvas.classList.remove('hide');

    //get card attribute
    const card = document.getElementById(cardId);

    let front_image_link = card.querySelector('.slider .front .image')
    let back_image_link = card.querySelector('.slider .back .image')
    let front_content = card.querySelector('.slider .front .content .title');
    let front_description = card.querySelector('.slider .front .content .description');
    let back_content = card.querySelector('.slider .back .content .title');
    let back_description = card.querySelector('.slider .back .content .description');


    editCarddd(board, front_image_link, back_image_link, front_content, front_description, back_content, back_description, cardId)
}

function editCarddd(board, front_image_link, back_image_link, front_content, front_description, back_content, back_description, cardId){
    const frontContent = board.querySelector('.add-card-area .front .require input')
    const frontImgLink = board.querySelector('.add-card-area .front .imgLink')
    const frontDescription = board.querySelector('.add-card-area .front textarea')

    const backContent = board.querySelector('.add-card-area .back .require input')
    const backImgLink = board.querySelector('.add-card-area .back .imgLink')
    const backDescription =  board.querySelector('.add-card-area .front textarea')

    //populate the current value
    frontContent.value = front_content.innerHTML;
    frontDescription.value = front_description.innerHTML;
  
    backContent.value = back_content.innerHTML;
    backDescription.value = back_description.innerHTML;

    if(front_image_link.classList == "image"){
        frontImgLink.value = front_image_link.querySelector('img').src;
    }
    if(backImgLink.classList == "image"){
        backImgLink.value = back_image_link.querySelector('img').src;
    }
   
    
    const addBtn = board.querySelector('.utils .add-card-btn')
    addBtn.addEventListener('click', ()=>{
        //check front content
        frontContent.addEventListener('focus', ()=>{
            frontContent.classList.remove('warning-border')
        })
        backContent.addEventListener('focus', ()=>{
            backContent.classList.remove('warning-border')
        })
        
        
        if(frontContent.value == ""){
            
            frontContent.classList.add('warning-border')
        }
        //check back content
        else if(backContent.value == ""){
            backContent.classList.add('warning-border')
        }
        else{
            
            const url = '/edit/card'

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken':csrftoken,
                },
                body:JSON.stringify({'frontContent': frontContent.value, 
                'frontImgLink': frontImgLink.value,
                'frontDescription': frontDescription.value,
                'backContent': backContent.value, 
                'backImgLink': backImgLink.value,
                'backDescription': backDescription.value,
                'cardId': cardId,
                })
            })
        
    
            .then((response)=>{
                return response.text() 
            })
    
            .then((text)=>{
                //text is the replycomment id
                if(text == 'succeed'){
                    front_content.innerHTML = frontContent.value;
                    back_content.innerHTML = backContent.value;
                    front_description.innerHTML = frontDescription.value;
                    back_description.innerHTML = backDescription.value;

                    if(frontImgLink.value){
                        front_image_link.classList.remove('hide')
                        front_image_link.querySelector('img').src = frontImgLink.value;
                    }
                    else{
                        front_image_link.classList.add('hide')
                    }
                    if(backImgLink.value){
                        back_image_link.classList.remove('hide')
                        back_image_link.querySelector('img').src = backImgLink.value;
                    }
                    else{
                        back_image_link.classList.add('hide')
                    }

                    //close
                    document.getElementById('canvas').classList.add('hide')
                    board.classList.add('hide')
                }   
            })
        }

    })
}
function getCardAttribute(cardId){
    const url = '/attribute/card';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'cardId': cardId})
    })

    .then((response)=>{
        return response.text() 
    })

    .then((text)=>{ 
        if(text == "succeed"){
            
        }
    })
}

function removeCard(cardId){
    const url = '/delete/card';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'cardId': cardId})
    })

    .then((response)=>{
        return response.text() 
    })

    .then((text)=>{ 
        if(text == "succeed"){
            canvas.classList.add('hide');
            deleteBox.classList.add('hide');

            //ui
            document.getElementById(cardId).classList.add('hide')
        }
    })
}