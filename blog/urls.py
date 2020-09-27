from django.urls import path
from blog import views

urlpatterns = [
    path("search", views.get_blog, name="blog_finder"),
    path("id/<blogId>", views.blog, name="blog"),
    path("test", views.test, name = "test"),
    #api
    path("addCommentApi", views.addCommentApi, name = "addCommentApi"),
    path("addReplyCommentApi", views.addReplyCommentApi, name = "addReplyCommentApi"),
    path("updateLikeApi", views.updateLikeApi, name = "updateLikeApi"),
    path("updateCommentApi", views.updateCommentApi, name = "updateCommentApi"),
    path("removeCommentApi", views.removeCommentApi, name = "removeCommentApi"),

    #utils api
    path("updatePostLikeApi", views.updatePostLikeApi, name = "updatePostLikeApi"),

    #cards
    path("addCardApi", views.addCardApi, name = "addCardApi"),
    path("getCardApi", views.getCardApi, name = "getCardApi"),

    #group  
    path("set/<setId>", views.blog_set, name = "blog_set"),
    path("group/create", views.create_group, name = "create_group"),
    path("group/add", views.add_group, name = "add_group"),
    path("save", views.save_blog, name = "save_blog"),

    #get Blog
    path("get", views.get_blog, name = "get_blog"),
    
]