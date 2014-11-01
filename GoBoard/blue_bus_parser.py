import sys
import os
from HTMLParser import HTMLParser
from django.http import HttpResponse
from GoBoard import settings

class MyHTMLParser(HTMLParser): 
    def handle_starttag(self, tag, attrs):
        print "Encountered the beginning of a start tag : ", tag

    def handle_endtag(self, tag): 
        print "Encountered the end of an end tag : ", tag

    def handle_data(self, data): 
        HttpResponse("Encountered data : ", data)

#    def parse_url(request): 
#        p = MyHTMLParser()
#        url = 'http://www.brynmawr.edu/transportation/bico.shtml'
#        content = urllib.urlopen(url).read()
#        p.feed(content)
#        return HttpResponse('DONE')

parser = MyHTMLParser()
parser.feed('<html><head><title>Test</title></head>')
