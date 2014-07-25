from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from GoBoard.models import Message

@login_required
@require_http_methods(["POST"])
def delete(request):
  try:
    u = request.user
    message = Message.objects.get(id=request.POST["did"])
    assert message.deletable(u)
    message.enabled=False
    message.save()
    return HttpResponse("SUCCESS")
  except Exception as e:
    return HttpResponse("ERROR")

