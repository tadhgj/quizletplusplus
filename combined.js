$(document).ready(function() {
    //DOM setup

    //add Quizlet++ button
    $(".arc6ilh").prepend(`<div class='onbpm9l'><button class="AssemblyButtonBase AssemblySecondaryButton AssemblyButtonBase--medium AssemblyButtonBase--padding AssemblyButtonBase--border quizletplusplusbutton" type="button" style="margin-right:16px">Quizlet++</button></div>`);
    //remove free trial button
    //$(".TopNavigation-contentRight .TopNavigationItem:eq(1)").remove();
    
    //add Quizlet++ popup container
    $(".ModeLayout-content").append("<div class='quizletpluspluspopupcontainer'></div>");
    
    popup("Quizlet++ has loaded. Click the Quizlet++ button in the top right to activate.");

    //ON CLICK OF QUIZLET BUTTON
    $(".site").on("click",".quizletplusplusbutton", function() {
        console.log("Quizlet++ Button Click");
        $(".quizletplusplusbutton").text("Quizlet++ ✔️");
        if (!serviceRunning) {
            popup("Quizlet++ is now working. Correct answers will be indicated with a dashed border on mouseover. Click away!");
            serviceRunning = true;
            collectTermData();
            checkLearnView();
        }
    });

    //COLLECT TERM DATA FROM PAGE (Using HTML because of limitations with chrome extensions and their lack of ability in accessing window objects because they're run in a "secure bullshitty thing")
    var termObj;
    function collectTermData() {
        console.log($("#convenientCode").html());
        termObj = JSON.parse($("#convenientCode").html());
    }

    //CUSTOM POPUP MESSAGE (grey, transparent in the bottom right, inspired by GTA mod menus)
    var nextPopupBoxId = 0;
    function popup(text) {
        var tempId = nextPopupBoxId;
        $(".quizletpluspluspopupcontainer").append("<div id='"+nextPopupBoxId+"' class='quizletpluspluspopup'>"+text+"</div>");
        nextPopupBoxId++;
        setTimeout(function() {
            $(".quizletpluspluspopupcontainer #"+tempId).hide( 200 );
        },10000);
    }


    //FIRE ON FLASHCARD CHANGE
    var serviceRunning = false;

    function checkLearnView() {
        if (serviceRunning) {
            //console.log(e);
            console.log("flashcard changed. checking element now");
            //determine the type of flashcard present.

            let currentElements = $('.LearnViewController').children();
            console.log("current possible elements:");
            console.log(currentElements);

            //current elements has 1 or two direct children. one is a progress bar, which is not important.
            let currentElement;

            if (currentElements.length == 1) {
                currentElement = currentElements[0];
            }
            else if (currentElements.length == 2) {
                currentElement = currentElements[1];
            }
            else {
                //right now there's no children. break
                console.log("no children, skipping");
                return;
            }
            console.log("current element:");
            console.log(currentElement);

            //handle class cases
            let currentClass = $(currentElement).attr("class");
            
            console.log("current class:");
            console.log(currentClass);

            if (currentClass.includes("FixedActionLayout")) {
                let currentNestedClass = $($(currentElement).children()[0].children[0]).attr("class");
                console.log(currentNestedClass);
                if (currentNestedClass.includes("ScrollableViewLayout")) {
                    //writing prompt
                    checkWriting();
                }

                //this can be a .ScrollableViewLayout (writing question)
                
                else if (currentClass.includes("FeedbackViewContent")) {
                    //this can be a .FeedbackViewContent ("study this one")
                    //ignore
                }
                else if (currentClass.includes("FlashcardQuestionView-flashcardWrapper")) {
                    //flashcard, ignore
                }
            }
            else if (currentClass.includes("MultipleChoiceQuestionPrompt")) {
                //this is the standard question, continue with this easy
                checkFlashcard();
            }
            else if (currentClass.includes("FlashcardQuestionView-flashcardWrapper")) {
                
            }
            else if (currentClass.includes("ScrollableViewLayout")) {
                
            }
            
            else if (currentClass.includes("CheckpointView")) {
                
            }
            else if (currentClass.includes("EndView")) {
                //they finished the set, it's over
            }


            //if learnviewcontroller has a fixedactionlayout, do this
            //if (currentElements.children)
            //let currentClass = $('.LearnViewController .FixedActionLayout-content div').attr("class");
            //.FlashcardQuestionView-flashcardWrapper = a flashcard
            //.ScrollableViewLayout = a writing based thing
            //.FeedbackViewContent = "study this one", a failed card.
            
            //if learnviewcontroller has a multiplechoicequestionprompt

            //if learnviewcontroller has a checkpointview
            //this is a checkpoint, no cards to check

            
            //checkFlashcard();
        }
        else {
            console.log("Flashcard change ignored. Service not running yet.");
        }
    }

    //for the learn page
    $('.LearnViewController').on('DOMSubtreeModified', function(e){
        checkLearnView();
    });

    //for the write page


    //DETECT CURRENT FLASHCARD INFO
    var previousText;
    var flashCardAnswer;
    function checkFlashcard() {
        console.log("checking flashcard...");

        //check if flashcard is shown, in comparison to a "wrong answer" panel

        //if ($('.LearnViewController').find( ".MultipleChoiceQuestionPrompt" ).length == 0) {
        //    console.log("not a flashcard!");
        //    return;
        //}

        //fetch text
        var flashCardText = $(".LearnViewController .MultipleChoiceQuestionPrompt .FormattedText div").text();
        console.log(flashCardText);

        //check if flashcard content actually changed!
        if (previousText == flashCardText) {
            console.log("duplicate");
            return;
        }
        previousText = flashCardText;

        //check if flashcard content exists in set
        //THIS IS WHERE THE SETTINGS CHECK WOULD COME IN HANDY
        if (findOther(flashCardText) == null) {
            console.log("err");
            return;
        }

        //ALL CLEAR BOYS, THE TERM HAS BEEN FOUND
        flashCardAnswer = findOther(flashCardText);

        //send popup
        popup(flashCardText + "::" + flashCardAnswer);

        //find correct button element
        //.MultipleChoiceQuestionPrompt-termOptions class contains divs with divs with divs with text
        //4th div contains text
        var elem;
        $(".MultipleChoiceQuestionPrompt-termOptions .FormattedText").each(function() {
            if ($(this).html() == flashCardAnswer) {
                $(this).parent().parent().parent().addClass("rightAnswer");
            }
        });

    }


    function checkMultipleChoice() {
        upArrowListen = false;
    }

    function checkWriting() {
        //fetch text
        var flashCardText = $(".FixedQuestionLayout-content .FormattedText div").text();
        if (flashCardText == "") {
            flashCardText = $(".FixedQuestionLayout-content .FormattedTextWithImage div").text();
        }
        console.log(flashCardText);

        //check if flashcard content actually changed!
        if (previousText == flashCardText) {
            console.log("duplicate");
            return;
        }
        previousText = flashCardText;

        //check if flashcard content exists in set
        //THIS IS WHERE THE SETTINGS CHECK WOULD COME IN HANDY
        if (findOther(flashCardText) == null) {
            console.log("err");
            return;
        }

        //ALL CLEAR BOYS, THE TERM HAS BEEN FOUND
        flashCardAnswer = findOther(flashCardText);
        console.log(flashCardAnswer);

        //send popup
        popup(flashCardText + "::" + flashCardAnswer);

        //enable listening
        upArrowListen = true;
        currentCharCount = 0;
    }

    var upArrowListen = false;
    var currentCharCount = 0;
    $('.LearnViewController').on("keyup", ".AutoExpandTextarea-textarea", function(e) {
        console.log("key press detected");
        console.log(e.keyCode);
        //ADDING LETTERS
        if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode == 32) {
            if (upArrowListen) {
                currentCharCount += (currentCharCount < flashCardAnswer.length) ? 1 : 0;
                console.log(currentCharCount);
                $(".AutoExpandTextarea-textarea").val(flashCardAnswer.substr(0,currentCharCount));
                e.preventDefault();
            }
            else {
                console.log("should not be listening");
            }
        }
    });

    $(".LearnViewController").on("keydown", ".AutoExpandTextarea-textarea", function(e) {
        //check keypress limit
        //PRESSING ENTER
        if (e.keyCode == 13 && upArrowListen) {
            currentCharCount = 0;
            upArrowListen = false;
            e.preventDefault();
            $(this).blur();
            $(".WriteViewController .TypeTheAnswerField-actions button").focus();
            $(".WriteViewController .TypeTheAnswerField-actions button").click();
        }
        else if (e.key == "Backspace") {
            //backspace;
            currentCharCount--;
            currentCharCount = currentCharCount < 0 ? 0 : currentCharCount;
        }
        else if (currentCharCount >= flashCardAnswer.length && upArrowListen) {
            e.preventDefault();
            console.log("you've typed it all. stop man");
            //and just to be sure?
            $(".AutoExpandTextarea-textarea").val(flashCardAnswer);
        }
        else {
            return;
        }
    });

    //FIND ID FROM TEXT IN QUIZLET ARRAY
    //text = string, textordefinition = "word" or "definiton"
    function findOther(text) {
        var index = termObj.findIndex(obj=> obj.def==text);
        if (index == -1) {
        var index = termObj.findIndex(obj=> obj.term==text);
        if (index == -1) {
            console.log("could not find matching text in set!");
            return null;
        }
        else {
            return termObj[index].def;
        }
        }
        else {
        return termObj[index].term;
        }
    }
});
