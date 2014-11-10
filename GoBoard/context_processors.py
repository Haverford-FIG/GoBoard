def settings_processor(request):
  # Allows access to the "settings" file in all templates.

  import GoBoard.settings as settings

  return {"settings":settings}
