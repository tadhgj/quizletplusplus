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
        console.log("match.js active...");
        //DOM setup

        //add Quizlet++ button
        $(".arc6ilh").prepend(`<div class='o1c0xcc3'><button class="AssemblyButtonBase AssemblySecondaryButton AssemblyButtonBase--medium AssemblyButtonBase--padding AssemblyButtonBase--border quizletplusplusbutton" type="button" style="margin-right:0px">Q++</button></div>`);
        
        //add Quizlet++ popup container
        $(".cvmjmph").append("<div class='quizletpluspluspopupcontainer'></div>");
        // will be hidden once game starts, because quizlet deletes this parent div...
        
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

        // each item:
        // .n1rw4zro.c1ci68pz.sf3hvof

        //on update of MatchModeQuestionScatterBoard, do something
        // $(".MatchModeLayout").on("mouseover",".MatchModeQuestionScatterTile", function() {
        // $(".b10wn7cm.bpgrkzt").on("mouseover",".n1rw4zro.c1ci68pz.sf3hvof", function() {
        // $(".c12t6xyx").on("mouseover",".n1rw4zro.c1ci68pz.sf3hvof", function() {
        $("div.site").on("mouseover",".n1rw4zro.c1ci68pz.sf3hvof", function() {
            // console.log($(this))
            let currText = $(this)[0].textContent;
            console.log(currText);

            let other = findOther(currText);

            //find element with answer
            // $(".MatchModeQuestionScatterBoard div.FormattedText").each(function(index) {
            $("div.FormattedText").each(function(index) {
                if ($(this).text() == other) {
                    $(this).parent().parent().parent().addClass("rightAnswerAlways");

                    //should only highlight one answer
                    return;
                }
            });
        });

        // $(".MatchModeLayout").on("mouseout",".MatchModeQuestionScatterTile", function() {
        // $(".b10wn7cm.bpgrkzt").on("mouseout",".n1rw4zro.c1ci68pz.sf3hvof", function() {
        // $(".c12t6xyx").on("mouseout",".n1rw4zro.c1ci68pz.sf3hvof", function() {
        $("div.site").on("mouseout",".n1rw4zro.c1ci68pz.sf3hvof", function() {
            console.log("mouseOut");
            if (!lockOn) {
                // $(".MatchModeQuestionScatterBoard .MatchModeQuestionScatterTile").removeClass("rightAnswerAlways");
                $(".n1rw4zro.c1ci68pz.sf3hvof").removeClass("rightAnswerAlways");
            }
        });

        let lockOn = false;

        function findFirstThatStartsWith(array, text) {
            // try it regularly first...
            if (array.includes(text)) {
                console.log("found exact match")
                return array.indexOf(text);
            }

            // see if truncated
            if (text.endsWith("…")) {
                text = text.substring(0, text.length - 1);
            }

            // return hopeful
            for (let i = 0; i < array.length; i++) {
                if (array[i].startsWith(text)) {
                    // return array[i];
                    return i;
                }
            }
            return -1;
        }

        //FIND ID FROM TEXT IN QUIZLET ARRAY
        //text = string, textordefinition = "word" or "definiton"
        function findOther(text) {

            // this application can truncate text cards
            // A soft, French, double-crème cheese. Has a texture similar to that of Brie, but has a slightly stron…
            // so should match by "starts with" logic
            // var index = termObj.findIndex(obj=> obj.def==text);
            // console.log(termObj)
            // console.log(termObj.map(obj => obj.def))
            // console.log(termObj.map(obj => obj.term))
            var index = findFirstThatStartsWith(termObj.map(obj => obj.def), text);
            if (index == -1) {
                // var index = termObj.findIndex(obj=> obj.term==text);
                var index = findFirstThatStartsWith(termObj.map(obj => obj.term), text);
                if (index == -1) {
                    console.log("could not find matching text in set!");
                    return null;
                }
                else {
                    console.log("answer: "+termObj[index].def);
                    return termObj[index].def;
                }
            }
            else {
                console.log("answer: "+termObj[index].term);
                return termObj[index].term;
            }
        }
    });

});