const jsPsych = initJsPsych({
	on_finish: function (data) {
		//jsPsych.data.displayData('csv');
		proliferate.submit({"trials": data.values()});
	},
	show_progress_bar: true, // doesn't automatically work with nested timelines and timeline variables
	auto_update_progress_bar: false,
	message_progress_bar: 'Bearbeitungsfortschritt'
});

let timeline = [];

var test_stimuli = create_Arrays()[0];
var images = create_Arrays()[1];

var preload = {
    type: jsPsychPreload,
    auto_preload: true
}
timeline.push(preload);

var image_paths = [
	"distractors/Erdbeermaus.JPG",
	"distractors/Sessel_Regal.png",
	"distractors/Tulpe_Zebra.jpg",
	"distractors/Spargel_Qualle.png",
	"distractors/Rose_Lampe_2.png",
	"distractors/Kamel_Tiger.png",
	"distractors/Pizza_Hocker.jpeg",
	"distractors/Robbe_Mango_2.png",
	"distractors/Pinsel_Gabel_2.png",
	"distractors/Gespenst_Zebra.png"
]
var preload_img = {
    type: jsPsychPreload,
    images: image_paths,
}

timeline.push(preload_img);
//------------------------------------------------------------------------------
// PAGE 1: LANDING PAGE
var irb = {
  type: jsPsychSurveyMultiSelect,
  preamble: `<p>Liebe*r Teilnehmer*in, vielen Dank für Ihr Interesse an unserer Studie.</p><p>Dieses Experiment dauert etwa 45 Minuten. Die Datenerhebung erfolgt anonym.<br>Weitere Informationen zu dieser Studie und Ihren Rechten als Teilnehmer*in finden Sie 
			<a href="Information_für_Teilnehmende.pdf" target="_blank" rel="noopener noreferrer">hier</a>.</p>`,
  questions: [
    {
      prompt: "", 
      options: ["Ich habe die Teilnahmeinformationen gelesen und willige in die Studienteilnahme und die damit verbundene Verarbeitung meiner Daten ein."], 
	  horizontal: true,
      required: true,
    }
  ],
  required_message: "Um teilzunehmen, müssen Sie das Häkchen zur Bestätigung Ihrer Einwilligung setzen.",
  button_label: ['Weiter']
};

timeline.push(irb);

//------------------------------------------------------------------------------
// PAGE 2: NARRATIVE SCENARIO
var scenario = {
	type: jsPsychHtmlButtonResponse,
	stimulus: `<p>Stellen Sie sich nun vor, dass Sie letzte Nacht einen langen Traum hatten. Sie erinnern sich noch gut an alles, was Sie in Ihrem Traum erlebt und gesehen haben. Offensichtlich waren Sie in einer fremden Welt unterwegs, in der es allerlei Lebewesen, Gegenstände, Pflanzen, Möbelstücke, Obst und Gemüse gab, die Sie so aus unserer Welt nicht kannten. Aufgeregt erzählen Sie einer befreundeten Person von Ihren Traumerlebnissen und erfinden dazu Wörter für all die unbekannten Dinge. Sie möchten, dass Ihr*e Freund*in sich alles gut vorstellen kann und versuchen deshalb ein möglichst treffendes Wort zu erfinden. 
</p><p>Mit Klick auf „Weiter“ gelangen Sie zur genauen Erklärung Ihrer Aufgabe.</p><p></p><br>`,
    choices: ['Weiter'],
	data: {
		list: selectedListName
	}
};

timeline.push(scenario);


// PAGE 3a: INSTRUCTIONS
var trial_a = {
	type: jsPsychSurveyText,
	preamble: `<p>Im Folgenden werden Ihnen zwei Wörter für Dinge gezeigt, aus denen sich eine Ihrer Traumerscheinungen zusammensetzte. Stellen Sie sich diese Traumerscheinung so gut es geht vor und <b>erfinden Sie ein neues Wort</b>, das diese benennt. Erfinden Sie also ein neues Wort, das es so in dieser Form noch nicht gibt, und beziehen Sie dabei bitte die <b>beiden Teile der Traumerscheinung gleichermaßen</b> mit ein. Es gibt kein Richtig oder Falsch. Schreiben Sie dieses Wort <b><nobr>mit Artikel (der, die, das)</nobr></b> in die Textbox, zum Beispiel „die Haustür“.</p><p>Es wird mehrere Durchgänge geben, sodass Sie nacheinander mehrere Wörter erfinden werden.</p><p>Ein Durchgang kann beispielsweise so aussehen:</p><br/><p><b>MAUS</b><br/><b>ERDBEERE</b></p>`,
	questions: [
		{prompt: '<i>Bitte tragen Sie ein Wort ein</i>', required: true, rows: 1, columns: 20}
	],
	button_label: "Weiter",
	/*
	on_finish: function(data) {
		var response_a = data.response;
	}*/
};

var instructions_a = {
	timeline: [
	{
		timeline: [
			trial_a,
			repeat_conditional,		
		],
		
		loop_function: function() {
			var lastResponse = jsPsych.data.get().last(1).values()[0].response.Q0;
			
			if(lastResponse!=undefined) {
				const det = /^(der|die|das|ein|eine)\s+/i;
				let noDeterminer = lastResponse.replace(det,'');
				jsPsych.data.addDataToLastTrial({instructionResponse: noDeterminer});
			}
			

			return repeat_loop;
			},
			
		on_start: function() { //we use on_start instead of on_finish to allow nameCounter to update
			jsPsych.setProgressBar((nameCounter) / (test_stimuli.length + images.length + 2));
		}
	}
	],
	randomize_order: false,
	repetitions: 1
};

timeline.push(instructions_a);


// PAGE 3b: INSTRUCTIONS
var instructions_b = {
	type: jsPsychSurveyMultiChoice,
	preamble: `<p>In manchen Durchgängen sehen Sie ein Bild zu Ihrem erfundenen Wort, sobald Sie es eingegeben und auf „Weiter“ geklickt haben. Sie werden dann gefragt, ob es dem Bild entspricht, das Sie im Kopf hatten. Bitte entscheiden Sie sich für „Ja“ oder „Nein“ und fahren dann mit dem nächsten Durchgang fort.</p><p>Hier ein Beispiel:</p><br/>
	<img src="distractors/Erdbeermaus.JPG" style="height:400px"></img>`,
	questions: [
		{
			prompt: function() {
                // Retrieve instructionResponse from jsPsych data
                var instructionResponse = jsPsych.data.get().last(1).values()[0].instructionResponse;
                return `<i>Entspricht obiges Bild dem Bild, das Sie für "${instructionResponse}" im Kopf hatten?</i>`;
            },
			name: 'Dis_pic_instruction',
			options: ['Ja', 'Nein'],
			required: true,
			horizontal: false
		}, 
		],
	button_label: "Weiter",	
};

timeline.push(instructions_b);

// PAGE 3c: INSTRUCTIONS
var instructions_c = {
	type: jsPsychHtmlButtonResponse,
	//preamble: `<p>Alles verstanden? Dann geht es mit Klick auf "Weiter" los"</p>`,
	stimulus: '<p><i>Alles verstanden? Dann geht es mit Klick auf „Weiter“ los.</i></p><ul style="list-style:none; text-align:left"><li>Bitte denken Sie daran,</li></ul><ul style="text-align:left"><li>ein <b>einziges</b> neues Wort mit <nobr><b>Artikel</b> (der, die, das)</nobr> einzugeben,</li><li><b>beide</b> Teile der Traumerscheinung gleichermaßen einzubeziehen und</li><li>ein möglichst <b>treffendes</b> Wort zu erfinden, sodass sich Ihr*e Freund*in die Traumerscheinung gut vorstellen kann.</li></ul><br/>',
	choices: ["Weiter"]	
};

timeline.push(instructions_c);


//------------------------------------------------------------------------------


// PAGES 4-66: EXPERIMENT
var trial = {
	type: jsPsych.timelineVariable('Type'),
	preamble: function(){
		if(jsPsych.timelineVariable('Type')==jsPsychSurveyMultiChoice){
			var stim = jsPsych.timelineVariable('Img')
		} else {
			var stim = '<b>'+jsPsych.timelineVariable('Word1')+'</b><br/><b>'+jsPsych.timelineVariable('Word2')+'</b>';
		}
		return stim;
	},
	questions: function(){
		if(jsPsych.timelineVariable('Type')==jsPsychSurveyText){
			var quest = [
				{prompt: '<i>Benennen Sie die Traumerscheinung</i>', required: true, rows: 1, columns: 20}
			];
		} else {
			var quest = [
				{
					prompt: `<i>Entspricht obiges Bild dem Bild, das Sie für "${Dis_responses[Dis_responses.length - 1]}" im Kopf hatten?</i>`,
					name: 'Q0',
					options: ['Ja', 'Nein'],
					required: true,
					horizontal: false
				}, 
				];
		}
		return quest;
	},
	button_label: "Weiter",

	data: {
		Task: 'Trial',
		Condition: jsPsych.timelineVariable('Cat_comb_type'),
		Trial_no: jsPsych.timelineVariable('Trial_no'),
		Trial_cat: jsPsych.timelineVariable('Trial_cat'),
		Word1: jsPsych.timelineVariable('Word1'),
		Word2: jsPsych.timelineVariable('Word2'),
		Gender_comb: jsPsych.timelineVariable('Gender_comb'),
		Cat_comb: jsPsych.timelineVariable('Cat_comb'),
		Pair_no1: jsPsych.timelineVariable('Pair_no1'),
		Pair_no2: jsPsych.timelineVariable('Pair_no2')
	},
};

var Dis_responses = [];

// using jsPsych's nested timelines & loop_function to do 2 things: display a trial, then (conditionally) display a repeat_message & loop back
var trials = {
	timeline: [
	{
		timeline: [
			trial,
			repeat_conditional,		
		],
		
		loop_function: function() {
			var lastResponse = jsPsych.data.get().last(1).values()[0].response.Q0;
			
			var phase = jsPsych.data.get().last(1).values()[0].Trial_cat;

			if(lastResponse!=undefined && phase==='Dis') {
				const det = /^(der|die|das|ein|eine)\s+/i;
				//const det = /^(d.{1,4}|ein|eine)\s+/i;
				let noDeterminer = lastResponse.replace(det,'');
				Dis_responses.push(noDeterminer)
			}
			
			return repeat_loop;
			},
			
		on_start: function() { //we use on_start instead of on_finish to allow nameCounter to update
			jsPsych.setProgressBar((nameCounter) / (test_stimuli.length + images.length + 2));
		}
	}
	],
	timeline_variables: test_stimuli,
	randomize_order: false,
	repetitions: 1
};
timeline.push(trials);

// PAGE 67: PICTURE INSTRUCTIONS
var instructions_d = {
	type: jsPsychHtmlButtonResponse,
	//preamble: `<p>Alles verstanden? Dann geht es mit Klick auf "Weiter" los"</p>`,
	stimulus: '<p>Als nächstes sehen Sie noch einmal alle Bilder, die Ihnen während des Experiments gezeigt wurden. Bitte erinnern Sie sich daran, wie Sie sich Ihre Traumerscheinung vorgestellt haben, als Sie die Wörter zum ersten Mal gesehen haben. Beschreiben Sie, ob und was Sie am Bild ändern würden, damit es noch besser zu dem passt, was Sie sich vorgestellt haben.</p><br/>',
	choices: ["Weiter"],
	on_start: function() {
		jsPsych.setProgressBar((nameCounter) / (test_stimuli.length + images.length + 2));	
	}
};

timeline.push(instructions_d);

//------------------------------------------------------------------------------
// PAGES 68-76: PICTURE RATING

var position = 0

var pic_rating = {
    type: jsPsychSurveyText,

	on_start: function() { //we use on_start instead of on_finish to allow nameCounter to update
		jsPsych.setProgressBar((nameCounter) / (test_stimuli.length + images.length + 2));
		nameCounter++;
	},

    preamble: jsPsych.timelineVariable('Img'),
    questions: [
        {
            prompt: function() {
                prompt_text = `<p>Was würden Sie an diesem Bild ändern, damit es besser zu dem passt, was Sie sich unter „${Dis_responses[position]}“ vorgestellt haben?</p><br>`;
				position = position+1;
				return prompt_text
			},
            required: true,
            rows: 6,
            columns: 60
        }
    ],
    button_label: "Weiter",
    data: {
		Task: 'Pic_rating',
		Condition: jsPsych.timelineVariable('Cat_comb_type'),
		Trial_no: jsPsych.timelineVariable('Trial_no'),
		Trial_cat: jsPsych.timelineVariable('Trial_cat'),
		Word1: jsPsych.timelineVariable('Word1'),
		Word2: jsPsych.timelineVariable('Word2'),
		Gender_comb: jsPsych.timelineVariable('Gender_comb'),
		Cat_comb: jsPsych.timelineVariable('Cat_comb'),
	},
};

var pic_trials = {
	timeline: [
		pic_rating
	],
	timeline_variables: images
}

timeline.push(pic_trials);

//------------------------------------------------------------------------------

// PAGE 77: DEBRIEFING
  
var debriefing = {
	type: jsPsychSurvey,
	survey_json: {
		elements: [
			{
				type: 'html',
				name: 'html1',
				html: '<p>Das ist das Ende des Experiments. Um uns bei der Analyse der Ergebnisse zu helfen, beantworten Sie bitte die folgenden Fragen.</p>'
			},
			{
				type: 'dropdown',
				title: 'Geschlecht',
				name: 'gender',
				choices: ['Weiblich','Männlich','Divers','keine Angabe'],
				isRequired: true,
				placeholder: "Auswählen...",
				searchEnabled: false,
			},
			{
				type: 'text',
				title: 'Alter',
				name: 'age',
				isRequired: true,
				validators: [
					{ type: "numeric", text: "Wert muss eine Zahl sein" }
				]
			},
			{
				type: 'text',
				title: 'Muttersprache(n)',
				name: 'first_language',
				isRequired: true,
			},
			{
				type: "paneldynamic",
				name: "other_languages",
				witdth: "100%",
				//minWidth: "256px",
				title: "Weitere Sprachen und geschätztes Niveau",
				//titleLocation: "hidden",
				templateElements: [
					{
						name: "other_language",
						type: "text",
						title: "Sprache",
						//width: '50%',
						maxWidth: "50%",
					},
					{
						name: "language_proficiency",
						type: "dropdown",
						title: "Niveau",
						//inputType: "email",
						//"placeholder": "foobar@example.com",
						placeholder: "Auswählen...",
						width: '50%',
						maxWidth: "50%",
						startWithNewLine: false,
						choices: ['Grundlagen','Fortgeschritten','Fließend'],
						searchEnabled: false,
					}
				],
				panelCount: 1,
				minPanelCount: 1,
				//confirmDeleteText: "Do you want to delete the passenger?",
				panelAddText: "Zeile hinzufügen",
				panelRemoveText: "Entfernen",
			},
			{
				type: 'text',
				title: 'Welche Ihrer genannten Sprachen, inklusive Ihrer Muttersprache(n), sprechen Sie täglich am meisten?',
				name: 'daily_language',
				isRequired: true,
			},
			{
				type: 'dropdown',
				title: 'Höchster Bildungsabschluss',
				name: 'educational_background',
				choices: ['noch Schüler','Schule beendet ohne Abschluss','Hauptschulabschluss/Volksschulabschluss','Realschulabschluss (Mittlere Reife)','Fachhochschulreife (Abschluss einer Fachoberschule)','Abitur, allgemeine oder fachgebundene Hochschulreife','abgeschlossene Berufsausbildung','Meisterprüfung','Bachelor','Master','Promotion'],
				isRequired: true,
				placeholder: "Auswählen...",
				searchEnabled: false,
			},
			{
				type: 'text',
				title: 'Wie klar fanden Sie die Anweisungen zu Beginn?',
				name: 'clarity_of_instructions',
				isRequired: true,
			},
			{
				type: 'radiogroup',
				title: 'Was glauben Sie, wie leicht es Ihrer befreundeten Person fallen würde, sich anhand Ihrer Wörter die Traumerscheinungen vorzustellen?',
				choices: [
					{
						'value': 'very_easy', // A unique value to be saved in the survey results.
						'text': 'sehr leicht' // A display text. When `text` is undefined, `value` is used as display text.
					},
					{
						'value': 'rather_easy', // A unique value to be saved in the survey results.
						'text': 'eher leicht' // A display text. When `text` is undefined, `value` is used as display text.
					},
					{
						'value': 'rather_difficult', // A unique value to be saved in the survey results.
						'text': 'eher schwer' // A display text. When `text` is undefined, `value` is used as display text.
					},
					{
						'value': 'very_difficult', // A unique value to be saved in the survey results.
						'text': 'sehr schwer' // A display text. When `text` is undefined, `value` is used as display text.
					}
				],
				name: 'imaginability',
				isRequired: true
			},
			{
				type: 'text',
				title: 'Erinnern Sie sich an eine Ihrer Antworten, auf die Sie besonders stolz sind?',
				name: 'nicest_answer',
				isRequired: true
			},
			{
				type: 'comment',
				title: 'Sind Sie einer bestimmten Strategie beim Erfinden der Wörter gefolgt? Wenn ja, welche?',
				name: 'strategy',
				rows: 4,
				isRequired: true
			},
			{
				type: 'comment',
				title: 'Haben Sie Anmerkungen, z. B. zum Experimentablauf, zu den Bildern oder zu etwas anderem? Wir freuen uns über jede Rückmeldung.',
				name: 'comments',
				rows: 4
			},
			{
				type: 'html',
				name: 'html2',
				html: '<p>Bei Fragen wenden Sie sich bitte an Jana Häussler unter <a href="mailto:jana.haeussler@uni-bielefeld.de">jana.haeussler@uni-bielefeld.de</a>.</p>'
			}
		],
		showQuestionNumbers: false,
		completeText: "Weiter",
		//fitToContainer: true
	},
	data: {
		Task: 'Survey'
	},
	on_start: function() {
		jsPsych.setProgressBar((nameCounter) / (test_stimuli.length + images.length + 2));	
	},
};

timeline.push(debriefing);

//------------------------------------------------------------------------------

// PAGE 78: THANK YOU NOTE

var outro = {
	type: jsPsychHtmlButtonResponse,
	stimulus: "<p>Das Experiment ist nun zu Ende. Bitte klicken Sie auf „Weiter“, um Ihre Antworten zu speichern und zurück zu Prolific zu gelangen.</p><p>Vielen herzlichen Dank für Ihre Teilnahme!</p><br/>",
	choices: ["Weiter"],
	on_start: function() {
		jsPsych.setProgressBar(1);	
	},
};

timeline.push(outro);

jsPsych.run(timeline)



