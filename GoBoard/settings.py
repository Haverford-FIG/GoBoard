
import os

PROJECT_ROOT = os.path.abspath(os.path.dirname(__name__))

# Django settings for GoBoard project.
DEBUG = True
TEMPLATE_DEBUG = DEBUG

#Allows us query how many user sessions are active at a given time.
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

ALLOWED_HOSTS = ["127.0.0.1","0.0.0.0","165.82.80.243", "go.haverford.edu", "localhost", "ironwood.fig.haverford.edu"]


# # # # # #GoBoard Interface Settings  # # # # # # # # # # #
#The max number of entries to display in an updateContainer.
MAX_UPDATE_CONTAINER_ENTRIES = 15
CAMPUS_OPTIONS = ["Haverford", "Swarthmore", "Bryn Mawr", "UPenn", "Alumni"]
THEME_OPTIONS = ["pastel", "havertheme"]
DEFAULT_THEME = "havertheme"

MESSAGES_PER_TRANSACTION = 30

#The 'name' of a card with that matches a filename "<name>.html"
DEFAULT_CARDS = ["DC", "Blue_Bus", "Calendar","WHRC_Radio", "links", "SEPTA"]
AVAILABLE_CARDS = {
                    "imgur", "WHRC_Radio", "weather", "SEPTA",
                    "links", "Haverford_Clerk", "Go_Chat",
                    "Blue_Bus", "BiCo_News", "Calendar",
                    "DC", "HaverStalk",
                  }

#Card-specific Settings
SEPTA_LOCATIONS = {
  "Haverford": "Haverford",
  "Ardmore": "Ardmore",
  "30th Street": "30th+Street+Station",
  "Bryn Mawr": "Bryn+Mawr",
  "Suburban Station": "Suburban+Station",
  "Jefferson": "Market+East",
}
SEPTA_LOCATIONS_SORTED = sorted(SEPTA_LOCATIONS.keys())
SEPTA_DEFAULT_START = "Haverford"
SEPTA_DEFAULT_END = "30th Street"

BLUE_BUS_LOCATIONS = {
  "Weekday": ["Haverford", "Bryn Mawr"],
  "Saturday Daytime": ["BMC", "Suburban Square", "HC South Lot", "Stokes"],
  "Weekend": ["Haverford", "Bryn Mawr"],
}

#Email Settings
EMAIL_USE_TLS = True
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "noreply.figstaff@gmail.com"
EMAIL_HOST_PASSWORD = "SecurePassword"  #TODO: Change me in production!
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


ADMINS = ()

MANAGERS = ADMINS

DATABASES = {
    'default': {
	#TODO:Enable MySQL in production.
        #'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'GoBoard_db',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'root',
        'PASSWORD': 'SecurePassword',
        'HOST': '',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',                      # Set to empty string for default.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/New_York'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = False

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = ""

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
	os.path.join(PROJECT_ROOT, 'static/'),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '&$dlm7*=t8=d-ovxzyq4sq*2y8tmuzgh5(m5_3&09st8=x2j2@'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'GoBoard.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'GoBoard.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
	os.path.join(PROJECT_ROOT, 'templates/'),
)


from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS
TEMPLATE_CONTEXT_PROCESSORS += (
    "GoBoard.context_processors.settings_processor",
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    'django.contrib.admindocs',
    "GoBoard",
)

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
