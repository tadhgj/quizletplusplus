
// Get the script element by its ID
var scriptElement = document.getElementById("__NEXT_DATA__");

// Extract the content of the script element
var scriptContent = scriptElement.textContent;

// Parse the content as JSON
var jsonData = JSON.parse(scriptContent);

console.log("Json data:", jsonData)
console.log(jsonData.props.pageProps.studyModesCommon.studiableDocumentData.studiableItems)

// this is a list of all cards...
var datadata = jsonData.props.pageProps.studyModesCommon.studiableDocumentData.studiableItems;

let studyItems = datadata;

var termsSmall = [];

//studiableDocumentData... the holy grail
//including one example of a card here...

// "studiableDocumentData": {
// 	"studiableItems": [{
// 		"id": 17954577676,
// 		"studiableContainerType": 1,
// 		"studiableContainerId": 505463781,
// 		"type": 2,
// 		"rank": 0,
// 		"creatorId": 169906751,
// 		"timestamp": 1588262457,
// 		"lastModified": 1588262457,
// 		"isDeleted": false,
// 		"cardSides": [
		// {
		// 		"sideId": 1,
		// 		"label": "word",
		// 		"media": [
				// {
			// 			"type": 1,
			// 			"plainText": "Which city hosted the 2012 Summer Olympics?",
			// 			"languageCode": "en",
			// 			"ttsUrl": "\/tts\/en.mp3?v=14&b=V2hpY2ggY2l0eSBob3N0ZWQgdGhlIDIwMTIgU3VtbWVyIE9seW1waWNzPw&s=JPB7FNRB",
			// 			"ttsSlowUrl": "\/tts\/en.mp3?v=14&b=V2hpY2ggY2l0eSBob3N0ZWQgdGhlIDIwMTIgU3VtbWVyIE9seW1waWNzPw&s=JPB7FNRB&speed=70",
			// 			"richText": null
			// 		}
			//  ],
		// 		"distractors": []
	// 		}, 
		// {
		// 		"sideId": 2,
		// 		"label": "definition",
		// 		"media": [
				// {
			// 			"type": 1,
			// 			"plainText": "London, England",
			// 			"languageCode": "en",
			// 			"ttsUrl": "\/tts\/en.mp3?v=14&b=TG9uZG9uLCBFbmdsYW5k&s=T.tPKtG.",
			// 			"ttsSlowUrl": "\/tts\/en.mp3?v=14&b=TG9uZG9uLCBFbmdsYW5k&s=T.tPKtG.&speed=70",
			// 			"richText": null
			// 		}, 
			// 		{
			// 			"type": 2,
			// 			"code": "4V57rrGeQPFHbZ8x",
			// 			"url": "https:\/\/o.quizlet.com\/B4AeM6KLJYPVyRmA8DRk2g_m.jpg",
			// 			"width": 644,
			// 			"height": 432
			// 		}
		// 		],
		// 		"distractors": []
	// 		}
// 		]
// 	}


for (let card of studyItems) {
	//useful variables to take...
	//self explanatory
	let cardID = card.id;

	//not sure what special card types there are. seems to only be type 2 for regular cards
	let cardType = card.type

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
		"type":cardType,
		"term":word,
		"def":definition,
	});

	termsSmall.push(
		{
			"id":cardID,
			"type":cardType,
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
	position:fixed;
	z-index:999;
	bottom:10px;
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
  div.correctAnswer {
    position: absolute;
    bottom: 11px;
    left: 16px;
    font-weight: 600;
    height: 26px;
	width: calc(100% - 32px);
	white-space: pre;
    pointer-events: none;
	display:flex;
  }
  .correctAnswer .typed {
	opacity:0;
  }
  .correctAnswer .restOf {
	background: -webkit-linear-gradient(180deg, #fefefe, #ccc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
	display:block;
	width:100%;
  }

   /* handle dark mode */
   .theme-night .quizletpluspluspopup {
	background:rgba(255,255,255,0.5);
	color:white;
   }
</style>
  `;

// wait until .StudyModesLayout is loaded
// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists

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

waitForElm('.StudyModesLayout').then(elm => {
	var referenceNode = document.querySelector('.StudyModesLayout');
	
	// Insert the new node before the reference node
	referenceNode.after(newNode); // sometimes fails.

	//it aint over until the phat console sings
	console.log("element added");
});