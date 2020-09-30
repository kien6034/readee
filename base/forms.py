from django.forms import ModelForm
from django.utils.translation import gettext_lazy as _
from blog.models import Blog
from base.models import Member

class BlogForm(ModelForm):
    class Meta:
        model = Blog
        fields = [
            'name',
            'image',
            'body',
            'description',
            'public_state',
        ]


class MemberImageUploadForm(ModelForm):
    class Meta:
        model = Member 
        fields = [
            'profile_picture',
            'name', 
        ]
        labels = {
            'profile_picture': _('Profile Picture'),
            'name': _('Your display name'),
        }
       