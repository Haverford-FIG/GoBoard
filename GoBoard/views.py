from django.http import HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render

from models import *

def main_page(request):
 	return render(request, "index.html")

