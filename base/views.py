from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, HttpResponseForbidden
from django.core import serializers
from django.urls import reverse
from django.views.decorators.http import require_http_methods, require_GET, require_POST
import json 
from django.db.models import Q, Count
from itertools import chain

from .models import *
from blog.models import Blog, CardSet, FlashCard

#form 
from .forms import BlogForm, MemberImageUploadForm
def home(request):
    return render(request, 'base/home.html')


def login_view(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username = username, password = password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("home"))
        else:
            return render(request, "base/login.html", {"message": "Invalid creadential"})
    else:
        return render(request, 'base/login.html')

def signup_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data['username']
        password = data['password']
        email = data['email']
        #check confirm password

        try:
            username = User.objects.get(username = username)
            message = "Username existed. Please choose different username"
        except:
            newuser = User.objects.create(username = username, email = email)
            #set the hash password
            newuser.set_password(password)
            newuser.save()

            message = "ok"

        return HttpResponse(message)

    else:
        return HttpResponse("Method not allowed")
    
def logout_view(request):
    logout(request)
    return render(request, "base/home.html", {"message": "Logged out"})


def user_home_page(request, memberId, type):
    query = request.GET.get("q")
    title = 'My Posts'
    member = get_object_or_404(Member, id = memberId)

    

    if type == "post":
        allQs = member.author_blog.all()
        if request.user.id == member.user.id:
            posts = allQs
        else:
            posts = allQs.filter(public_state=True)
    elif type == "saved":
        allQs = member.saved_blog.all()
        if request.user.id == member.user.id:
            posts = allQs
        else:
            posts = allQs.filter(public_state=True)

    if query:
        queryset_list1 = posts.filter(
            Q(name__icontains=query) 
        )
        queryset_list2 = posts.filter(
            Q(description__icontains=query) & 
            ~Q(name__icontains = query)
        )
        posts = list(chain(queryset_list1, queryset_list2))
   
    context = {
        'posts': posts,
        'title': title,
    }

    return render(request, "base/user_home_page.html", context = context)

def setting(request, memberId = None):
    member = get_object_or_404(Member, id = memberId)
    if request.user.member:
        form = MemberImageUploadForm(request.POST, request.FILES or None, instance=member)
        if request.method == "POST":    
            if form.is_valid():
                form.save()
            return HttpResponse('Upload image succeeded')
            
    return render(request, 'base/setting.html', {'form': form})
    
    
    
def password_reset_view(request):
    return render(request, 'base/password_reset.html')

def password_reset_done_view(request):
    return render(request, 'base/password_reset_done.html')


def upload_pic(request):
    if request.method == 'POST':
        form = Member(request.POST, request.FILES)
        upType = request.POST.get("upType")
        my_id = request.POST.get("id")
        
        if form.is_valid():
            m = Member.objects.get(id = my_id)
            m.model_pic = form.cleaned_data['image']
            m.save()
        
        return HttpResponse('image upload success')
    return HttpResponseForbidden('allowed only via POST')

def sets(request):
    context = {
        'sets': request.user.member.my_group.all()
    }
    return render(request, 'base/sets.html', context = context)

def add_blog(request):
    if request.method == "POST":
        
        form = BlogForm(request.POST or None, request.FILES or None)
        if form.is_valid():
            post_item = form.save(commit= False)
            post_item.author = request.user.member
            post_item.save()
            # to do
            return redirect(reverse('user_home_page', args = [request.user.member.id, 'post']))
    else:
        form = BlogForm()

     
    return render(request, 'base/addBlog.html', {'form': form})

def edit_blog(request, blog_id = None):
    blog = get_object_or_404(Blog, id = blog_id)
    form = BlogForm(request.POST or None, request.FILES or None, instance=blog)
    if form.is_valid():
        form.save()
        # to do
        return redirect(reverse('blog', args=[blog_id]))
   
     
    return render(request, 'base/addBlog.html', {'form': form})

def remove_blog(request):
    data = json.loads(request.body)
    postId = data['postId']
    message = 'succeed'
    try: 
        blog = Blog.objects.get(id = postId)
        blog.delete()
        
    except: 
        message = 'fail'
    return HttpResponse(message)


def all_cards(request):
    
    sets = CardSet.objects.all().filter(member = request.user.member)
    print(sets)
    context  = {
        'sets': sets
    }
    return render(request, 'base/all_cards.html', context = context)

def view_card(request, setId):

    my_set = get_object_or_404(CardSet, id = setId)
    context = {
        'name': my_set.blog.name,
        'cards':  my_set.cards.all()
    }
    return render(request, 'base/view_card.html', context= context)

@require_POST
def delete_card(request):
    data = json.loads(request.body)
    cardId = data['cardId']

    card = get_object_or_404(FlashCard, id = cardId)
    card.delete()

    return HttpResponse('succeed')

@require_POST
def edit_card(request):
    data = json.loads(request.body)
    cardId = data['cardId']
    front_content = data['frontContent']
    back_content = data['backContent']
    front_description = data['frontDescription']
    back_description = data['backDescription']
    front_image_link = data['frontImgLink']
    back_image_link = data['backImgLink']

    card = get_object_or_404(FlashCard, id = cardId)
    card.front_content = front_content
    card.back_content = back_content
    card.front_description = front_description
    card.back_description = back_description
    card.front_image_link =front_image_link
    card.back_image_link = back_image_link
    card.save()

    return HttpResponse('succeed')