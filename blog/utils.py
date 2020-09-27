from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.core import serializers
from .models import *
import json 

def getQuery(request, start, end, queryset_list, ptype):
    curList = []
    
    if start > len(queryset_list):
        pass
    elif (end+1) < len(queryset_list):
        
        for i in range(start, end+1):
            if ptype == "post":
                element = {
                    'id': queryset_list[i].id,
                    'name': queryset_list[i].name,
                    'image':  queryset_list[i].imageURL,
                    'author': queryset_list[i].author.user.username,
                    'views':  queryset_list[i].views,
                    'description': queryset_list[i].description,
                    'date': queryset_list[i].pcreated,
                }
            elif ptype == "people":
                element = {
                    'id': queryset_list[i].id,
                    'name': queryset_list[i].user.username,
                    'image':  queryset_list[i].imageURL,
                    
                }
            elif ptype == "group":
                element = {
                    'id': queryset_list[i].id,
                    'name': queryset_list[i].name,
                    'pcount': queryset_list[i].getNumOfBlogs,
                    'creator': queryset_list[i].member.user.username,
                    'views': queryset_list[i].getViews,
                    'description': queryset_list[i].description,
                    'image': queryset_list[i].blogs.first().imageURL,
                }
            curList.append(element)
    else:
        for i in range(start, len(queryset_list)):
            if ptype == "post":
                element = {
                    'id': queryset_list[i].id,
                    'name': queryset_list[i].name,
                    'image':  queryset_list[i].imageURL,
                    'author': queryset_list[i].author.user.username,
                    'views':  queryset_list[i].views,
                    'description': queryset_list[i].description,
                    'date': queryset_list[i].pcreated,
                }
            elif ptype == "people":
                element = {
                    'id': queryset_list[i].id,
                    'name': queryset_list[i].user.username,
                    'image':  queryset_list[i].imageURL,
                    
                }
            elif ptype == "group":
                element = {
                    'id': queryset_list[i].id,
                    'name': queryset_list[i].name,
                    'pcount': queryset_list[i].getNumOfBlogs,
                    'creator': queryset_list[i].member.user.username,
                    'views': queryset_list[i].getViews,
                    'description': queryset_list[i].description,
                    'image': queryset_list[i].blogs.first().imageURL,
                }
            curList.append(element)
    return curList