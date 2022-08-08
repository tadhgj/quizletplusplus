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


    waitForElm("#convenientCode").then((elm) => {
        console.log("combined.js active...");
        //DOM setup

        //add Quizlet++ button
        $(".anbpm9l").prepend(`<div class='o1c0xcc3'><button class="AssemblyButtonBase AssemblySecondaryButton AssemblyButtonBase--medium AssemblyButtonBase--padding AssemblyButtonBase--border quizletplusplusbutton" type="button" style="margin-right:16px">Q++</button></div>`);

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
                popup("Quizlet++ is now working. Correct answers will be indicated with a dashed border on mouseover. Click away!");
                serviceRunning = true;
                collectTermData();
                checkLearnView();
            }
            else {
                //make popup here!
                console.log(upArrowListen);
            }
        });

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

        function checkLearnView() {
            if (serviceRunning) {
                //console.log(e);
                console.log("flashcard changed. checking element now");
                //determine the type of flashcard present.

                let currentElements = $('.StudyModesLayout article').children();
                console.log("current possible elements:");
                console.log(currentElements);

                //current elements has 1 or two direct children. one is a progress bar, which is not important.
                let currentElement;

                if (currentElements.length == 1) {
                    currentElement = currentElements[0];
                }
                else if (currentElements.length == 2) {
                    currentElement = currentElements[0];
                }
                else {
                    //right now there's no children. break
                    console.log("no children, skipping");
                    return;
                }
                console.log("current element:");
                console.log(currentElement);

                //if element is qjwdgny, this is a writing thing
                //if element is a5hy006, this is a flashcard thing



                //handle class cases
                let currentClass = $(currentElement).attr("class");
                
                console.log("current class:");
                console.log(currentClass);

                if (currentClass == "qjwdgny") {
                    checkWriting();
                }
                else if (currentClass == "a5hy006") {
                    checkFlashcard();
                }

                /*if (currentClass.includes("FixedActionLayout")) {
                    let currentNestedClass = $($(currentElement).children()[0].children[0]).attr("class");
                    console.log(currentNestedClass);
                    if (currentNestedClass.includes("ScrollableViewLayout")) {
                        //writing prompt
                        checkWriting();
                    }

                    //WRITING QUESTION EXAMPLE...
                        //<div class="qjwdgny">
                            // <div class="a5hy006">
                            // 	<div class="w1ssq2st grq2jtf">
                            // 		<div class="w1ssq2st hhz8wgl">
                            // 			<div class="w1ssq2st l1dr47li">
                            // 				<section class="l1qy775d">Definition</section>
                            // 				<div class="as9ks2b">
                            // 					<button type="button" aria-label="sound" class="AssemblyButtonBase AssemblyIconButton AssemblyIconButton--tertiary AssemblyIconButton--circle AssemblyButtonBase--small AssemblyButtonBase--circle" title="sound">
                            // 						<svg aria-label="sound" class="AssemblyIcon AssemblyIcon--small" role="img">
                            // 							<noscript></noscript>
                            // 							<use xlink:href="#audio"></use>
                            // 							<noscript></noscript>
                            // 						</svg>
                            // 					</button>
                            // 				</div>
                            // 			</div>
                            // 			<div class="w1ssq2st c1chmkuz"></div>
                            // 			<div class="w1ssq2st r2l768d">
                            // 				<div class="r1lq0pkj"></div>
                            // 			</div>
                            // 		</div>
                            // 	</div>
                            // 	<div class="t1ix05zv" data-testid="Question Text" style="--t1ix05zv-0:auto;">
                            // 		<div class="t1gujtze c1sj1twu">
                            // 			<div aria-label="London, England" class="FormattedText notranslate FormattedTextWithImage-wrapper lang-en" style="font-size: 20px;">
                            // 				<div style="display: block;">London, England</div>
                            // 			</div>
                            // 			<div class="FormattedTextWithImage-wrapper i172n7x2">
                            // 				<div class="Image z1fffk20">
                            // 					<div class="ZoomableImage">
                            // 						<img alt="" class="ZoomableImage-rawImage">
                            // 						</div>
                            // 						<div class="Image-image" style="background-image: url(&quot;https://o.quizlet.com/B4AeM6KLJYPVyRmA8DRk2g_m.jpg&quot;); background-position: center center; background-repeat: no-repeat; height: 104px; width: 104px; background-size: cover;"></div>
                            // 					</div>
                            // 				</div>
                            // 			</div>
                            // 		</div>
                            // 	</div>
                            //</div>

                    //WRITING QUESTION NO PHOTO EXAMPLE
                        //<div class="qjwdgny">
                            // 	<div class="a5hy006">
                            // 		<div class="w1ssq2st grq2jtf">
                            // 			<div class="w1ssq2st hhz8wgl">
                            // 				<div class="w1ssq2st l1dr47li">
                            // 					<section class="l1qy775d">Definition</section>
                            // 					<div class="as9ks2b">
                            // 						<button type="button" aria-label="sound" class="AssemblyButtonBase AssemblyIconButton AssemblyIconButton--tertiary AssemblyIconButton--circle AssemblyButtonBase--small AssemblyButtonBase--circle" title="sound">
                            // 							<svg aria-label="sound" class="AssemblyIcon AssemblyIcon--small" role="img">
                            // 								<noscript></noscript>
                            // 								<use xlink:href="#audio"></use>
                            // 								<noscript></noscript>
                            // 							</svg>
                            // 						</button>
                            // 					</div>
                            // 				</div>
                            // 				<div class="w1ssq2st c1chmkuz"></div>
                            // 				<div class="w1ssq2st r2l768d">
                            // 					<div class="r1lq0pkj"></div>
                            // 				</div>
                            // 			</div>
                            // 		</div>
                            // 		<div class="t1ix05zv" data-testid="Question Text" style="--t1ix05zv-0:auto;">
                            // 			<div class="t1gujtze c1sj1twu">
                            // 				<div aria-label="Femur" class="FormattedText notranslate FormattedTextWithImage-wrapper lang-en" style="font-size: 20px;">
                            // 					<div style="display: block;">Femur</div>
                            // 				</div>
                            // 			</div>
                            // 		</div>
                            // 	</div>

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

                    //FLASHCARD EXAMPLE
                        //<article aria-live="polite" class="szaclz8 s1t6zpc1" style="--s1t6zpc1-3:0; --s1t6zpc1-13: initial;">
                            // <div class="a5hy006">
                            // 	<div class="w1ssq2st grq2jtf">
                            // 		<div class="w1ssq2st hhz8wgl">
                            // 			<div class="w1ssq2st l1dr47li">
                            // 				<section class="l1qy775d">Definition</section>
                            // 				<div class="as9ks2b">
                            // 					<button type="button" aria-label="sound" class="AssemblyButtonBase AssemblyIconButton AssemblyIconButton--tertiary AssemblyIconButton--circle AssemblyButtonBase--small AssemblyButtonBase--circle" title="sound">
                            // 						<svg aria-label="sound" class="AssemblyIcon AssemblyIcon--small" role="img">
                            // 							<noscript></noscript>
                            // 							<use xlink:href="#audio"></use>
                            // 							<noscript></noscript>
                            // 						</svg>
                            // 					</button>
                            // 				</div>
                            // 			</div>
                            // 			<div class="w1ssq2st c1chmkuz"></div>
                            // 			<div class="w1ssq2st r2l768d">
                            // 				<div class="r1lq0pkj"></div>
                            // 				<div class="r1r0iyl2">
                            // 					<div>
                            // 						<section class="fuzysan">
                            // 							<img alt="Report this question" srcset="https://assets.quizlet.com/a/j/dist/app/i/learning_assistant/flag.d36c67607d3916d.png, https://assets.quizlet.com/a/j/dist/app/i/learning_assistant/flag@2x.dd91583cc983fcd.png 2x">
                            // 							</section>
                            // 						</div>
                            // 					</div>
                            // 				</div>
                            // 			</div>
                            // 		</div>
                            // 		<div class="t1ix05zv" data-testid="Question Text" style="--t1ix05zv-0:auto;">
                            // 			<div class="t1gujtze c1sj1twu">
                            // 				<div aria-label="Streets of Philadelphia (If you got this wrong you're dead to me)" class="FormattedText notranslate FormattedTextWithImage-wrapper lang-en" style="font-size: 20px;">
                            // 					<div style="display: block;">Streets of Philadelphia (If you got this wrong you're dead to me)</div>
                            // 				</div>
                            // 				<div class="FormattedTextWithImage-wrapper i172n7x2">
                            // 					<div class="Image z1fffk20">
                            // 						<div class="ZoomableImage">
                            // 							<img alt="" class="ZoomableImage-rawImage">
                            // 							</div>
                            // 							<div class="Image-image" style="background-image: url(&quot;https://o.quizlet.com/d0mNXQCAkkvw9lyoM1nH.w_m.jpg&quot;); background-position: center center; background-repeat: no-repeat; height: 104px; width: 104px; background-size: cover;"></div>
                            // 						</div>
                            // 					</div>
                            // 				</div>
                            // 			</div>
                            // 		</div>
                            // 		<div class="a1xw9zoj">
                            // 			<section aria-label="Choose matching term" class="lv624w6">
                            // 				<div aria-hidden="true">Choose matching term</div>
                            // 			</section>
                            // 			<div class="a1ik211e" data-testid="MCQ Answers">
                            // 				<section class="wbkjose" tabindex="0">
                            // 					<div>
                            // 						<div class="k17vky9d">1</div>
                            // 					</div>
                            // 					<div aria-selected="false" class="t1vgx2mw" data-testid="option-1">
                            // 						<div class="c1sj1twu">
                            // 							<div aria-label="Which musical, based on Romeo &amp; Juliet, was a 1960s Oscar winner." class="FormattedText notranslate FormattedTextWithImage-wrapper lang-en">Which musical, based on Romeo &amp; Juliet, was a 1960s Oscar winner.</div>
                            // 						</div>
                            // 					</div>
                            // 				</section>
                            // 				<section class="wbkjose" tabindex="0">
                            // 					<div>
                            // 						<div class="k17vky9d">2</div>
                            // 					</div>
                            // 					<div aria-selected="false" class="t1vgx2mw" data-testid="option-2">
                            // 						<div class="c1sj1twu">
                            // 							<div aria-label="Where does Fred Flintstone work? Extra point if you can name his boss." class="FormattedText notranslate FormattedTextWithImage-wrapper lang-en">Where does Fred Flintstone work? Extra point if you can name his boss.</div>
                            // 						</div>
                            // 					</div>
                            // 				</section>
                            // 				<section class="wbkjose" tabindex="0">
                            // 					<div>
                            // 						<div class="k17vky9d">3</div>
                            // 					</div>
                            // 					<div aria-selected="false" class="t1vgx2mw" data-testid="option-3">
                            // 						<div class="c1sj1twu">
                            // 							<div aria-label="Which American snack food is rumored to be able to survive a nuclear attack?" class="FormattedText notranslate FormattedTextWithImage-wrapper lang-en">Which American snack food is rumored to be able to survive a nuclear attack?</div>
                            // 						</div>
                            // 					</div>
                            // 				</section>
                            // 				<section class="wbkjose" tabindex="0">
                            // 					<div>
                            // 						<div class="k17vky9d">4</div>
                            // 					</div>
                            // 					<div aria-selected="false" class="t1vgx2mw" data-testid="option-4">
                            // 						<div class="c1sj1twu">
                            // 							<div aria-label="Which 1994 song earned Bruce Springsteen an Academy Award for Best Original Song?" class="FormattedText notranslate FormattedTextWithImage-wrapper lang-en">Which 1994 song earned Bruce Springsteen an Academy Award for Best Original Song?</div>
                            // 						</div>
                            // 					</div>
                            // 				</section>
                            // 			</div>
                            // 		</div>
                            // 	</article>
                }
                else if (currentClass.includes("FlashcardQuestionView-flashcardWrapper")) {
                    
                }
                else if (currentClass.includes("ScrollableViewLayout")) {
                    
                }
                
                else if (currentClass.includes("CheckpointView")) {
                    
                }
                else if (currentClass.includes("EndView")) {
                    //they finished the set, it's over
                }*/
            }
            else {
                console.log("Flashcard change ignored. Service not running yet.");
            }
        }

        //for the learn page
        $('.StudyModesLayout .cz3cbvv .lw557v3').on('DOMSubtreeModified', function(e){
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
            var flashCardText = $(".a5hy006 .FormattedText").text();
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
            $("div[data-testid='MCQ Answers'] .FormattedText").each(function() {
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
            var flashCardText = $(".a5hy006 .FormattedText").text();
            if (flashCardText == "") {
                flashCardText = $(".FixedQuestionLayout-content .FormattedTextWithImage div").text();
            }
            console.log(flashCardText);

            //check if flashcard content actually changed!
            if (previousText == flashCardText) {
                console.log("duplicate");
                //return;
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

        let inputSelector = ".AssemblyInput-input";
        let inputContainerSelector = ".StudyModesLayout";

        $(inputContainerSelector).on("keyup", inputSelector, function(e) {
            // console.log("key press detected");
            // console.log(e.keyCode);
            // //ADDING LETTERS
            // if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode == 32) {
            //     if (upArrowListen) {
            //         e.preventDefault();
            //         currentCharCount += (currentCharCount < flashCardAnswer.length) ? 1 : 0;
            //         console.log(currentCharCount);
            //         $(inputSelector).val(flashCardAnswer.substr(0,currentCharCount));
            //     }
            //     else {
            //         console.log("should not be listening");
            //     }
            // }

            if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode == 32) {
                console.log("key press detected");
                console.log(e.keyCode);
                //ADDING LETTERS

                if (upArrowListen) {
                    console.log("current input:" + $(inputSelector).val());
                    currentCharCount += (currentCharCount < flashCardAnswer.length) ? 1 : 0;
                    console.log(currentCharCount);

                    let localCharCount =  JSON.parse(JSON.stringify(currentCharCount));
                    
                    $(inputSelector).val(flashCardAnswer.substr(0,currentCharCount)).change();

                    console.log("updated input! "+ $(inputSelector).val());

                    //update it again, just for fun. but only if you haven't typed yet again!
                    setTimeout(function() {
                        if (currentCharCount == localCharCount) {
                            $(inputSelector).val(flashCardAnswer.substr(0,currentCharCount)).change();
                        }
                    },100);
                }
                else {
                    console.log("should not be listening");
                }
            }
        });

        $(inputContainerSelector).on("keydown", inputSelector, function(e) {
            //check keypress limit
            //PRESSING ENTER
            if (e.keyCode == 13 && upArrowListen) {
                currentCharCount = 0;
                upArrowListen = false;
                e.preventDefault();
                $(this).blur();

                let buttonElement = ".a151psh7 button[type='submit']";

                $(buttonElement).focus();
                $(buttonElement).click();
            }
            else if (e.key == "Backspace") {
                //backspace;
                currentCharCount--;
                currentCharCount = currentCharCount < 0 ? 0 : currentCharCount;
            }
            else if (currentCharCount >= flashCardAnswer.length && upArrowListen) {
                e.preventDefault();
                console.log("you've typed it all. stop man");
                console.log("before "+ $(inputSelector).val());
                //and just to be sure?
                $(inputSelector).val(flashCardAnswer);

                //to be sure to be sure
                setTimeout(function() {
                    console.log("after "+ $(inputSelector).val());
                },100);
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
    
});