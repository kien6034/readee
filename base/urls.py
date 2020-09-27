from django.urls import path
from base import views

urlpatterns = [
    path("", views.home, name="home"),
    path("member/<memberId>/<type>", views.user_home_page, name="user_home_page"),

    path('authentication/login', views.login_view, name = 'login'),
    path('authentication/logout', views.logout_view, name = 'logout'),
    path('authentication/signup', views.signup_view, name = 'signup'),

    #create
    path("add/blog", views.add_blog, name = "add_blog"),
    path("edit/blog/<int:blog_id>/", views.edit_blog, name = "edit_blog"),
    path('delete/blog', views.remove_blog, name = "remove_blog"),
    #all Blogs
    path('sets', views.sets, name= 'sets'),

    #all cards
    path('flashcard/all', views.all_cards, name = 'all_cards'),
    path('viewCard/<setId>', views.view_card, name = "view_card"),
    path('delete/card', views.delete_card, name = "delete_card"),
    path('edit/card', views.edit_card, name = 'edit_card'),
]