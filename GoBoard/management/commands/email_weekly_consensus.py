from django.core.management.base import BaseCommand
from GoBoard.emailFunctions import email_weekly_consensus

class Command(BaseCommand):
  def handle(self, *args, **kwargs):
    email_weekly_consensus()
