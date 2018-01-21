//var SDK = require('../../node_modules/microsoft-speech-browser-sdk/distrib/Speech.Browser.Sdk.js');

//var SDK = document.getElementById("webSDK").dataset.config;
arrayOfSentences = ["She sells seashells by the seashore",
					"Peter Piper picked a peck of pickled peppers",
                    "I saw Susie sitting in a shoe shine shop",
                    "Robert ran rings around the Roman ruins"];
curSpot = 0;
var input;
var message = document.getElementById("message");
var confidence;
var userSentence;
correctSentence = arrayOfSentences[curSpot].toLowerCase().split(" ");

document.addEventListener('DOMContentLoaded', function() {
    var phraseDiv = document.getElementById("phraseDiv");
    phraseDiv.innerHTML = arrayOfSentences[0];
});
function RecognizerSetup(SDK, recognitionMode, language, format, subscriptionKey) {
    let recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation)
        language, // Supported languages are specific to each recognition mode Refer to docs.
        format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)
    //subscriptionKey = "2d33987232b64c12a8e67724386579c7";
    // Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
    let authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

    return SDK.CreateRecognizer(recognizerConfig, authentication);
}

function RecognizerStart(SDK, recognizer) {

    recognizer.Recognize((event) => {
        /*
            Alternative syntax for typescript devs.
            if (event instanceof SDK.RecognitionTriggeredEvent)
        */
        switch (event.Name) {
            case "RecognitionTriggeredEvent" :
                UpdateStatus("Initializing");
                break;
            case "ListeningStartedEvent" :
                UpdateStatus("Listening");
                break;
            case "RecognitionStartedEvent" :
                UpdateStatus("Listening_Recognizing");
                break;
            case "SpeechStartDetectedEvent" :
                UpdateStatus("Listening_DetectedSpeech_Recognizing");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechHypothesisEvent" :
                UpdateRecognizedHypothesis(event.Result.Text);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechFragmentEvent" :
                UpdateRecognizedHypothesis(event.Result.Text);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechEndDetectedEvent" :
                OnSpeechEndDetected();
                UpdateStatus("Processing_Adding_Final_Touches");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechSimplePhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "SpeechDetailedPhraseEvent" :

                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));

				if (input){
                    if (input.valueOf() == arrayOfSentences[curSpot].toLowerCase().valueOf()) {
                        if(confidence < .85) {

                            message.innerHTML = "Try saying it clearer!";
                        } else {
                            curLine();
                        }

                    }
                    else {
                        console.log(input);
                        console.log(arrayOfSentences[curSpot].toLowerCase());
                       
			userSentence = input.split(" ");
			
			correctSentence = arrayOfSentences[curSpot].toLowerCase().split(" ");
			
			console.log(correctSentence.length);
			console.log(userSentence.length);
			if(correctSentence.length == userSentence.length){
				
				compareLines(correctSentence, userSentence);
			}
			else{
				message.innerHTML = "Let's try that again!";
			}
					   
					   
                    }
                }
                break;
            case "RecognitionEndedEvent" :
                OnComplete();
                UpdateStatus("Idle");
                console.log(JSON.stringify(event)); // Debug information
                break;
        }
    })
    .On(() => {
        // The request succeeded. Nothing to do here.
    },
    (error) => {
        console.error(error);
    });
}

function RecognizerStop(SDK, recognizer) {
    // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
    recognizer.AudioSource.TurnOff();
}
var webRecognizer;
function startSpeech() {
    input = null;
    message.innerHTML = "";

    Setup();

    RecognizerStart(SDK, webRecognizer);
}
function stopSpeech() {
    RecognizerStop(SDK, webRecognizer);
}
function Setup() {
    if (webRecognizer != null) {
        RecognizerStop(SDK, webRecognizer);
    }

    webRecognizer = RecognizerSetup(SDK, "Conversation", "en-US", "Detailed", "2d33987232b64c12a8e67724386579c7");

}
function UpdateStatus(status) {

}
function OnSpeechEndDetected() {
            //stopBtn.disabled = true;
}
 function UpdateRecognizedHypothesis(text, append) {

}


function UpdateRecognizedPhrase(json) {
    //var phraseDiv = document.getElementById("phraseDiv");
    //hypothesisDiv.innerHTML = "";
    var obj = JSON.parse(json);
	//RecognitionStatus

	if (obj.RecognitionStatus){
		if (obj.RecognitionStatus.valueOf() == ("Success").valueOf()) {
            console.log(obj.NBest[0].Confidence);
            confidence = obj.NBest[0].Confidence;

			input = obj.NBest[0].Lexical;
		 }
		else{

			message.innerHTML = "Let's try that again!";


		}
	}

    //phraseDiv.innerHTML += json + " " + obj.RecognitionStatus + "\n";
	//phraseDiv.innerHTML += json + "\n";
}

function compareLines(a, b){
	console.log("in compare");
	console.log(a);
	console.log(b);
	var temp = [];
	count = 0;
	for(i = 0; i < a.length; i++){
		if(a[i].valueOf() != b[i].valueOf()){
			temp[count] = a[i];
			count++;
		}
	}
	
	message.innerHTML = "Let's try that again!" + "\n\n" + "Pronounce this clearer:  " + temp;
	//message.innerHTML += ;
}

function curLine(){
	curSpot++;

	if(arrayOfSentences.length == curSpot){
		phraseDiv.innerHTML = "The End!";
	}
	else{
		phraseDiv.innerHTML = arrayOfSentences[curSpot];
		//correctSentence = arrayOfSentences[curSpot].toLowerCase().split(" ");
	}
}
