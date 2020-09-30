from django.urls import path
from django.contrib.auth import views as  auth_views
from base import views

urlpatterns = [
    path("", views.home, name="home"),
    path("member/<memberId>/<type>", views.user_home_page, name="user_home_page"),

    path('authentication/login', views.login_view, name = 'login'),
    path('authentication/logout', views.logout_view, name = 'logout'),
    path('authentication/signup', views.signup_view, name = 'signup'),

    path('setting/<memberId>', views.setting, name = "setting"),
    path('reset-password/', auth_views.PasswordResetView.as_view(template_name = "base/password_reset.html"), name = "reset_password"),
    path('reset-password_sent/', auth_views.PasswordResetDoneView.as_view(template_name = "base/password_reset_sent.html"), name = "password_reset_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name = "base/password_reset_form.html"), name = "password_reset_confirm"),
    path('reset-password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name = "base/password_reset_done.html"), name = "password_reset_complete"),

    #upload image
    path('upload-pic', views.upload_pic, name = "upload_pic"),


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