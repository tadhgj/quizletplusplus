//test to see if we can see our precious data
console.log(window.Quizlet["assistantModeData"].studiableData);

//pick out just the word and the answer into a new variable
var termRelationshipList = window.Quizlet["assistantModeData"].studiableData.studiableCardSides;
var rawUglyCards = window.Quizlet["assistantModeData"].studiableData.studiableMediaConnections;
var termsSmall = [];
//each studiableItem has a unique id, and a studiableContainerId which matches exactly one other studiableItem

//118 for 59 cards?
var i = 0;
while (i < termRelationshipList.length) {
	if (termRelationshipList[i].studiableItemId == termRelationshipList[i+1].studiableItemId) {
		console.log(termRelationshipList[i]);
		console.log(termRelationshipList[i+1].id);
		//first is word, second is definition
		let wordTerm = rawUglyCards.filter(obj => {
			return obj.connectionModelId === termRelationshipList[i].id;
		});
		let definitionTerm = rawUglyCards.filter(obj => {
			return obj.connectionModelId === termRelationshipList[i+1].id;
		});
		console.log(wordTerm);
		termsSmall.push({"term":wordTerm[0].text.plainText,"def":definitionTerm[0].text.plainText});
		i = i+2;
	}
	else {
		console.log("it seems that the number has been skipped over, having not found a match between the relative Ids")
		i++;
	}
}

//create element
var newNode = document.createElement('div');

//add text to element
newNode.innerHTML = `<p id='convenientCode' style='display:none'>`+JSON.stringify(termsSmall)+`</p>
<style>
  .quizletpluspluspopupcontainer {
	pointer-events:none;
	position:absolute;
	bottom:0px;
	right:0px;
	width:300px;
	height:800px;
	overflow:hidden;
	display:flex;
	flex-direction:column-reverse;
	justify-content:flex-start;
  }
  .quizletpluspluspopup {
	background:rgba(0,0,0,0.5);
	padding:1px;
	font-size:12px;
	color:black;
  }
  .rightAnswer:hover {
	border:.125rem dashed #ffcd1f;
  }
</style>
  `;

// Get the reference node
setTimeout(function(){
	var referenceNode = document.querySelector('.ModeLayout');
	
	// Insert the new node before the reference node
	referenceNode.after(newNode);

	//it aint over until the phat console sings
	console.log("element added");
}, 200);