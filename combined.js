$(document).ready(function() {
    //wait for element to arrive...
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    //DEBUG
    // $('.StudyModesLayout').on('DOMSubtreeModified', function(e){
    //     // print out class and name of  element that changed
    //     console.log("DOM MODIFY:",e,e.target.className, e.target.nodeName);

    //     // notes:
    //     // from wrong answer to another flashcard...
    //     // DOM MODIFY: lw557v3 DIV
    // });

    // I want to listen for DOMSubtreeModified, and want to fire a function after a burst of changes
    // so I want to wait for a burst of changes to stop, and then fire a function


    waitForElm("#convenientCode").then((elm) => {
        console.log("combined.js active...");
        //DOM setup

        //add Quizlet++ button
        $(".anbpm9l").prepend(`<div class='o1c0xcc3'><button class="AssemblyButtonBase AssemblySecondaryButton AssemblyButtonBase--medium AssemblyButtonBase--padding AssemblyButtonBase--border quizletplusplusbutton" type="button" style="margin-right:16px">Q++</button></div>`);

        //add debug button
        // $(".anbpm9l").prepend(`<div class='o1c0xcc3'><button class="AssemblyButtonBase AssemblySecondaryButton AssemblyButtonBase--medium AssemblyButtonBase--padding AssemblyButtonBase--border quizletplusplusdbutton" type="button" style="margin-right:16px">Debug</button></div>`);

        //remove free trial button
        //$(".TopNavigation-contentRight .TopNavigationItem:eq(1)").remove();
        
        //add Quizlet++ popup container
        $(".StudyModesLayout").append("<div class='quizletpluspluspopupcontainer'></div>");
        
        popup("Quizlet++ has loaded. Click the Quizlet++ button in the top right to activate.");

        //ON CLICK OF QUIZLET BUTTON
        $(".site").on("click",".quizletplusplusbutton", function() {
            console.log("Quizlet++ Button Click");
            $(".quizletplusplusbutton").text("Quizlet++ ✔️");
            if (!serviceRunning) {
                popup("Quizlet++ is now working|. Correct answers will be indicated with a dashed border on mouseover. Click away!");
                serviceRunning = true;
                collectTermData();
                checkLearnView();
            }
            else {
                //make popup here!
                // console.log(upArrowListen);

                // just in case...
                // checkLearnView();
            }
        });

        // ON CLICK OF DEBUG BUTTON
        // $(".site").on("click",".quizletplusplusdbutton", function() {
        //     console.log("Debug Button Click");
        //     checkLearnView();
        // });

        //COLLECT TERM DATA FROM PAGE (Using HTML because of limitations with chrome extensions and their lack of ability in accessing window objects because they're run in a "secure bullshitty thing")
        var termObj;
        function collectTermData() {
            console.log($("#convenientCode").text());
            termObj = JSON.parse($("#convenientCode").text());
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

        $('.StudyModesLayout').on('DOMSubtreeModified', DOMthing);


        let prevTimestampDom = 0;
        let threshold = 1000;
        let timeoutList = [];
        function DOMthing(e) {
            // filter.
            let Currtarget = e.currentTarget.className;
            let target = e.target.nodeName;
            if (Currtarget != "StudyModesLayout" || target != "DIV") {
                return;
            }
            
            
            console.log(e);
            console.log("DOMthing");

            //valid ends

            // flashcard to MCQ
            // lw557v3
            // lw557v3
            // reyok18

            // MCQ to MCQ
            // m1crz3gf
            // lw557v3
            // lw557v3

            // writing to writing
            // a13cru74
            // a13cru74
            // a13cru74
            // lw557v3
            // lw557v3

            // writing to MCQ
            // (ends in)
            // lw557v3
            // lw557v3
            // reyok18

            // MCQ to writing

            let target2 = e.target.className;
            console.log(target2);

            if (target2 != "lw557v3" && target2 != "reyok18") {
                return;
            }
            checkLearnView();


            // console.log(e);
            // let currTime = Date.now();
            // prevTimestampDom = currTime;

            // timeoutList.push(setTimeout(function() {
            //     if (Date.now() - prevTimestampDom >= threshold) {
            //         console.log("DOMthing() fired");
            //         checkLearnView();
            //     }
            //     else {
            //         console.log("DOMthing() not fired");
            //     }
            // }, threshold));
        }

        function checkLearnView() {
            if (serviceRunning) {
                console.log("checkLearnView()");

                // states that we may be in:
                // 1. Multiple choice question
                // 2. Flashcard
                // 3. Written Question

                // can detect "wrong answer" state
                // the parent div of article is .lw557v3
                // and the second child of .lw557v3 is the "press any key to continue" bar
                // not important today


                // 1: multiple choice question
                let mcqTest = $('.StudyModesLayout article').find("div[data-testid='MCQ Answers']");

                if (mcqTest.length > 0) {
                    console.log("Multiple Choice");
                    checkMultipleChoice();
                    return;
                }


                // 2: flashcard
                let flashcardTest = $('.StudyModesLayout').find("div[data-testid='FlippableFlashcard-front']");
                let flashcardTest2 = $('.StudyModesLayout').find("div[data-testid='FlippableFlashcard-back']");

                if (flashcardTest.length > 0 && flashcardTest2.length > 0) {
                    console.log("Flashcard");
                    // checkFlashcard();
                    return;
                }


                // 3: written question
                let writtenTest = $('.StudyModesLayout article').find("label.AssemblyInput");

                if (writtenTest.length > 0) {
                    console.log("Written Question");
                    checkWriting();
                    return;
                }

                // 4: other test
                console.log("too far");
                return;

            }
            else {
                console.log("service not running");
            }
        }

        var previousText;
        var flashCardAnswer;

        // used to compare strings when there is no exact match
        // https://stackoverflow.com/a/36566052

        // for name sake
        function levenshtein(a, b) {
            return similarity(a, b);
        }

        function similarity(s1, s2) {
            var longer = s1;
            var shorter = s2;
            if (s1.length < s2.length) {
                longer = s2;
                shorter = s1;
            }
            var longerLength = longer.length;
            if (longerLength == 0) {
                return 1.0;
            }
            return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
        }

        function editDistance(s1, s2) {
            s1 = s1.toLowerCase();
            s2 = s2.toLowerCase();

            var costs = new Array();
            for (var i = 0; i <= s1.length; i++) {
                var lastValue = i;
                for (var j = 0; j <= s2.length; j++) {
                    if (i == 0)
                        costs[j] = j;
                    else {
                        if (j > 0) {
                            var newValue = costs[j - 1];
                            if (s1.charAt(i - 1) != s2.charAt(j - 1))
                                newValue = Math.min(Math.min(newValue, lastValue),
                                    costs[j]) + 1;
                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }
                if (i > 0)
                    costs[s2.length] = lastValue;
            }
            return costs[s2.length];
        }

        function checkMultipleChoice() {
            upArrowListen = false;

            // get question...
            let question = $("div[data-testid='Question Text']");
            console.log("question:", question);

            // let questionText = question.find(".FormattedText").text();
            let questionHTML = question.find(".FormattedText div");

            // replace <br> with \n
            // let questionText = questionHTML[0].innerText;
            let questionText = questionHTML.html().replace(/<br>/g, " \n");

            // console.log("questionText: " + questionText)
            // print questionText as raw text to console
            // that means \n will be printed as \n
            // and not as a new line
            // console.log("questionTexti: " + questionText)
            console.log("questionText:", {
                "0": questionText
            })

            let flashCardText = questionText;

            // find all possible matching terms
            let terms = $("div[data-testid='MCQ Answers'] section");
            let termTexts = [];
            let termTextsAnswers = [];
            let differences = [];

            $.each(terms, function (key, index) {
                let termHTML = $(this).find(".FormattedText");
                let termText = termHTML.html().replace(/<br>/g, "\n");
                termTexts.push(termText);
                let answer = findOther(termText);
                termTextsAnswers.push(answer);

                // compare answer to questionText
                // let diff = JsDiff.diffChars(questionText, answer);
                if (answer == null) {
                    differences.push(0);
                    return;
                }
                else {
                    let diffNum = similarity(questionText, answer);
                    differences.push(diffNum);
                }
            });

            console.log("termTexts", termTexts);
            console.log("termTextsAnswers", termTextsAnswers);
            console.log("differences", differences);

            // find highest similarity
            let highest = 0;
            let highestIndex = 0;
            $.each(differences, function (key, index) {
                if (index > highest) {
                    highest = index;
                    highestIndex = key;
                }
            });

            // print highest similarity termText, termTextAnswer, and difference
            console.log("highest:", {
                "termText": termTexts[highestIndex],
                "termTextAnswer": termTextsAnswers[highestIndex],
                "questionText": questionText,
                "difference": differences[highestIndex]
            });

            // they are sections within div[data-testid='MCQ Answers']
            // each section has a div with class "FormattedText" that contains the text

            // find the correct answer


            // add a class to the correct answer


            //check if flashcard content exists in set
            //THIS IS WHERE THE SETTINGS CHECK WOULD COME IN HANDY
            var flashCardAnswer = findOther(flashCardText);
            if (flashCardAnswer == null) {
                // if highest similarity is less than 0.5, then return
                if (differences[highestIndex] < 0.5) {
                    console.log("err");
                    return;
                }

                // select highest similarity termText
                console.log("fallback")
                flashCardAnswer = termTexts[highestIndex];

                // console.log("err");
                // return;
            }

            //ALL CLEAR BOYS, THE TERM HAS BEEN FOUND
            console.log("flashCardAnswer:", flashCardAnswer);

            //check if flashcard content actually changed!
            if (previousText == flashCardText) {
                console.log("duplicate");
                // return;
            }
            else {
                popup(flashCardText + "::" + flashCardAnswer);
            }
            previousText = flashCardText;
            //send popup

            // check if flashCardAnswer is in termTexts
            // if it is, add a class to the correct answer
            if (termTexts.includes(flashCardAnswer)) {
                // find the correct answer
                console.log("back check good");
            }

            // use index of answer with highest similarity to add class
            console.log("highestIndex:", highestIndex);
            let correctAnswer = $("div[data-testid='MCQ Answers'] section:eq(" + highestIndex + ")");
            console.log("correctAnswer:", correctAnswer);

            // let correctAnswer = $("div[data-testid='MCQ Answers'] .FormattedText:contains('" + flashCardAnswer + "')");
            correctAnswer.addClass("rightAnswer");

        }

        function checkWriting() {

            // get question...
            let question = $("div[data-testid='Question Text']");
            console.log("question:", question);

            // let questionText = question.find(".FormattedText").text();
            let questionHTML = question.find(".FormattedText div");

            // replace <br> with \n
            // let questionText = questionHTML[0].innerText;
            let questionText = questionHTML.html().replace(/<br>/g, "\n");

            // console.log("questionText: " + questionText)
            // print questionText as raw text to console
            // that means \n will be printed as \n
            // and not as a new line
            // console.log("questionTexti: " + questionText)
            console.log("questionText:", {
                "0": questionText
            })

            let flashCardText = questionText;


            //fetch text
            // var flashCardText = $(".a5hy006 .FormattedText").text();
            // if (flashCardText == "") {
            //     flashCardText = $(".FixedQuestionLayout-content .FormattedTextWithImage div").text();
            // }
            console.log(flashCardText);

            //check if flashcard content exists in set
            //THIS IS WHERE THE SETTINGS CHECK WOULD COME IN HANDY
            flashCardAnswer = findOtherBestMatch(flashCardText);
            if (flashCardAnswer == null) {
                console.log("err");
                return;
            }

            //ALL CLEAR BOYS, THE TERM HAS BEEN FOUND
            console.log(flashCardAnswer);

            //check if flashcard content actually changed!
            if (previousText == flashCardText) {
                console.log("duplicate");
                //return;
            }
            else {

                currentCharCount = 0;
                popup(flashCardText + "::" + flashCardAnswer);
            }
            previousText = flashCardText;


            //send popup

            //enable listening
            upArrowListen = true;

            // add span w/ correct answer to input
            //label.AssemblyInput
            let parentAppned = $("label.AssemblyInput");

            // check if div.correctAnswer already exists
            if (parentAppned.find("div.correctAnswer").length > 0) {
                return;
            }

            // else...
            let span = $("<div>").attr({
                "class": "correctAnswer"
            }).append(
                $("<span>").text("").addClass("typed"),
                $("<span>").text("").addClass("restOf")
            )
            parentAppned.append(span);
            updatePlaceholder();

        }

        var upArrowListen = false;
        var currentCharCount = 0;

        let inputSelector = ".AssemblyInput-input";
        let inputContainerSelector = ".StudyModesLayout";

        let prevInputText = "";

        function updatePlaceholder() {
            let formattedFlashcardAnswer = flashCardAnswer.replace(/\n/g, " ");

            let input = $(inputSelector);
            let inputText = input.val();
            let inputLength;
            let typed = "";
            let restOf = "";

            if (inputText.length == 0) {
                // input.attr("placeholder", formattedFlashcardAnswer);
                // don't change, it's too obvious
                input.attr("placeholder", "Type the answer");
            }
            else {
                inputLength = inputText.length;
                typed = formattedFlashcardAnswer.substring(0, inputLength);
                restOf = formattedFlashcardAnswer.substring(inputLength);
            }

            let typedSpan = $(".correctAnswer .typed");
            let restOfSpan = $(".correctAnswer .restOf");
            typedSpan.text(typed);
            restOfSpan.text(restOf);
        }

        function selectAnswer() {
            let answerButton = $("form button[type='submit']");
            $("").blur();
            $(answerButton).focus();
        }
        
        $(inputContainerSelector).on("input", inputSelector, function(e) {
            if (!upArrowListen) {
                return;
            }

            let currInputText = $(inputSelector).val();


            // edit answer
            let newFlashcardAnswer = flashCardAnswer.replace(/\n/g, " ");
            flashCardAnswer = newFlashcardAnswer;

            // console.log("input detected");
            // console.log("typed: " + currInputText);
            // console.log("change from last: " + (currInputText.length - prevInputText.length));
            let totLength = flashCardAnswer.length;
            let typedLength = currInputText.length;

            if (typedLength > totLength) {
                console.log("too long");
                $(inputSelector).val(flashCardAnswer);
                selectAnswer();
                return;
            }

            if (currInputText == flashCardAnswer) {
                // console.log("correct");
                upArrowListen = false;
                $(inputSelector).val(flashCardAnswer);
                // focus on "answer" button.
                selectAnswer();
                return;
            }

            if (currInputText == flashCardAnswer.substr(0, typedLength)) {
                // console.log("correct so far");
                updatePlaceholder();
                return;
            }

            // typed wrong. intercept and replace
            console.log("wrong");
            $(inputSelector).val(flashCardAnswer.substr(0, typedLength));
            updatePlaceholder();
            
            prevInputText = currInputText;
        });

        //FIND ID FROM TEXT IN QUIZLET ARRAY
        //text = string, textordefinition = "word" or "definiton"
        function findOther(text) {
            // console.log(termObj);

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

        function findOtherBestMatch(text) {
            let closestThreshold = 0.5;

            function findClosest(text, list) {
                var closest = list[0];
                var closestIndex = 0;
                var closestDist = levenshtein(text, closest);
                let outObj = {};
                for (var i = 1; i < list.length; i++) {
                    var dist = levenshtein(text, list[i]);
                    if (dist > closestDist) {
                        closestDist = dist;
                        closest = list[i];
                        closestIndex = i;
                    }
                    outObj[i] = {
                        "d": dist,
                        "text": list[i]
                    };
                }
                console.log(outObj);

                console.log("closest: " + closest + " dist: " + closestDist + " index: " + closestIndex)

                // threshold met?
                if (closestDist < closestThreshold) {
                    return -1;
                }
                return closestIndex;
            }

            // determine if text is a term or definition (only called in writing mode)
            let defCheck = $(".StudyModesLayout article section:contains('Definition')");
            if (defCheck.length > 0) {
                console.log("def check")
                // text is a definition
                let termList = termObj.map(obj => obj.def);
                console.log(termList);
                let testClosestIndex = findClosest(text, termList);

                if (testClosestIndex == -1) {
                    return null;
                }
                else {
                    return termObj[testClosestIndex].term;
                }
            }

            else {
                console.log("term check")
                // try as a term
                let defList = termObj.map(obj => obj.term);
                let testClosestIndex = findClosest(text, defList);

                if (testClosestIndex == -1) {
                    return null;
                }
                else {
                    return termObj[testClosestIndex].def;
                }
            }

        }
    });
    
});