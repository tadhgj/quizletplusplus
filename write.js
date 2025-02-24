$(document).ready(function() {
  //DOM setup

    //add Quizlet++ button
    $(".TopNavigation-contentRight").prepend(`<div class='TopNavigationItem RightNavigationItem'><button class="AssemblyButtonBase AssemblyIconButton AssemblyIconButton--secondary AssemblyButtonBase--medium quizletplusplusbutton" type="button" style='border-radius:25px;padding:0px 12px;font-family:hurme_no2-webfont;font-kerning: normal;font-size: 14px;font-weight:600;'>Quizlet++</button></div>`);

    // remove ad
    $(".SiteUpgradeButton").parent().remove()
    
    
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
            checkWriting();
        }
    });

  //COLLECT TERM DATA FROM PAGE (Using HTML because of limitations with chrome extensions and their lack of ability in accessing window objects because they're run in a "secure bullshitty thing")
  var termObj;
  function collectTermData() {
    console.log($("#convenientCode").html());
    termObj = JSON.parse($("#convenientCode").html());
  }

  //CUSTOM POPUP MESSAGE
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
  // $('.WriteViewController').on('DOMSubtreeModified', function(){
  //   if (serviceRunning) {
  //     console.log("flashcard changed. checking element now");
  //     checkFlashcard();
  //   }
  //   else {
  //     console.log("Flashcard change did nothing. Service not running yet.")
  //   }
  // });

  // replace above with mutation observer
  // new
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (serviceRunning) {
        console.log("flashcard changed. checking element now");
        checkFlashcard();
        // checkWriting();
      }
      else {
        console.log("ignore; not running yet")
      }
    });
  });
  observer.observe(document.querySelector('.WriteViewController'), {
    attributes: true,
    childList: true,
    subtree: true
  });

  //writing
  function checkWriting() {
    // get question...
    // let question = $("div[data-testid='Question Text']");
    let question = $("div.WriteQuestion-prompt");
    console.log("question:", question);

    // let questionText = question.find(".FormattedText").text();
    let questionHTML = question.find(".FormattedText div");

    if (questionHTML.length == 0) {
      return;
    }

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
        // console.log("err");

        // check other method
        if (findOther(flashCardText) == null) {
          console.log("err (x2)");
          return;
        }

        //ALL CLEAR BOYS, THE TERM HAS BEEN FOUND
        flashCardAnswer = findOther(flashCardText);
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
    let parentAppned = $(".WriteQuestion .AutoExpandTextarea-wrapper");

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

  //DETECT CURRENT FLASHCARD INFO
  var previousText;
  var flashCardAnswer;
  function checkFlashcard() {
    //check if flashcard is shown, in comparison to a "wrong answer" panel
    if ($('.ModeLayout-content').find( ".FormattedText div" ).length == 0) {
      console.log("not a flashcard!");
      return;
    }

    //fetch text
    var flashCardText = $(".ModeLayout-content .FormattedText div").text();
    console.log("flash card text: "+flashCardText);

    //check if flashcard content actually changed!
    if (previousText == flashCardText) {
      // console.log("duplicate");
      return;
    }
    previousText = flashCardText;

    //check if flashcard content exists in set
    //THIS IS WHERE THE SETTINGS CHECK WOULD COME IN HANDY
    if (findOther(flashCardText) == null) {
      console.log("err");
      return;
    }
    else {
      // console.log("all clear");
    }

    //ALL CLEAR BOYS, THE TERM HAS BEEN FOUND
    flashCardAnswer = findOther(flashCardText);
    console.log(flashCardAnswer);

    //send popup
    popup(flashCardText + "::" + flashCardAnswer);

    //start listener for up arrow
    upArrowListen = true;
    currentCharCount = 0;


    let parentAppned = $(".WriteQuestion .AutoExpandTextarea-wrapper");

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


    var upArrowListen = false;
    var currentCharCount = 0;
    let inputContainerSelector = $(".AutoExpandTextarea-textarea");
    waitForElm(".AutoExpandTextarea-textarea").then((elm) => {
      //DETECT KEYDOWNS
      $('.WriteViewController').on("keyup", ".AutoExpandTextarea-textarea", function(e) {
        // console.log(e.keyCode);
        // console.log(e.key)
        //ADDING LETTERS
        if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode == 32) {
          console.log("watched key press detected:" + e.key);
          if (upArrowListen) {
            if (flashCardAnswer != null && flashCardAnswer != "") {
              console.log("flash card answer: "+flashCardAnswer+".")
              currentCharCount += (currentCharCount < flashCardAnswer.length) ? 1 : 0;
              console.log(currentCharCount);
              $(".AutoExpandTextarea-textarea").val(flashCardAnswer.substr(0,currentCharCount));
              e.preventDefault();
            }
          }
          else {
            console.log("should not be listening");
          }
        }
        else {
          console.log("out of range to listen to")
        }
      });

      // $(".WriteViewController").on("keydown", ".AutoExpandTextarea-textarea", function(e) {
      //   //check keypress limit
      //   //PRESSING ENTER
      //   if (e.keyCode == 13 && upArrowListen) {
      //     currentCharCount = 0;
      //     upArrowListen = false;
      //     e.preventDefault();
      //     $(this).blur();
      //     $(".WriteViewController .TypeTheAnswerField-actions button").focus();
      //     $(".WriteViewController .TypeTheAnswerField-actions button").click();
      //   }
      //   else if (flashCardAnswer != undefined && flashCardAnswer.length > 1 && currentCharCount >= flashCardAnswer.length && upArrowListen) {
      //     e.preventDefault();
      //     console.log("you've typed it all. stop man");
      //     //and just to be sure?
      //     $(".AutoExpandTextarea-textarea").val(flashCardAnswer);
      //   }
      //   else {
      //     return;
      //   }
      // });

      let prevInputText = "";
      
      $(".WriteViewController").on("input", ".AutoExpandTextarea-textarea", function(e) {
          if (!upArrowListen) {
              return;
          }

          let inputSelector = ".AutoExpandTextarea-textarea";

          let currInputText = $(inputSelector).val();


          // edit answer
          let newFlashcardAnswer = flashCardAnswer.replace(/\n/g, " ");
          flashCardAnswer = newFlashcardAnswer;

          // console.log("input detected");
          console.log("typed: " + currInputText);
          console.log("change from last: " + (currInputText.length - prevInputText.length));
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
          // wait to call this function if another input event has occurred?
          // because this is sometimes ran after another input has occurred, the 
          // typing can feel jaunty because letters get "forgotten" about
          updatePlaceholder();
          
          prevInputText = currInputText;
      });

      function selectAnswer() {
          let answerButton = $("form button[type='submit']");
          $("").blur();
          $(answerButton).focus();
      }

      function updatePlaceholder() {
          let inputSelector = ".WriteQuestion .AutoExpandTextarea-textarea";
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


      //
      //SEPARATE ON KEYUP FOR BACKSPACES
      $(".LearnModeMain").on("keyup", "#user-answer", function(e) {
        //REMOVING LETTERS
        if (e.keyCode == 8) {
          console.log("backspace detected");
          currentCharCount = $(".AutoExpandTextarea-textarea").val().length;
        }
      });

      

      // wait for ui
      // new
      $(inputContainerSelector).on("input", function(e) {
        if (!upArrowListen) {
            return;
        }

        let currInputText = $(inputSelector).val();


        // edit answer
        let newFlashcardAnswer = flashCardAnswer.replace(/\n/g, " ");
        flashCardAnswer = newFlashcardAnswer;
        if (flashCardAnswer.strip() == "") { // don't stop user from typing if glitched!
          return;
        }
        print("new flashcard answer: " + flashCardAnswer +".")

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

  // new
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