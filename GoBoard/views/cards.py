from django.http import HttpResponse
from django.shortcuts import render
from GoBoard.settings import DEFAULT_CARDS

def load_cards(request):
  u = request.user

  #Load either the user's cards or the default cards.
  cards = u.userinfo.getCards() if u.is_authenticated() else DEFAULT_CARDS

  return render(request, "cardsPage.html", {
    "cards":cards,
  })
