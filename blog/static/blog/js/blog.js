
const postId = document.getElementById('data-transfering').getAttribute('data-postId')

window.addEventListener('DOMContentLoaded', ()=>{
    initCommentSection()
    if(userStatus){
        removeBlog()
    }
    
    utilsBar()
    initUtils();
    initFlashCard();
})

function initCommentSection(){
    const comment = new Comment()
}

function removeBlog(){
    let canvas =  document.getElementById('canvas');
    let deleteBox = document.getElementById('delete-box')
    deletePostBtnEvent(canvas, deleteBox);
    document.getElementById('delete-blog-btn').addEventListener('click', ()=>{
        canvas.classList.remove('hide');
        deleteBox.classList.remove('hide');
    })
}

function deletePostBtnEvent(canvas, deleteBox){
    document.getElementById('no-delete-post').addEventListener('click', ()=>{
       canvas.classList.add('hide')
       deleteBox.classList.add('hide');
    })

    document.getElementById('delete-post').addEventListener('click', ()=>{
        const url = '/delete/blog';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'postId': postId})
        })

        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            if(text == "succeed"){
                window.location = "/member/" + memberId + '/post'

             
            }
            else{
                alert('internal error')
            }
        })
    })
}

class Comment{
    loginUrl = "/authentication/login"
    constructor(){
        this.mainForm = document.getElementById('comment-main-form')
        this.replyButtons = document.querySelectorAll('.comment-reply')
        this.addComment()
        this.addReplyComment()
        this.updateLike()
        this.utils()
        this.showReplyComment()
    }
    utils(){
        const utilToggles = document.querySelectorAll('.comment-three-dot');
        utilToggles.forEach(toggle =>{
            toggle.addEventListener('click', ()=>{
               
                this.utilsLogic(toggle) 
            })
        })
    }
    addComment(){
        const inputField = document.getElementById('main-form-input');
        const utilsBoard = document.getElementById('main-form-utils');
        const submitBtn = document.getElementById('main-form-submit');
        const hideBtn = document.getElementById('main-form-hide');
        
        const message = inputField.textContent;
        //open util board
        
        
        
        inputField.addEventListener('focus', ()=>{
            if(!userStatus){
                window.location  = this.loginUrl;
            }
            else{
                inputField.classList.remove('pale-message')
                inputField.textContent = ""
                utilsBoard.classList.remove('hide')
            }
        })
        
        

        //enable submit butotn
        inputField.addEventListener('input', ()=>{
            const text = inputField.textContent;
            if(text != ""){
                submitBtn.classList.add('submitable')
                submitBtn.disabled = false;
            }
            else{
                submitBtn.classList.remove('submitable')
                submitBtn.disabled = true;
            }  
        })
            //hide the input field
        hideBtn.addEventListener('click', ()=>{
            utilsBoard.classList.add('hide')
            inputField.classList.add('pale-message')
            inputField.textContent = message;
        })

        //submit event
        submitBtn.addEventListener('click', ()=>{
            const text = inputField.textContent;
            let type = "main"
            let id = "none"

            this.addCommentToDb(type, id, postId, text)

            //reset
            inputField.classList.add('pale-message')
            inputField.textContent = message;
            submitBtn.classList.remove('submitable');
            submitBtn.disabled = true;
        })

    }

    addReplyComment(){   
        this.replyButtons.forEach(button=>{
            button.addEventListener('click', ()=>{
                if (!userStatus){
                    window.location = this.loginUrl;
                }
                else{
                    this.addReplyLogic(button)
                }
            })
        })
    }
   
    updateLike(){
        const likes = document.querySelectorAll('.comment-thumbs-up');
        likes.forEach(like =>{
            like.addEventListener('click', ()=>{
                if (!userStatus){
                    window.location = this.loginUrl;
                }
                else{
                    this.updateLikeLogic(like)
                }
              
            })
        })
    }

    showReplyComment(){
        //show reply
        const showReplyBtns = document.querySelectorAll('.show-reply-comment');
        showReplyBtns.forEach(button =>{
            button.addEventListener('click', ()=>{
                const id = button.getAttribute('data-id')
                const replyContainerId = "reply-comment-container-" + id;
                document.getElementById(replyContainerId).classList.toggle('hide');
            })
        })
    }

    addCommentToDb(type, id, postId, commentText){
        var url = '/blog/addCommentApi';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'type': type, 'id': id, 'postId': postId, 'text': commentText})
        })

        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            let newCommentId = text;
            this.addCommentHandleBar(commentText, newCommentId)
        })
    }

    addReplyCommentToDb(mainId, subId, commentText){
        var url = '/blog/addReplyCommentApi';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'mainId': mainId, 'commentText': commentText})
        })

        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            //text is the replycomment id
            this.addReplyCommentHandleBar(text, commentText, mainId)
        })
    }

    addCommentHandleBar(text, id){
        //handle bar
        let raw = document.getElementById("addCommentTemplate").innerHTML;
        let compliedTemplate = Handlebars.compile(raw);
     
        let ourGeneratedHtml = compliedTemplate({'text': text, 'id': id});
    
        let newComment = document.getElementById('new-comment');
        const node = document.createElement('div');
        node.innerHTML = ourGeneratedHtml;
        newComment.appendChild(node)
        //add event listener

        //Reply button
        const replyId = 'comment-reply-' + id;
        const reply = document.getElementById(replyId)
        reply.addEventListener('click', ()=>{
            this.addReplyLogic(reply)
        })

        //like event handler
        const likeId = "comment-like-" + id;
        document.getElementById(likeId).addEventListener('click', ()=>{
            this.updateLikeLogic(document.getElementById(likeId))
        })

        //utils handler
        const utilButtonId = "main-util-toggle-" + id;
        const utilBtn = document.getElementById(utilButtonId)
        utilBtn.addEventListener('click', ()=>{
            this.utilsLogic(utilBtn)
        })
    }

    addReplyCommentHandleBar(id, text, mainId){
        let raw = document.getElementById("addReplyCommentTemplate").innerHTML;
        let compliedTemplate = Handlebars.compile(raw);
     
        let ourGeneratedHtml = compliedTemplate({'text': text, 'id': id, 'mainId': mainId});
    
        const targetId = "reply-comment-" + mainId;
        const newComment = document.getElementById(targetId);
        const node = document.createElement('div');
        node.innerHTML = ourGeneratedHtml;
        newComment.appendChild(node)

        //reply event handler
        const replyId = 'replycomment-repy-' + id;
        const reply = document.getElementById(replyId)
        reply.addEventListener('click', ()=>{
            this.addReplyLogic(reply)
        })  

        //like event handler
        const likeId = 'subComment-like-' + id;
        document.getElementById(likeId).addEventListener('click', ()=>{
            this.updateLikeLogic(document.getElementById(likeId))
        })

        //utils handler
        const utilButtonId = "sub-util-toggle-" + id;
        const utilBtn = document.getElementById(utilButtonId)
        utilBtn.addEventListener('click', ()=>{
            this.utilsLogic(utilBtn)
        })
    }

    addReplyLogic(button){

        //open form
        const mainId = button.getAttribute('data-commentID')
        const subId = button.getAttribute('data-subCommentId')

        const id  = mainId+ "and" + subId
        //open reply input
        const addReplyRaw = document.getElementById('addCommentInputTemplate').innerHTML;
        const compliedTemplates = Handlebars.compile(addReplyRaw)
        const ourGeneratedHtmls = compliedTemplates({'id': id})
    
        let targetId;
        if(subId == "none"){
            targetId = "comment-input-" + mainId
        }
        else{
            targetId = "subComment-input-" + subId
        }
        const inputBoard = document.getElementById(targetId)
        inputBoard.innerHTML = ourGeneratedHtmls;
        
        // //get the form 
 
        this.formUI(id, mainId, subId)
      
    }

    updateLikeLogic(like){
        let status = like.getAttribute('data-status');
        const type = like.getAttribute('data-commentType');
        const id = like.getAttribute('data-commentId');

        //update ui
        let targetId, newStatus;
        if (type=="main"){
            targetId = 'comment-like-count-' + id;
        }
        else{
            targetId = 'sub-comment-like-count-'+ id;
        }
        if(status == "liked"){
            newStatus = "none"
        }
        else{
            newStatus = "liked"
        }
        let likeCount = document.getElementById(targetId)
       
        let count = parseInt(likeCount.innerText)
        like.setAttribute('data-status',  newStatus) 
        if (newStatus == 'liked'){   
            like.classList.add('liked')
            count ++;
            likeCount.innerText = count;
        }
        else{
            like.classList.remove('liked')
            count --;
            likeCount.innerText = count;
        }

        //send to db
        const url = '/blog/updateLikeApi';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'status': status, 'type': type, 'id': id})
        })

        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            //text: status
           
            //update ui
            
            
        })

    }

    formUI(id, mainId, subId){
        const submitBtnId = "form-submit-" + id
        const submitBtn = document.getElementById(submitBtnId)
        
        const inputFieldId = "input-" + id
        const inputField= document.getElementById(inputFieldId)

        const utilsBoardId = "form-utils-" + id
        const utilsBoard = document.getElementById(utilsBoardId)

        const hideBtnId = "form-hide-" + id
        const hideBtn = document.getElementById(hideBtnId)

        const formId = "comment-form-" + id
        const form = document.getElementById(formId)

        const message = inputField.textContent;
        //open util board
        inputField.addEventListener('focus', ()=>{
            utilsBoard.classList.remove('hide')
            inputField.classList.remove('pale-message')
            inputField.textContent = ""
           
        })

        //enable submit butotn
        inputField.addEventListener('input', ()=>{
            const text = inputField.textContent;
            if(text != ""){
                submitBtn.classList.add('submitable')
                submitBtn.disabled = false;
            }
            else{
                submitBtn.classList.remove('submitable')
                submitBtn.disabled = true;
            }  
        })
            //hide the input field
        hideBtn.addEventListener('click', ()=>{
            form.classList.add('hide')
            inputField.classList.add('pale-message')
            inputField.textContent = message      
        })

        //submit event
        submitBtn.addEventListener('click', ()=>{
            const commentText = inputField.textContent;
            this.addReplyCommentToDb(mainId, subId, commentText)

            //reset
            form.classList.add('hide')
            inputField.classList.add('pale-message')
            inputField.textContent = message
            submitBtn.classList.remove('submitable');
            submitBtn.disabled = true;
            
        })
    }

    removeCommentLogic(type, id){
        //remove from the db
        var url = '/blog/removeCommentApi';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'id': id, 'type': type})
        })
        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            //ui removing
            let targetId;
            if(type == "main"){
                targetId = "main-comment-" + id;
               
            }
            else{
                targetId = "sub-comment-" + id;
               
            }
           
            const comment = document.getElementById(targetId);
            comment.classList.add('hide')
        })


        
    }

    utilsLogic(button){
        
        const type = button.getAttribute('data-type')
        const id = button.getAttribute('data-id')

        let editBtn, removeBtn, utils, textArea, editChoiceArea

        //get the buttons
        if (type == "main"){
            //get the utils
            const utilsId = "main-toggle-utils-" + id;
            utils = document.getElementById(utilsId)
            
            //get the button
            const editBtnId = "main-edit-comment-" + id;
            editBtn = document.getElementById(editBtnId)

            const removeBtnId = "main-remove-comment-" + id;
            removeBtn = document.getElementById(removeBtnId)

            const textAreaId = "main-comment-text-" + id;
            textArea = document.getElementById(textAreaId)

            const editChoiceAreaId = "main-edit-buttons-"+ id;
            editChoiceArea = document.getElementById(editChoiceAreaId)
        }
        else{//=sub
            //get the id
            const utilsId = "sub-toggle-utils-" + id;
            utils = document.getElementById(utilsId)

            //get the button
            const editBtnId = "sub-edit-comment-" + id;
            editBtn = document.getElementById(editBtnId)

            const removeBtnId = "sub-remove-comment-" + id;
            removeBtn = document.getElementById(removeBtnId)

            const textAreaId = "sub-comment-text-" + id;
            textArea = document.getElementById(textAreaId)

            const editChoiceAreaId = "sub-edit-buttons-"+ id;
            editChoiceArea = document.getElementById(editChoiceAreaId)
        }
        const originComment = textArea.innerHTML;
        utils.classList.toggle("hide");


        //EDIT COMMENT
        editBtn.addEventListener('click', ()=>{
            alertBox.classList.add("hide")
            canvas.classList.add("hide")
            utils.classList.add("hide")

            textArea.setAttribute('contentEditable', true);
            textArea.classList.add('editable-textArea');

            let applyBtn = document.createElement('button')
            applyBtn.innerHTML = "Apply"
            applyBtn.classList = "btn pale"
            applyBtn.disabled = true;

            let cancelBtn = document.createElement('button')
            cancelBtn.innerHTML = "Cancel"
            cancelBtn.classList = "btn safe"

            editChoiceArea.innerHTML = ""
            editChoiceArea.appendChild(cancelBtn)
            editChoiceArea.appendChild(applyBtn)

            cancelBtn.addEventListener('click', ()=>{
                textArea.innerHTML = originComment;
                textArea.setAttribute('contentEditable', false);
                textArea.classList.remove('editable-textArea');
                editChoiceArea.innerHTML = ""
            })

            textArea.addEventListener('input', ()=>{
                applyBtn.classList = "btn neutral"
                applyBtn.disabled = false;
                if(textArea.innerHTML == ""){
                    applyBtn.classList = "btn pale"
                    applyBtn.disabled = true;
                }
            })
            applyBtn.addEventListener('click', ()=>{
                const editedText = textArea.textContent;
                        //update on db
                var url = '/blog/updateCommentApi';
                let receviedText;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken':csrftoken,
                    },
                    body:JSON.stringify({'type': type, 'id': id, 'text': editedText})
                })
                .then((response)=>{
                    return response.text() 
                })

                .then((text)=>{
                    //ui effect
                    textArea.textContent = editedText;
                    textArea.setAttribute('contentEditable', false);
                    textArea.classList.remove('editable-textArea');
                    editChoiceArea.innerHTML = ""
                })
                
            })
        })

        const alertBox = document.getElementById("delete-alert-box")
        const canvas = document.getElementById('canvas')

        //REMOVE COMMENT
        removeBtn.addEventListener('click', ()=>{
  
            //show the alert
            canvas.classList.remove('hide')
            alertBox.classList.remove('hide')

            const utilButtons = document.getElementById("util-buttons");
            //create btn
            let yesBtn = document.createElement('button');
            yesBtn.innerHTML = "Yes"
            yesBtn.classList = "yes btn warning"

            let noBtn = document.createElement('button')
            noBtn.innerHTML = "No"
            noBtn.classList = "no btn safe"

            utilButtons.innerHTML = ""
            utilButtons.appendChild(noBtn)
            utilButtons.appendChild(yesBtn)

            yesBtn.addEventListener('click', ()=>{
                this.removeCommentLogic(type, id);

                alertBox.classList.add("hide")
                canvas.classList.add("hide")
                utils.classList.add("hide")
            })
            noBtn.addEventListener('click', ()=>{
                alertBox.classList.add("hide")
                canvas.classList.add("hide")
                utils.classList.add("hide")
            })
        })
        
    }
    
} 

//ABOVE IS THE JS FOR COMMENT


//UTILS BAR
function utilsBar(){
    const utilsBar = document.getElementById('utils-bar')
    const blogBody = document.getElementById('blog-body')
    //get utils bar postion
    var pos = utilsBar.offsetTop + blogBody.offsetTop;
    
    window.addEventListener('scroll', ()=>{
        if(window.scrollY >= pos){
            utilsBar.classList.add("sticky");
            utilsBar.classList.display = 'flex';
        }
        else{
            utilsBar.classList.remove('sticky');
        }
    })
}


//===========utils button
function initUtils(){
    const utils = new Utils;
}
class Utils {
    constructor(){
        this.updateLikeUrl = "/blog/updatePostLikeApi";
        
        this.loginUrl = "/authentication/login";
        
        this.myCards = []
        this.shuffledCards = []
        this.like();
        this.group();
        this.myGroup();
        this.openShare();
        this.quitGroupBoard();
        
      
    
    }
    like(){
        const likeBtn = document.getElementById("post-like-btn");
       
        likeBtn.addEventListener('click', ()=>{
            if(userStatus){
                this.updateLikeApi(); 
            }
            else{
                window.location = this.loginUrl;
            }
             
        })
    }
    updateLikeApi(){
        var url = this.updateLikeUrl;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'postId': postId})
        })

        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            const rate = document.getElementById("rate");
            if(text == "minus"){
                document.getElementById('ilike').classList.remove('remember');
                rate.innerHTML = parseInt(rate.innerHTML)-1;
            }
            else{
                document.getElementById('ilike').classList.add('remember');
                rate.innerHTML = parseInt(rate.innerHTML)+1;
            }
        })
    }
    quitGroupBoard(){
        const btn = document.getElementById('quit-group-board');
        btn.addEventListener('click', ()=>{
            this.quit()
        })
    }
    quit(){
        //close 
        document.getElementById('group-board').classList.add('hide');
        document.getElementById('canvas').classList.add('hide');
        document.getElementById('my-group-form').classList.add('hide');
    }
    group(){
        document.getElementById('group').addEventListener('click', ()=>{
            if(!userStatus){
                window.location = this.loginUrl;
            }
            else{
                const groupBoard = document.getElementById('group-board');
                const canvas = document.getElementById('canvas');
                groupBoard.classList.remove('hide');
                canvas.classList.remove('hide');
                this.openCreate()
            }      
        })
    }
    myGroup(){
       const groups  = document.querySelectorAll('.my-group');
        groups.forEach(group =>{
            group.addEventListener('click', ()=>{
                const groupId = group.getAttribute('data-id');
                this.addGroupDb(groupId)
            })
        })
    }
    openCreate(){
       document.getElementById('create-title').addEventListener('click', ()=>{
            const form = document.getElementById('my-group-form');
            form.classList.remove('hide')
            this.createNewGroup(form)
       })
    }
    createNewGroup(form){
    
        const name = form.elements[0];
        const state = form.elements[1];
        
        name.addEventListener('focus', ()=>{
            name.classList.remove('warning-border')
        })

        form.addEventListener('submit',()=>{
            event.preventDefault()
            
            if(name.value == ""){
                name.classList.add('warning-border')
            }
            else{
                this.createApi(name.value, state.value)
            }
        })
    }
    createApi(name, state){
        const url = '/blog/group/create';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'postId': postId, 'name': name, 'state': state})
        })

        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            if(text == "succeed"){
                
                this.quit()
            }
        })
    }
    addGroupDb(groupId){
        const url = '/blog/group/add';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'postId': postId, 'groupId': groupId})
        })

        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            if(text == "succeed"){
                
                this.quit();
            }
        })
    }
    openShare(){

        document.getElementById('share-btn').addEventListener('click', ()=>{
            if(!userStatus){
                window.location = this.loginUrl;
            }
            else{
                this.savePost()
            }
        })
       
        
        
    }
   
   
    savePost(){
        const url = '/blog/save';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'postId': postId})
        })

        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            if(text == "saved"){
                document.getElementById('save-icon').classList.add('remember')
            }
            else if(text == "unsaved"){
                document.getElementById('save-icon').classList.remove('remember')
            }
        })
    }
}

function initFlashCard(){
    let card;
    if(userStatus){
        card = new FlashCard;
    }
    const toggle = document.getElementById('flash-card');
    toggle.addEventListener('click', ()=>{
        if(userStatus){
            card.openFlashCard(); 
        }else{
            window.location = "/authentication/login"
        }
        
    })
   
}



class FlashCard{
    timeCount;
    defaultTopPs= 10;
    defaultLeftPs = 50;
    curCards = [];
    goodCards = [];
    mediumCards = [];
    badCards = [];
    cardState;
    constructor(){
        this.badTime = 5;
        this.mediumTime = 2;
        this.addCardUrl = "/blog/addCardApi";
        this.loginUrl = "/authentication/login";
        this.getCardUrl = "/blog/getCardApi";
        this.myCards = []
        this.topPs;
        this.leftPs;
        this.curIndex;
        this.startBtn = document.getElementById('start-card');
        this.nextBtn = document.getElementById('next');
        this.startState = document.getElementById('start-state');
        this.timeCountContainer = document.getElementById('time-count');
        this.cardShowContent = document.getElementById('card-show-content');
        this.cardCount = document.getElementById('card-count');
        this.container = document.getElementById('small-cards');
        this.goodCardContainer = document.getElementById('goodCards');
        this.mediumCardContainer  = document.getElementById('mediumCards');
        this.badCardContainer  = document.getElementById('badCards');
        this.quitBtn = document.getElementById('quit-flashcard');
        this.summaryContainer = document.getElementById('summary');
        this.getCard();
        this.addCard();
        this.nextCardEvent();
        this.startEvent();
        this.len;
    }
    addCard(){
        const openBtn = document.getElementById('add-card')
        
        openBtn.addEventListener('click', ()=>{
            const canvas = document.getElementById('canvas')
            const addBoard = document.getElementById('addCardBoard')
            if(!userStatus){
                window.location = this.loginUrl;
            }
            else{
                canvas.classList.remove('hide');
                addBoard.classList.remove('hide');
                this.addCardUtils(canvas, addBoard);
            }
        })
    }   
    addCardUtils(canvas, addBoard){
        //close button
        const xBtn = document.getElementById('close-card-btn');
        xBtn.addEventListener('click', ()=>{
            canvas.classList.add('hide');
            addBoard.classList.add('hide');
        })

        //how to?


        //add card 
        this.addCardToDb();
    }
    addCardToDb(){
        const frontContent = document.getElementById('front-content');
        const frontImgLink = document.getElementById('front-imageLink');
        const frontDescription = document.getElementById('front-description');

        const backContent = document.getElementById('back-content');
        const backImgLink = document.getElementById('back-imageLink');
        const backDescription = document.getElementById('back-description');

        const addBtn = document.getElementById('add-card-btn');
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
                
                const url = this.addCardUrl;

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
                    'postId': postId,
                    })
                })
            
        
                .then((response)=>{
                    return response.text() 
                })
        
                .then((text)=>{
                    //text is the replycomment id
                    frontContent.value = ""
                    frontImgLink.value = ""
                    frontDescription.value = ""

                    backContent.value = ""
                    backImgLink.value = ""
                    backDescription.value = ""
                })
            }

        })
    }

    openFlashCard(){
        const cardContainer = document.getElementById('card-container');  
        cardContainer.classList.remove('hide');
        document.querySelector('body').classList.add('stop-scrolling');
       
        this.quit()
       
    }
    getCard(){
        
        var url = this.getCardUrl;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'postId': postId})
        })

        .then((response)=>{
            return response.json() 
        })

        .then((data)=>{
            
           for(let i = 0; i < data.length; i ++){
                let cardElement = {
                    'front_content': data[i].fields.front_content,
                    'back_content': data[i].fields.back_content,
                    'front_image_link': data[i].fields.front_image_link,
                    'back_image_link': data[i].fields.back_image_link,
                    'front_description': data[i].fields.front_description,
                    'back_description': data[i].fields.back_description,
                }
                this.myCards.push(cardElement)
           }
           this.curCards = this.myCards;
           document.getElementById('curTotal').innerHTML = this.curCards.length;
        })
    }

    shuffledCard(){
        this.curCards = this.myCards.sort(()=> Math.random() - .5)
        this.len = this.curCards.length;
    }

    loadCard(cards){
        this.len = cards.length;
        this.topPs =this.defaultTopPs;
        this.leftPs =this.defaultLeftPs;
        //TODO: ifnot
        //if user choose suffle
        
        this.curIndex = cards.length -1;

        document.getElementById('curTotal').innerHTML = cards.length;

        for(let i =0; i< cards.length; i++){
            this.showCard(cards[i].front_content,
                cards[i].back_content,
                cards[i].front_description,
                cards[i].back_description,
                cards[i].front_image_link,
                cards[i].back_image_link,
                this.topPs, this.leftPs, i)
            this.topPs +=3;
            this.leftPs -=3;
        }       
    }
    showCard(front_content, back_content, front_description, back_description, front_image_link, back_image_link, topPs, leftPs, i){
        let raw = document.getElementById('addCardTemplate').innerHTML;
        let compliedTemplate = Handlebars.compile(raw)
      
        let ourGeneratedHtml = compliedTemplate(
            {'front_content': front_content, 
            'back_content': back_content,
            'front_description': front_description,
            'back_description': back_description,
            'front_image_link': front_image_link,
            'back_image_link': back_image_link,
            'id': i,
            })
    
      
        const node = document.createElement('div');
        node.classList.add('card')
        const left = leftPs + 'px';
        const top = topPs + 'px';
        node.style.left = left;
        node.style.top = top;
        node.id = i;
        node.innerHTML = ourGeneratedHtml;
        this.container.appendChild(node)
    }

    
    startEvent(){
        this.startBtn.addEventListener('click', ()=>{
            this.start(this.myCards);
        })
    }

    start(myCards){
        this.curCards = []
        for(let i =0; i< myCards.length; i++){
            this.curCards.push(myCards[i])
        }
        
        if(myCards.length == 0){
            this.message("&#x1F50A", "This card container is empty!", "success");
            return;
        }
        //this.removeEvent();
        this.resetState(myCards);
        this.resetTimer();
        this.nextCard(this.curIndex);

        this.curIndex--;
        this.startState.classList.add('hide');
        this.nextBtn.classList.remove('hide');
    }

  
    resetState(myCards){
        this.container.innerHTML = "";
        this.loadCard(myCards);
    }

    nextCardEvent(){
       
        const nextBtn = document.getElementById('next');
        nextBtn.addEventListener('click', ()=>{
            this.resetTimer();
            this.nextCard(this.curIndex);
            this.curIndex--;
        })
        
    }
    nextCard(index){
        let tmp = parseInt(this.len) - parseInt(index);
        
        if(index < this.len -1 && index >-1){
            const preCard = document.getElementById("flipcard")
            preCard.classList.add('hide');
            const card = document.getElementById(index);
            card.style.animation = 'slide 0.5s linear forwards'
            card.id = "flipcard";
            // const images = card.querySelectorAll('.side .card-image');
            this.flipCard();
            // this.showImg(images);

            //get card state
            this.getCardState((index + 1));

            //card count
            this.cardCount.innerHTML = tmp;
        }
        else if(index == -1){
            const preCard = document.getElementById("flipcard");
            preCard.classList.add('hide');
           
            this.getCardState((index + 1));
            this.endState();
        }
        else{  //first card
            const card = document.getElementById(index);
            
            card.style.animation = 'slide 0.5s linear forwards'
            card.id = "flipcard";
            // const images = card.querySelectorAll('.side .card-image');
            this.flipCard();
            // this.showImg(images);

            //card count
            this.cardCount.innerHTML = tmp;
        }  
    }
    getCardState(index){
        
        if(this.cardState == 0){
            if(!this.goodCards.includes(this.curCards[index])){
                this.goodCards.push(this.curCards[index]);
                if(this.mediumCards.includes(this.curCards[index])){
                   
                    this.mediumCards = this.mediumCards.filter(item => item != this.curCards[index])
                   
                }
                if(this.badCards.includes(this.curCards[index])){
                    this.badCards  = this.badCards.filter(item => item != this.curCards[index])
                   
                }
            }    
           
        }
        else if(this.cardState==1){
            if(!this.mediumCards.includes(this.curCards[index])){
                this.mediumCards.push(this.curCards[index]);
                if(this.goodCards.includes(this.curCards[index])){ 
                    this.goodCards = this.goodCards.filter(item => item != this.curCards[index])
                   
                }
                if(this.badCards.includes(this.curCards[index])){
                    this.badCards  = this.badCards.filter(item => item != this.curCards[index])
                    
                }  
            } 
            
        }
        else{
            if(!this.badCards.includes(this.curCards[index])){
                this.badCards.push(this.curCards[index]);
                if(this.goodCards.includes(this.curCards[index])){
                    this.goodCards = this.goodCards.filter(item => item != this.curCards[index])
                    
                }
                if(this.mediumCards.includes(this.curCards[index])){
                    this.mediumCards= this.mediumCards.filter(item => item != this.curCards[index])
                }   
            } 
             
        }
       
        
    }
    endState(){
        //stop timer
        clearTimeout(this.t);
        
        this.timeCount = 0;
        this.cardShowContent.classList.remove('waring-background');
        this.cardShowContent.classList.remove('critical-background');

        this.startState.classList.remove('hide');
        this.summaryContainer.classList.remove('hide');
        this.startBtn.classList.add('hide');
        this.nextBtn.classList.add('hide');

        let good = this.goodCards.length;
        let medium =this.mediumCards.length;
        let bad = this.badCards.length;

        this.goodCardContainer.innerHTML = good;
        this.mediumCardContainer.innerHTML = medium;
        this.badCardContainer.innerHTML = bad;
        
        let total = good * 10 + medium * 5 + bad * 0;
        let maxTotal = (good + medium + bad) * 10;

        let percentValue =(total / maxTotal).toFixed(2) * 100;
        let percent = percentValue + "%";
        
        document.getElementById('my-process').innerHTML = percent;

        this.relearn();
    }
    flipCard(){
        const flipcard = document.getElementById('flipcard');
        flipcard.addEventListener('dblclick', ()=>{
            flipcard.classList.toggle('flip')
        })
    }
    showImg(images){
      
        images.forEach(image =>{
            image.addEventListener('click',()=>{
                image.classList.toggle('zoomoutImg');
                
            })
        }) 
    }

    resetTimer(){
        clearTimeout(this.t);
       
        this.timeCount = 0;
        this.cardShowContent.classList.remove('waring-background');
        this.cardShowContent.classList.remove('critical-background');
        this.setTimer();
        
    }

    setTimer(){
        if(this.timeCount > 0 && this.timeCount <=this.mediumTime){
            this.cardState =0;
        }
        else if(this.timeCount > this.mediumTime && this.timeCount <=this.badTime){ 
            this.cardShowContent.classList.add('waring-background');
            this.cardState = 1; //medium
        }
        else if (this.timeCount >this.badTime){
            this.cardShowContent.classList.remove('waring-background')
            this.cardShowContent.classList.add('critical-background')
            this.cardState = 2; //bad
        }
        

        if(this.timeCount == 60){
            this.timeCountContainer.innerHTML = "di dau roi @"
            return;  
        }
        this.timeCountContainer.innerHTML = this.timeCount
        this.timeCount++;
        this.t = setTimeout(function (){
            this.setTimer();
        }.bind(this), 1000);
    }
    
    relearn(){
        this.goodCardContainer.addEventListener('click', ()=>{
            this.start(this.goodCards);
        })
        this.mediumCardContainer.addEventListener('click', ()=>{
            this.start(this.mediumCards)
        })
        this.badCardContainer.addEventListener('click', ()=>{
            this.start(this.badCards)
        })
    }

    getNewCards(cards){
        let newCards = []
            
        cards.forEach(index =>{
           newCards.push(this.curCards[index])
        })
        this.curCards = newCards;
  
    }
    
    quit(){
        this.quitBtn.addEventListener('click', ()=>{
            this.startState.classList.remove('hide')
            this.summaryContainer.classList.add('hide');
            //stop time count
            //reset
            this.container.innerHTML = "";
            clearTimeout(this.t);

            this.cardShowContent.classList.remove('waring-background');
            this.cardShowContent.classList.remove('critical-background');

            this.timeCountContainer.innerHTML = "0";
            this.cardCount.innerHTML = "0";

            const cardContainer = document.getElementById('card-container');
            cardContainer.classList.add('hide');
            document.querySelector('body').classList.remove('stop-scrolling');
        })
    }
    
    message(iconValue, contentValue, state){
        const messageContainer = document.getElementById('message-container');
        const icon = document.getElementById('message-icon');
        const content = document.getElementById('message-content');
        messageContainer.style.animation = "popup 2s none"
        if(state){
            messageContainer.classList.add(state);
        }
        content.innerHTML = contentValue;
        icon.innerHTML = iconValue;
        
        messageContainer.addEventListener('animationend', ()=>{
            messageContainer.style.animation = ""
    })
  
}
}