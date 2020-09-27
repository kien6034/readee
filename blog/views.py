from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.core import serializers
from .models import *
import json 
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.views.decorators.http import require_http_methods, require_GET, require_POST
from django.core.paginator import Paginator
from django.db.models import Q, F
from itertools import chain

from .utils import *
#form
# from blog.forms import FrontCardForm



def get_blog(request):

    if request.method == 'POST':
        data = json.loads(request.body)
        start = data['start']
        end = data['end']
        query = data['query']
        ptype = data['ptype']
        pby = data['pby']
        most = data['most']

        #GET POST
        if ptype == "post":
            allQs = Blog.objects.all().filter(public_state=True)
            if pby == "normal":
                allQs = allQs.filter(author__is_verified=False)
            if pby == "verified":
                allQs = allQs.filter(author__is_verified=True)
            
            if most == 'recent':
                queryset_list = allQs.order_by('-created')
            if most == 'views':
                queryset_list = allQs.order_by('views').reverse()
            if most == "relevant":
                queryset_list = allQs
            
            if query:
                queryset_list1 = queryset_list.filter(
                    Q(name__icontains=query) 
                )
                queryset_list2 = queryset_list.filter(
                    Q(description__icontains=query) & 
                    ~Q(name__icontains = query)
                )
                queryset_list3 = queryset_list.filter(
                    Q(author__user__username__icontains=query) &
                    ~Q(name__icontains = query) &
                    ~Q(description__icontains = query)
                )

                queryset_list = list(chain(queryset_list1, queryset_list2, queryset_list3))
               

            curList = getQuery(request, start, end, queryset_list, ptype)
            
            return JsonResponse(curList, safe = False)
        #GET PEOPLE
        elif ptype == "people":
            queryset_list = Member.objects.all()

            if query:
                queryset_list = queryset_list.filter(user__username__icontains = query)
            
            curList = getQuery(request, start, end, queryset_list, ptype)
            return JsonResponse(curList, safe = False)
     
        #GET GROUP
        elif ptype == "group":
          
            if most == 'recent':
                queryset_list = BlogCluster.objects.all().order_by('-created')
            if most == 'views':
                queryset_list = BlogCluster.objects.all().order_by('totalViews').reverse()
            if most == "relevant":
                queryset_list = BlogCluster.objects.all()

            if query:
                queryset_list1 = queryset_list.filter(
                    Q(name__icontains=query)
                )
                queryset_list2 = queryset_list.filter(
                    Q(description__icontains=query)& 
                    ~Q(name__icontains = query)
                )
                queryset_list3 = queryset_list.filter(
                    Q(member__user__username__icontains=query)& 
                    ~Q(name__icontains = query)& 
                    ~Q(description__icontains = query)
                )

                queryset_list = list(chain(queryset_list1, queryset_list2, queryset_list3))
            
            curList = getQuery(request, start, end, queryset_list, ptype)
            
            return JsonResponse(curList, safe = False)

    return render(request, 'blog/blog_finder.html')

def blog(request, blogId):
    blog = get_object_or_404(Blog, id = blogId)
    
    #avoid race condition - update views
    # blog.views = F('views') + 1
    # blog.save()
    # blog.refresh_from_db()

    #not avoid race condition
    blog.views +=1
    blog.save()
    context = {
        'blog': blog,
        'comments': blog.comments.all()
    }
    
    return render(request, 'blog/blog.html', context = context)


def blog_set(request, setId):
    group = get_object_or_404(BlogCluster, id = setId)

    context = {
        'group': group,
    }

    return render(request,'blog/blog_set.html', context=context)

@require_POST
def addCardApi(request):
    form = FrontCardForm(request.POST)

@require_POST
def addCommentApi(request):
    data = json.loads(request.body)

    type = data['type']
   
    blogId = data['postId']
    text = data['text']
    
    if type == "main":
        blog = Blog.objects.get(id = blogId)
        comment = Comment.objects.create(member= request.user.member, text = text, blog=blog)
    
    apiId = comment.id
  
    return HttpResponse(apiId)

@require_POST
def addReplyCommentApi(request):
    data = json.loads(request.body)

    mainId = data['mainId']
    commentText = data['commentText']
    
    try:
        comment = Comment.objects.get(id = mainId)
        replyComment = ReplyComment.objects.create(member = request.user.member, comment = comment, text = commentText)
    except:
        pass

    replyCommentId = replyComment.id
    return HttpResponse(replyCommentId)

@require_POST
def updateLikeApi(request):
    data = json.loads(request.body)

    status = data['status']
    id = data['id']
    type = data['type']


    if type == "main":
        try:
            comment = Comment.objects.get(id = id)
        except:
            pass
        
        if status == "liked":
            comment.likes.remove(request.user.member)
            status = "none"
        else:
            comment.likes.add(request.user.member)
            status = "liked"
    elif type == "sub":
        try:
            replyComment = ReplyComment.objects.get(id = id)
        except:
            pass

        if status == "liked":
            replyComment.likes.remove(request.user.member)
            status = "none"
        else:
            replyComment.likes.add(request.user.member)
            status = "liked"


    return HttpResponse(status)

@require_POST
def updateCommentApi(request):
    data = json.loads(request.body)
    id = data['id']
    type = data['type']
    editedText = data['text']

    if type == "main":
        try:
            comment = Comment.objects.get(id = id)
        except:
            pass
        
        comment.text = editedText
        comment.save()
        return HttpResponse('comment edited')

    elif type == "sub":
        try:
            replyComment = ReplyComment.objects.get(id = id)
        except:
            pass
        
        replyComment.text = editedText
        replyComment.save()
        
        return HttpResponse('replyComment edited')

    return HttpResponse('Edit text')

@require_POST
def removeCommentApi(request):
    data = json.loads(request.body)
    id = data['id']
    type = data['type']

    if type == "main":
        comment = Comment.objects.get(id = id)
        comment.delete()
    else: # = sub
        replyComment = ReplyComment.objects.get(id=id)
        replyComment.delete()

    return HttpResponse('succeed') 

@require_POST
def updatePostLikeApi(request):
    data = json.loads(request.body)
    postId = data['postId']
    blog = Blog.objects.get(id = postId)
    if request.user.member:
        if request.user.member in blog.likes.all():
            blog.likes.remove(request.user.member)
            status = "minus"
        else:
            blog.likes.add(request.user.member)
            status = "add"
    
    return HttpResponse(status)


@require_POST
def addCardApi(request):
    data = json.loads(request.body)

    frontContent = data['frontContent']
    frontImgLink = data['frontImgLink']
    frontDescription = data['frontDescription']

    backContent = data['backContent']
    backImgLink = data['backImgLink']
    backDescription = data['backDescription']

    postId = data['postId']
    # add to db
    blog = Blog.objects.get(id = postId)
    try:
        card_set = CardSet.objects.get(blog = blog, member = request.user.member)
    except:
        card_set = CardSet.objects.create(blog = blog, member = request.user.member)

    flashCard = FlashCard.objects.create(
        card_set = card_set,
        front_content= frontContent, 
        front_description=frontDescription,
        front_image_link=frontImgLink,
        back_content= backContent, 
        back_description=backDescription,
        back_image_link=backImgLink,
    )

    return HttpResponse('Succeed')

@require_POST
def getCardApi(request):
    data = json.loads(request.body)
    postId = data['postId']
    
    #get the post 
    blog = get_object_or_404(Blog, id = postId)
    try:
        card_set = CardSet.objects.get(blog = blog, member = request.user.member)
        cards = card_set.cards.all()
        cards = serializers.serialize('json', cards)
    except:
        cards = []
        cards = serializers.serialize('json', cards)

    
    return HttpResponse(cards, content_type = "application/json")

@require_POST
def create_group(request):
    data = json.loads(request.body)
    postId = data['postId']
    name = data['name']
    state = data['state']
    
    blog = get_object_or_404(Blog, id = postId)
    if state == "public":
        group = BlogCluster.objects.create(member = request.user.member, name = name, public_state=True)
    else:
        group = BlogCluster.objects.create(member = request.user.member, name = name,  public_state=False)
        
    group.blogs.add(blog)

    return HttpResponse('succeed')

@require_POST
def add_group(request):
    data = json.loads(request.body)
    postId = data['postId']
    groupId = data['groupId']
    
    blog = get_object_or_404(Blog, id = postId)

    groupId = get_object_or_404(BlogCluster, id = groupId)
    
    if groupId not in blog.cluster.all():
        blog.cluster.add(groupId)

    return HttpResponse('succeed')

@require_POST
def save_blog(request):
    data = json.loads(request.body)
    postId = data['postId']
    
    blog = get_object_or_404(Blog, id = postId)

    if blog not in request.user.member.saved_blog.all():
        request.user.member.saved_blog.add(blog)
        return HttpResponse('saved')
    else:
        request.user.member.saved_blog.remove(blog)
        return HttpResponse('unsaved')


def test(request):
    cards =FlashCard.objects.all()
    context= {
        "cards": cards
    }
    return render(request, "blog/test.html", context =context)