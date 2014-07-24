# Go3 -- Another fine product from the good folks at FIG.

*Go3 is a social media site designed for Haverford College and the extended Tri-College Consortium.*

It was designed for students, by students, to make information approachable, easy-to-access, and easy-to-post.

With these goals in mind, Go3 can be broken up into a few main parts:

 - GoChat (GoBoard)
   - A shoutbox that integrates Twitter-like hashtags and mentions to allow different topics, conversations, and groups.
 
 - GoCards
   - A collection of "Card" widgets that are meant to grant quick access to information in a centralized place.
   - Cards can be customized to each user's preferences.
   - Cards can be created by "installing" the card name in list of available cards (the settings.py).
   - Likewise, each card is configured in a unique Django template. Thus, visual edits can be done in the template itself.
 
 - HaverAds
   - HaverAds are an experiment designed to give a student the ability to post information to a wide audience.
   - Each HaverAd is directly tied to a User in the same way a Message is tied to a User -- thus preventing anonymity.
   - Each User can edit their previously-created HaverAds via the Ad Manager and may have up to 5 `active` ads at once.
   - HaverAds are displayed fairly by showing the least-viewed `active` ad when a page is loaded. 
   - Thus, the system will rotate ads when it reaches view-equilibrium.
   - Users still have access to their `inactive` ads, but may not edit them (only duplicate/delete).
   - Deleted and `inactive` HaverAds are still stored for historical purposes, but will not be displayed.

