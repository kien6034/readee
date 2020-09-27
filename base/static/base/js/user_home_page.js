const memInfo = document.getElementById('mem-info');
const memId = memInfo.getAttribute('data-id')

window.addEventListener('DOMContentLoaded', ()=>{
    sideBar();
    addPost();
})

function sideBar(){
    const sideBar = document.getElementById('sidebar');
    const pos = sideBar.offsetTop;

    window.addEventListener('scroll', ()=>{
        if(window.scrollY >= pos){
            sideBar.classList.add('sticky')
        }
        else{
            sideBar.classList.remove('sticky')
        }
    })
}

function addPost(){

    document.getElementById('add-post').addEventListener('click', ()=>{
        
        var url = "/add/blog";

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'memberId': memId })
        })
        .then((response)=>{
            return response.text() 
        })

        .then((text)=>{
            
        })
    })


}
