from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Blog)
admin.site.register(Comment)
admin.site.register(ReplyComment)
admin.site.register(FlashCard)
admin.site.register(BlogCluster)
admin.site.register(CardSet)