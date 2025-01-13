var items  = [
	{ Trial_no: 'X1', Trial_cat: 'Pra', Cat_comb_type: 'between', Word1: 'Gans', Word2: 'Löwe', Gender_comb: '', Cat_comb: '', Type: jsPsychSurveyText },
	{ Trial_no: 'X2', Trial_cat: 'Pra', Cat_comb_type: 'between', Word1: 'Flamingo', Word2: 'Schnur', Gender_comb: '', Cat_comb: '', Type: jsPsychSurveyText },
	{ Trial_no: 'X3', Trial_cat: 'Pra', Cat_comb_type: 'between', Word1: 'Ingwer', Word2: 'Giraffe', Gender_comb: '', Cat_comb: '', Type: jsPsychSurveyText },
	{ Trial_no: 'X4', Trial_cat: 'Dis', Cat_comb_type: 'within', Word1: 'Sessel', Word2: 'Regal', Gender_comb: '', Cat_comb: '', Type: jsPsychSurveyText },
	{ Trial_no: 'X5', Trial_cat: 'Pra', Cat_comb_type: 'between', Word1: 'Pflaume', Word2: 'Trichter', Gender_comb: '', Cat_comb: '', Type: jsPsychSurveyText },
	{ Trial_no: '48', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Taube', Word2: 'Igel', Gender_comb: '12', Cat_comb: '13', Type: jsPsychSurveyText },
	{ Trial_no: '42', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Adler', Word2: 'Ziege', Gender_comb: '21', Cat_comb: '13', Type: jsPsychSurveyText },
	{ Trial_no: '12', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Kirsche', Word2: 'Harke', Gender_comb: '11', Cat_comb: '24', Type: jsPsychSurveyText },
	{ Trial_no: '4', Trial_cat: 'Dis', Cat_comb_type: 'between', Word1: 'Zebra', Word2: 'Tulpe', Gender_comb: '', Cat_comb: '', Type: jsPsychSurveyText },
	{ Trial_no: '35', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Spaten', Word2: 'Rabe', Gender_comb: '22', Cat_comb: '41', Type: jsPsychSurveyText },
	{ Trial_no: '1', Trial_cat: 'Exp', Cat_comb_type: 'within', Word1: 'Apfel', Word2: 'Kürbis', Gender_comb: '22', Cat_comb: '22', Type: jsPsychSurveyText },
	{ Trial_no: '17', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Zwiebel', Word2: 'Harke', Gender_comb: '11', Cat_comb: '24', Type: jsPsychSurveyText },
	{ Trial_no: '15', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Kürbis', Word2: 'Spaten', Gender_comb: '22', Cat_comb: '24', Type: jsPsychSurveyText },
	{ Trial_no: '18', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Apfel', Word2: 'Ente', Gender_comb: '21', Cat_comb: '21', Type: jsPsychSurveyText },
	{ Trial_no: '13', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Kürbis', Word2: 'Schere', Gender_comb: '21', Cat_comb: '24', Type: jsPsychSurveyText },
	{ Trial_no: '11', Trial_cat: 'Dis', Cat_comb_type: 'between', Word1: 'Spargel', Word2: 'Qualle', Gender_comb: '', Cat_comb: '', Type: jsPsychSurveyText },
	{ Trial_no: '3', Trial_cat: 'Exp', Cat_comb_type: 'within', Word1: 'Besen', Word2: 'Schere', Gender_comb: '21', Cat_comb: '44', Type: jsPsychSurveyText },
	{ Trial_no: '20', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Kürbis', Word2: 'Rabe', Gender_comb: '22', Cat_comb: '21', Type: jsPsychSurveyText },
	{ Trial_no: '44', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Adler', Word2: 'Hase', Gender_comb: '22', Cat_comb: '13', Type: jsPsychSurveyText },
	{ Trial_no: '41', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Schere', Word2: 'Ziege', Gender_comb: '11', Cat_comb: '43', Type: jsPsychSurveyText },
	{ Trial_no: '16', Trial_cat: 'Dis', Cat_comb_type: 'between', Word1: 'Rose', Word2: 'Lampe', Gender_comb: '', Cat_comb: '', Type: jsPsychSurveyText },
	{ Trial_no: '24', Trial_cat: 'Exp', Cat_comb_type: 'between', Word1: 'Zwiebel', Word2: 'Igel', Gender_comb: '12', Cat_comb: '23', Type: jsPsychSurveyText },
	{ Trial_no: '6', Trial_cat: 'Exp', Cat_comb_type: 'within', Word1: 'Adler', Word2: 'Rabe', Gender_comb: '22', Cat_comb: '11', Type: jsPsychSurveyText }	
];
//var items =  //INSERT_HERE

var images = [
	"Sessel_Regal.png",
	"Tulpe_Zebra.jpeg",
	"Spargel_Qualle.png",
	"Rose_Lampe_2.png",
	"Kamel_Tiger.png",
	"Pizza_Hocker.jpeg",
	"Robbe_Mango.png",
	"Pinsel_Gabel_2.png",
	"Gespenst_Zebra.png"
]


function create_Arrays() {
	let arr_img = [];
	let arr_combined = [];
	for (let i = 0; i < items.length; i++) {
		arr_combined.push(items[i]);
		if (items[i].Trial_cat==='Dis') {
			for (let j = 0; j < images.length; j++) {
				if (images[j].includes(items[i].Word1) && images[j].includes(items[i].Word2)) {
					let img_trial = { 
						Img: `<img src="distractors/${images[j]}" style="height:400px"></img>`,
						Trial_cat: 'Dis_pic', 
						Trial_no: items[i].Trial_no,  
						Cat_comb_type: items[i].Cat_comb_type, 
						Word1: items[i].Word1, 
						Word2: items[i].Word2, 
						Gender_comb: items[i].Gender_comb,
						Cat_comb: items[i].Cat_comb,
						Type: jsPsychSurveyMultiChoice,
					};
					arr_img.push(img_trial);
					arr_combined.push(img_trial);
				}
			}
		}
	}

	//return [arr_img,arr_combined];
	return [arr_combined,arr_img];
}

//---------------------------------------------------------------------------------------------------------

var nameCounter = 0; //counting completed trials for the progress bar

//checking that responses have no spaces/special characters and looping back if they do
var repeat_loop = false; //a "switch" variable for looping

var repeat_message = { //a full slide for telling participants they got it wrong
	type: jsPsychHtmlButtonResponse,
	stimulus: 'Bitte denken Sie daran, einen <b>Artikel</b> (der, die, das) zu verwenden und<br>das Objekt nur mit <b>genau einem Wort</b> zu benennen, ohne Leerzeichen oder Satzzeichen.<br/><br/>',
	choices: ['Zurück']
}; 

var specChars = /[0123456789`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/; //the characters we want to exclude (dash not included)

//using jsPsych's conditional_function to do 3 things: display the repeat_message slide, flip the repeat_loop switch, increment responses
var repeat_conditional = {
	timeline: [repeat_message],
	conditional_function: function() {
		var data = jsPsych.data.get().last(1).values()[0]; // Get the last trial data
		var lastResponse = data.response.Q0;
		var lastTrialType = data.trial_type;

		var isInvalidResponse = specChars.test(lastResponse) || /\s.*\s/.test(lastResponse) || /^(der|die|das|ein|eine)\s+/i.test(lastResponse) === false || /^(der|die|das|ein|eine)\s*$/i.test(lastResponse);
				
		if (isInvalidResponse && lastTrialType === 'survey-text') {
			repeat_loop = true;
			return true;
		} else {
			repeat_loop = false;
			nameCounter++;
			return false;
		}
	}
};


// page refresh
$(window).bind('beforeunload', function(e) {
	// TODO: adjust the right sentence
    return "Unloading this page may lose data. What do you want to do..."
    e.preventDefault();
});
