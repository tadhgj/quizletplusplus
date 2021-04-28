$(document).ready(function() {
  //DOM setup

    //add Quizlet++ button
    $(".TopNavigation-contentRight").prepend(`<div class='TopNavigationItem'><button class="SiteActivity-button quizletplusplusbutton" type="button" style='border-radius:25px;padding:0px 12px;font-family:hurme_no2-webfont;font-kerning: normal;font-size: 14px;font-weight:600;'>Quizlet++</button></div>`);

    //remove free trial button
    $(".TopNavigation-contentRight .TopNavigationItem:eq(1)").remove();
    
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
            checkFlashcard();
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
  $('.WriteViewController').on('DOMSubtreeModified', function(){
    if (serviceRunning) {
      console.log("flashcard changed. checking element now");
      checkFlashcard();
    }
    else {
      console.log("Flashcard change did nothing. Service not running yet.")
    }
  });

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

    //start listener for up arrow
    upArrowListen = true;
    currentCharCount = 0;
  }

  //DETECT KEYDOWNS
  var upArrowListen = false;
  var currentCharCount = 0;
  $('.WriteViewController').on("keyup", ".AutoExpandTextarea-textarea", function(e) {
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

  $(".WriteViewController").on("keydown", ".AutoExpandTextarea-textarea", function(e) {
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

  //

  /*$('.WriteViewController').on("keydown", ".AutoExpandTextarea-textarea", function(e) {
    console.log("key press detected: '"+e.key+ "' has been pressed");
    //ADDING LETTERS
    if ((e.keyCode >= 48 && e.keyCode <= 90) || e.keyCode == 32) {
      console.log("count = "+currentCharCount+"/"+flashCardAnswer.length);
      if (upArrowListen) {
        if (currentCharCount < flashCardAnswer.length) {
          currentCharCount++;
          $(".AutoExpandTextarea-textarea").val(flashCardAnswer.substr(0,currentCharCount));
          e.preventDefault();
          //var f = $.Event('keypress', { keyCode: 69 });
          //$(".AutoExpandTextarea-textarea").keypress(f);
        }
        else {
          console.log("stop typing! you're done!!! stop!!");
          $(".AutoExpandTextarea-textarea").val(flashCardAnswer.substr(0,currentCharCount));
          e.preventDefault();
        }
      }
      else {
        console.log("should not be listening");
      }
    }
    //PRESSING ENTER
    if (e.keyCode == 13) {
      currentCharCount = 0;
      upArrowListen = false;
    }
    else {
      return;
    }
  });*/

  //SEPARATE ON KEYUP FOR BACKSPACES
  $(".LearnModeMain").on("keyup", "#user-answer", function(e) {
    //REMOVING LETTERS
    if (e.keyCode == 8) {
      console.log("backspace detected");
      currentCharCount = $(".AutoExpandTextarea-textarea").val().length;
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