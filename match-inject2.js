console.log(window.Quizlet["matchModeData"].terms);
var termsSmall = [];

//this should be a list
let studyItems = window.Quizlet["matchModeData"].terms;

for (let card of studyItems) {
	//useful variables to take...
	//self explanatory
	let cardID = card.id;

	let word = card.word;

	let definition = card.definition;

	console.log({
		"id":cardID,
		"term":word,
		"def":definition,
	});

	termsSmall.push(
		{
			"id":cardID,
			"term":word,
			"def":definition,
		}
	);

}

console.log("termsSmall,",termsSmall);


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
  .rightAnswerAlways {
	border:.125rem dashed #ffcd1f;
	background:#fafafa;
  }
  .matchplusplus {
	position: absolute;
    top: 0px;
    right: 0px;
    font-size: 36px;
    /* background: gray; */
    width: 50px;
    height: 50px;
    line-height: 1;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 4px;
	cursor:pointer;
	border-radius: 0px 5px 0px 0px;
	user-select: none;
	color: gold;
  }
  .matchplusplus.selected {

  }
  .matchplusplus:hover {
	background:#eee;
	color: #B59410;
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