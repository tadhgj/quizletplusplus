# Quizlet++
Quizlet Hacks

Chrome Extension Link (Working on any browser that supports Chromium extensions)
https://chrome.google.com/webstore/detail/quizlet++/ikpjogookicblaeiilbdjmgbdjkhpjjg

### Overview
This is a chrome extension that helps students quickly complete Quizlet activities.

### Working Features
* Highlights (on mouse hover) the correct answer in a multiple choice question in **Learn mode**.
* Highlights (on mouse hover) the correct answer in a multiple choice question in **Match mode**.
* Intercepts and replaces keypresses to spell out the correct answer in a written question in Learn and Write mode.
* Has a button to activate the service
* Has a popup system that indicates when the service has been activated, or detected a flashcard match.

### Description of the inner works
This is a chrome extension that reads a quizlet page's global variables for the flashcard list and details. 

This list of flashcards is then added to the DOM, in an invisible element, which can be read and stored "locally" by the chrome extension (because they run in these fancy little protected spaces). 

When the DOM changes in a recognizable way (next question on learn or write), the card text is read, then compared to the stored flashcards, and the answer is (essentially) given to the user. 

Either the correct flashcard is indicated when hovered over, or the keypresses to write are intercepted and replaced.

### To-do features
* Test mode
* Work with flashcards that don't contain text
* How to handle when two flashcards have the exact same text content. (Duplicates that results in only one flashcard match being utilized)

#### PS
If you like the extension, leaving a review is pretty cool. It means that my extension is more likely to show up first when you search for quizlet extensions. If it's broken, you have the right to leave a bad review, but if you could instead contact me, I should fix it pretty quick!
