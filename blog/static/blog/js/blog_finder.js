// Start with first post
let counter = 0;

// Load posts 20 at a time
const quantity = 3;

let query = ""
let type = "post"
let by = "all"
let most = "recent"

window.addEventListener('DOMContentLoaded', ()=>{
    
    load(query, type, by, most)
    searchForm()
    sideBar()
    filter()
    mostFilter()
   
    
})




function sideBar(){
    
    const main = document.getElementById('main')
    const sideBar = document.getElementById('sideBar');
    const pos = main.offsetTop;
    
    window.addEventListener('scroll', ()=>{
        if(window.scrollY >= pos){
            sideBar.classList.add('sticky')
        }
        else{
            sideBar.classList.remove('sticky')
        }
    })

    document.getElementById('filter').addEventListener('click', ()=>{
        sideBar.classList.toggle('showSideBar');
    })
    }

window.onscroll = () => {
    
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight-1) {
        load(query, type, by, most);
    }
};


function load(query, type, by){
    // Set start and end post numbers, and update counter
    const start = counter;
    const end = start + quantity - 1;
    counter = end + 1;

    const url = '/blog/get';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'start': start, 'end': end, 'query': query, 'ptype': type, 'pby': by, 'most': most})
    })

    .then((response)=>{
        return response.json() 
    })

    .then((data)=>{
        if (type == "post"){
            data.forEach(element =>{
                addPostToPage(element.id, element.name, element.image, element.author, element.description, element.views, element.date);
            })
        }
        else if(type == "people"){
            data.forEach(element =>{
                adddUserToPage(element.id, element.name, element.image)
            })
        }
        else if(type == "group"){
            data.forEach(element =>{
                adddGroupToPage(element.id, element.name,  element.creator, element.image, element.pcount, element.views, element.description)
            })
        }
        
    })
}

function addPostToPage(id, name, image, author, description, views, date){
    let raw = document.getElementById("addPostHandleBar").innerHTML;
    let compliedTemplate = Handlebars.compile(raw);

    let ourGeneratedHtml = compliedTemplate({'id': id, 'name': name, 'image': image, 'author': author,'description': description, 'views': views, 'date': date});

    let queryContainer = document.getElementById('post-container');
    const node = document.createElement('div');
    node.classList = "element"
    node.id = id;
    node.innerHTML = ourGeneratedHtml;
    
    node.addEventListener('click', ()=>{
        const selection = window.getSelection();
        if(selection.type != "Range"){
            window.location = "/blog/id/" + id;
        }
        
    })
    queryContainer.appendChild(node);
}


function adddGroupToPage(id, name,  creator, image, pcount, views, description){
    let raw = document.getElementById("addGroupHandleBar").innerHTML;
    let compliedTemplate = Handlebars.compile(raw);

    let ourGeneratedHtml = compliedTemplate({'id': id, 'name': name, 'creator':creator, 'image': image, 'pcount': pcount, 'views': views, 'description':description });

    let queryContainer = document.getElementById('post-container');
    const node = document.createElement('div');
    node.classList = "element"
    //node.id = id;
    node.innerHTML = ourGeneratedHtml;

    node.addEventListener('click', ()=>{
        const selection = window.getSelection();
        if(selection.type != "Range"){
            window.location = "/blog/set/" + id;
        }
        
    })
    queryContainer.appendChild(node);


}

function adddUserToPage(id, name, image){
    let raw = document.getElementById("addUserHandleBar").innerHTML;
    let compliedTemplate = Handlebars.compile(raw);

    let ourGeneratedHtml = compliedTemplate({'id': id, 'name': name, 'image': image});

    let queryContainer = document.getElementById('post-container');
    const node = document.createElement('div');
    node.classList = "user-element"
    //node.id = id;
    node.innerHTML = ourGeneratedHtml;
    node.addEventListener('click', ()=>{
        const selection = window.getSelection();
        if(selection.type != "Range"){
            window.location = "/member/" + id;
        }
    })
    queryContainer.appendChild(node)
}
function searchForm(){
    const form = document.getElementById('search-form');
    form.addEventListener('submit', ()=>{
        event.preventDefault();
        
        //reset 
        counter = 0;
        query = form.elements[0].value;
        document.getElementById('search-content').innerHTML = query;

        //clear dom 
        document.getElementById('post-container').innerHTML = "";

        load(query, type, by, most)
    })
}


function filter(){
    typeBtns = document.querySelectorAll('input[name="type"]');
    typeBtns.forEach(btn =>{
        btn.addEventListener('click', ()=>{
            if(btn.checked == true){
                type = btn.value;
                //reset 
                counter = 0;
                //clear dom 
                document.getElementById('post-container').innerHTML = "";

                load(query, type, by, most)
            }
        })
    })

    byBtns = document.querySelectorAll('input[name="by"]');
    byBtns.forEach(btn =>{
        btn.addEventListener('click', ()=>{
            if(btn.checked == true){
                by = btn.value;
                //reset 
                counter = 0;
                //clear dom 
                document.getElementById('post-container').innerHTML = "";
                
                load(query, type, by, most)
            }
        })
    })
}

function mostFilter(){
    const selectOps = document.querySelector("#most");
    selectOps.addEventListener('change', event =>{
        most = event.target.value;
        counter = 0;
    
        //clear dom 
        document.getElementById('post-container').innerHTML = "";
 
        load(query, type, by, most)
    })
}