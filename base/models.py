from django.db import models
from django.contrib.auth.models import User

from django.db.models.signals import post_save


# Create your models here.

class Property(models.Model):
    to_verified = models.IntegerField()
    normal_user_max_card = models.IntegerField()
    
class Introduction(models.Model):
    ENGLISH = 'EN'
    VIETNAMESE = 'VN'

    LANGUAGE_CHOICES = [
        (ENGLISH, 'EN'),
        (VIETNAMESE, 'VN'),
    ]
    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES ,
        default=ENGLISH,
    )
    text = models.TextField()
    image = models.ImageField()


class Member(models.Model):
    user = models.OneToOneField(User, on_delete= models.CASCADE, null= True, blank = True)
    profile_picture = models.ImageField(null = True, blank = True)
    is_verified = models.BooleanField(default=False)
    name = models.CharField(max_length=256)
    
    @property 
    def imageURL(self):
        try:
            url = self.profile_picture.url 
        except:
            url = 'https://django-kien6034-summer.s3.amazonaws.com/user.png'
        return url

    def __str__(self):
        return f"{self.user}"

#auto create member when user is created
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Member.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)