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
        $(".TopNavigation-contentRight").prepend(`<div class='TopNavigationItem'><button class="AssemblyButtonBase AssemblyButtonBase--small AssemblyButtonBase--padding quizletplusplusbutton" type="button" style="margin-right:16px">Q++</button></div>`);

        // add second Quizlet++ button
        waitForElm(".MatchModeInstructionsModal").then((elm) => {
            $(".MatchModeInstructionsModal").prepend(`<div class='matchplusplus'>+</div>`);

            $(".UIModal").on("click",".matchplusplus", function() {
                console.log("MatchPlusPlus Button Click");
                $(".matchplusplus").css("font-size","12px").text("✔️");
                $(".quizletplusplusbutton").text("Quizlet++ ✔️");
                if (!serviceRunning) {
                    popup("MatchPlusPlus is now working. Correct answers will be indicated with a dashed border on mouseover. Click away!");
                    serviceRunning = true;
                    collectTermData();
                }
                else {

                }
            });
        });

        //remove free trial button
        $(".TopNavigation-contentRight .TopNavigationItem:contains('Upgrade')").remove();
        
        //add Quizlet++ popup container
        $(".UIContainer").append("<div class='quizletpluspluspopupcontainer'></div>");
        
        popup("Quizlet++ has loaded. Click the Quizlet++ button in the top right to activate.");

        //ON CLICK OF QUIZLET BUTTON
        $(".site").on("click",".quizletplusplusbutton", function() {
            console.log("Quizlet++ Button Click");
            $(".quizletplusplusbutton").text("Quizlet++ ✔️");
            if (!serviceRunning) {
                popup("Quizlet++ is now working. Correct answers will be indicated with a dashed border on mouseover. Click away!");
                serviceRunning = true;
                collectTermData();
            }
            else {

            }
        });

        //ON CLICK OF MATCHPLUSPLUS BUTTON


        //FIRE ON FLASHCARD CHANGE
        var serviceRunning = false;

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

        //on update of MatchModeQuestionScatterBoard, do something
        $(".MatchModeLayout").on("mouseover",".MatchModeQuestionScatterTile", function() {
            // console.log($(this))
            let currText = $(this)[0].textContent;
            // console.log(currText);

            let other = findOther(currText);

            //find element with answer
            $(".MatchModeQuestionScatterBoard div.FormattedText").each(function(index) {
                if ($(this).text() == other) {
                    $(this).parent().addClass("rightAnswerAlways");

                    //should only highlight one answer
                    return;
                }
            });
        });

        $(".MatchModeLayout").on("mouseout",".MatchModeQuestionScatterTile", function() {
            console.log("mouseOut");
            if (!lockOn) {
                $(".MatchModeQuestionScatterBoard .MatchModeQuestionScatterTile").removeClass("rightAnswerAlways");
            }
        });

        let lockOn = false;

        // when dragging something
        $(".MatchModeLayout").on("mousedown",".MatchModeQuestionScatterTile", function() {
            console.log("dragging");

            // lock in the highlighted thing until mouseup
            lockOn = true;
            $(".MatchModeQuestionScatterBoard .MatchModeQuestionScatterTile").removeClass("rightAnswerAlways");

            let currText = $(this)[0].textContent;
            console.log(currText);

            let other = findOther(currText);

            //find element with answer
            $(".MatchModeQuestionScatterBoard div.FormattedText").each(function(index) {
                if ($(this).text() == other) {
                    $(this).parent().addClass("rightAnswerAlways");

                    //should only highlight one answer
                    return;
                }
            });
        });

        // let go
        $(".MatchModeLayout").on("mouseup",".MatchModeQuestionScatterTile", function() {
            console.log("let go");
            lockOn = false;
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