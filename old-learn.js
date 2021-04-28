$(document).ready(function() {
  //ON STARTUP OF QUIZLET LEARN PAGE
  //test jqury functionality
  console.log("hello world");
  //add Quizlet++ button
  $(".TopNavigation-contentRight").prepend(`<div class='TopNavigationItem'><button class="SiteActivity-button quizletplusplusbutton" type="button">Quizlet++</button></div>`);
  //remove free trial button
  $(".TopNavigation-contentRight .TopNavigationItem:eq(1)").remove();
  //add Quizlet++ popup container
  $(".ModeLayout-content").append("<div class='quizletpluspluspopupcontainer'></div>");
  popup("Quizlet++ has loaded. Click the Quizlet++ button in the top right to activate.");
  //new
  

  //ON CLICK OF QUIZLET BUTTON
  $(".site").on("click",".quizletplusplusbutton", function() {
    console.log("click");
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
  $('.LearnViewController').on('DOMSubtreeModified', ' span', function(){
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
  function checkFlashcard() {
    //check if flashcard is shown, in comparison to a "wrong answer" panel
    if ($('.LearnViewController').find( ".MultipleChoiceQuestionPrompt" ).length == 0) {
      console.log("not a flashcard!");
      return;
    }

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
    var flashCardAnswer = findOther(flashCardText);

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