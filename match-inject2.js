// Get the script element by its ID
var scriptElement = document.getElementById("__NEXT_DATA__");

// Extract the content of the script element
var scriptContent = scriptElement.textContent;

// Parse the content as JSON
var jsonData = JSON.parse(scriptContent);

// console.log("Json data:", jsonData)
// console.log(jsonData.props.pageProps.dehydratedReduxStateKey)

// this is a list of all cards...
var datadata = JSON.parse(jsonData.props.pageProps.dehydratedReduxStateKey);
// console.log(datadata)

datadata = datadata.studyModesCommon.studiableData.studiableItems;
// console.log(datadata)

// console.log(window.Quizlet["matchModeData"].terms);
var termsSmall = [];

//this should be a list
// let studyItems = window.Quizlet["matchModeData"].terms;
let studyItems = datadata;

for (let card of studyItems) {
	//useful variables to take...
	//self explanatory
	let cardID = card.id;

	//word and definition
	let cardSidesMap = card.cardSides.map(e => e.label);


	//WORD
	//(check if this fails!)
	if (cardSidesMap.indexOf("word") == -1) {
		//we have a problem
		console.log("skipping card... no word")
		console.log(card);
		continue;
	}
	//now map the media of this card side...
	let wordMediaMap = card.cardSides[cardSidesMap.indexOf("word")].media.map(e => e.type);
	// console.log(wordMediaMap);
	//now find index 1...
	if (wordMediaMap.indexOf(1) == -1) {
		//we have a problem
		console.log("skipping card... no word type 1 media")
		console.log(card, wordMediaMap);
		continue;
	}
	let word = card.cardSides[cardSidesMap.indexOf("word")].media[wordMediaMap.indexOf(1)].plainText;


	//definition (check if this also fails)
	if (cardSidesMap.indexOf("definition") == -1) {
		//we have a problem
		console.log("skipping card... no definition")
		console.log(card);
		continue;
	}

	//now map the media of this card side...
	let defMediaMap = card.cardSides[cardSidesMap.indexOf("definition")].media.map(e => e.type);
	// console.log(defMediaMap);
	//now find index 1...
	if (defMediaMap.indexOf(1) == -1) {
		//we have a problem
		console.log("skipping card... no def type 1 media")
		console.log(card, defMediaMap);
		continue;
	}
	let definition = card.cardSides[cardSidesMap.indexOf("definition")].media[defMediaMap.indexOf(1)].plainText;

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

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm('.cvmjmph').then(elm => {
	var referenceNode = document.querySelector('.cvmjmph');
	
	// Insert the new node before the reference node
	referenceNode.after(newNode); // sometimes fails.

	//it aint over until the phat console sings
	console.log("element added");
});