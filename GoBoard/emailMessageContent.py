
#Content for any password change.
def getChangePasswordText(user, password):
  #Variable Setup.
  name = "friend" if not user.first_name else user.first_name

  text = "Dearest {},\n\n".format(name)
  text += "The password for your Go! account (user '{}') ".format(user.username)
  text += "was just changed to '{}'.\n\n".format(password)
  text += "If you did not request this change, please contact "
  text += "us immediately at fig-staff@googlegroups.com or "
  text += "use the nifty form at our site: fig.haverford.edu\n\n"
  text += "Always faithfully yours,\n"
  text += "FIG <3"
  return text

