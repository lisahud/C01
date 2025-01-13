const jsPsych = initJsPsych({
	//on_finish: function (data) {
		//jsPsych.data.displayData('csv');
		//proliferate.submit({"trials": data.values()});
	//},
	show_progress_bar: true, // doesn't automatically work with nested timelines and timeline variables
	auto_update_progress_bar: false
});

let timeline = [];

var preload = {
    type: jsPsychPreload,
    auto_preload: true
}

timeline.push(preload);

//------------------------------------------------------------------------------
// PAGE 1: LANDING PAGE
var irb = {
  type: jsPsychSurveyMultiSelect,
  preamble: `<p>Liebe*r Teilnehmer*in, vielen Dank für Ihr Interesse an unserer Studie.</p><p>Dieses Experiment sollte nicht länger 
			als 10 Minuten dauern. Die Datenerhebung erfolgt anonym.<br>Weitere Informationen zu dieser Forschung und Ihren Rechten als Teilnehmer*in finden Sie 
			<a href="Information_für_Teilnehmende.pdf" target="_blank" rel="noopener noreferrer">hier</a>.</p>`,
  questions: [
    {
      prompt: "", 
      options: ["Ich habe die Teilnahmeinformationen gelesen und willige in die Studienteilnahme und die damit verbundene Verarbeitung meiner Daten ein."], 
	  horizontal: true,
      required: true,
    }
  ],
  required_message: "Um teilzunehmen, müssen Sie das Häkchen zur Bestätigung Ihrer Einwilligung setzen."
};

timeline.push(irb);

//------------------------------------------------------------------------------
// PAGE 2: NARRATIVE SCENARIO
var scenario = {
	type: jsPsychHtmlButtonResponse,
	stimulus: `<p>Stellen Sie sich nun vor, dass Sie letzte Nacht einen langen Traum hatten. Sie erinnern sich noch gut an alles, was Sie in Ihrem Traum erlebt und gesehen haben. Offensichtlich waren Sie in einer fremden Welt unterwegs, in der es allerlei Lebewesen, Gegenstände, Pflanzen, Möbelstücke, Obst und Gemüse gab, die Sie so aus unserer Welt nicht kannten. Aufgeregt erzählen Sie einer befreundeten Person von Ihren Traumerlebnissen und erfinden dazu Wörter für all die unbekannten Dinge. Sie möchten, dass Ihr*e Freund*in sich alles gut vorstellen kann und versuchen deshalb ein möglichst treffendes Wort zu finden. 
</p><p>Mit Klick auf „Weiter“ gelangen Sie zur genauen Erklärung Ihrer Aufgabe.</p><p></p><br>`,
    choices: ['Weiter']
};

timeline.push(scenario);


// PAGE 3a: INSTRUCTIONS
var trial_a = {
	type: jsPsychSurveyText,
	preamble: `<p>Im Folgenden werden Ihnen zwei Wörter gezeigt, aus denen sich eine Ihrer Traumerscheinungen zusammensetzte. Stellen Sie sich diese Traumerscheinung so gut es geht vor und <b>erfinden Sie ein neues Wort</b>, das sie benennt. Erfinden Sie also ein neues Wort, das es so in dieser Form noch nicht gibt. Bitte beziehen Sie dabei die Eigenschaften beider Wörter gleichermaßen mit ein und geben Sie ein einziges Wort an. Schreiben Sie dieses Wort <b>inklusive Artikel (der, die, das)</b> in die Textbox.</p><p>Es wird mehrere Durchgänge geben, sodass Sie nacheinander mehrere Wörter erfinden werden.</p><p>Ein Durchgang kann beispielsweise so aussehen:</p><br/><p><b>MAUS</b><br/><b>ERDBEERE</b></p>`,
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
			jsPsych.setProgressBar((nameCounter) / (test_stimuli.length + images.length));
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
	preamble: `<p>In manchen Durchgängen sehen Sie ein Bild zu Ihrem erfundenen Wort, sobald Sie den Namen angegeben und auf „Weiter“ geklickt haben. Sie werden dann gefragt, ob es Ihrem eigenen Bild entspricht, das Sie im Kopf hatten. Bitte entscheiden Sie sich für „Ja“ oder „Nein“ und fahren dann mit dem nächsten Durchgang fort.</p><p>Hier ein Beispiel:</p><br/>
	<img src="distractors/Maus_Erdbeere.png" style="height:400px"></img>`,
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
	stimulus: '<p>Alles verstanden? Dann geht es mit Klick auf "Weiter" los.</p>',
	choices: ["Weiter"]	
};

timeline.push(instructions_c);


//------------------------------------------------------------------------------
// PAGES 4-66: EXPERIMENT
var test_stimuli = create_Arrays()[0];
var images = create_Arrays()[1];


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
					name: 'Dis_pic',
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
				let noDeterminer = lastResponse.replace(det,'');
				Dis_responses.push(noDeterminer)
			}
			
			return repeat_loop;
			},
			
		on_start: function() { //we use on_start instead of on_finish to allow nameCounter to update
			jsPsych.setProgressBar((nameCounter) / (test_stimuli.length + images.length));
		}
	}
	],
	timeline_variables: test_stimuli,
	randomize_order: false,
	repetitions: 1
};
timeline.push(trials);

// PAGE 67: INSTRUCTIONS
var instructions_d = {
	type: jsPsychHtmlButtonResponse,
	//preamble: `<p>Alles verstanden? Dann geht es mit Klick auf "Weiter" los"</p>`,
	stimulus: '<p>Als nächstes sehen Sie noch einmal alle Bilder, die Ihnen während des Experiments gezeigt wurden. Bitte denken Sie daran, wie Sie sich das jeweilige Traumobjekt vorgestellt haben, als Sie die Wörter zum ersten Mal gesehen haben. Beschreiben Sie, ob und was Sie am Bild ändern würden, damit es noch besser zu dem passt, was Sie sich vorgestellt haben.</p>',
	choices: ["Weiter"]	
};

timeline.push(instructions_d);

//------------------------------------------------------------------------------
// PAGES 68-76: PICTURE RATING

var position = 0

var pic_rating = {
    type: jsPsychSurveyText,

	on_start: function() { //we use on_start instead of on_finish to allow nameCounter to update
		jsPsych.setProgressBar((nameCounter) / (test_stimuli.length + images.length));
		nameCounter++;
	},

    preamble: jsPsych.timelineVariable('Img'),
    questions: [
        {
            prompt: function() {
                prompt_text = `<p>Was würden Sie an diesem Bild ändern, damit es besser zu dem passt, was Sie sich unter "${Dis_responses[position]}" vorgestellt haben, als Sie die Wörter zum ersten Mal gesehen haben?</p><br>`;
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
const debriefing = {
	type: jsPsychSurvey,
	
	on_start: function() {
		jsPsych.setProgressBar((nameCounter) / (test_stimuli.length + images.length));
	},
	
	pages: [
		[
			{
				type: 'html',
				prompt: 'Das ist das Ende des Experiments. Um uns bei der Analyse der Ergebnisse zu helfen, beantworten Sie bitte die folgenden Fragen.'
			},
			{
				type: 'drop-down',
				prompt: 'Geschlecht',
				name: 'gender',
				options: ['Weiblich','Männlich','Divers']
			},
			{
				type: 'text',
				prompt: 'Alter',
				name: 'age',
				textbox_columns: 10
			},
			{
				type: 'text',
				prompt: 'Muttersprache(n)',
				name: 'first_language',
				textbox_columns: 20
			},
			
			{
				type: 'text',
				prompt: 'Welche Ihrer genannten Sprachen, inklusive Ihrer Muttersprache(n), sprechen Sie täglich am meisten?',
				name: 'daily_language',
				textbox_columns: 20
			},
			{
				type: 'drop-down',
				prompt: 'Höchster Bildungsabschluss',
				name: 'gender',
				options: ['noch Schüler','Schule beendet ohne Abschluss','Hauptschulabschluss/ Volksschulabschluss','Realschulabschluss (Mittlere Reife)','Fachhochschulreife (Abschluss einer Fachoberschule)','Abitur, allgemeine oder fachgebundene Hochschulreife (Gymnasium bzw. EOS)','abgeschlossene Berufsausbildung','Meisterprüfung','Bachelor','Master','Promotion']
			},
			{
				type: 'multi-choice',
				prompt: 'Haben Sie die Anweisungen gelesen und glauben Sie, dass Sie die Studie richtig durchgeführt haben?',
				name: 'read',
				options: ['Nein','Ja','Ich war verwirrt']
			},
			{
				type: 'text',
				prompt: 'Haben Sie irgendwelche Anmerkungen, z. B. zum Experimentablauf, zu der Art und Weise, wie Sie die Wörter erfunden haben, zu den Bildern oder zu etwas anderem? Wir freuen uns über jede Rückmeldung.',
				name: 'comments',
				textbox_columns: 30,
				textbox_rows: 3
			},
			{
				type: 'html',
				prompt: "Bei Fragen wenden Sie sich bitte an Alon Fishman unter alon.fishman@uni-bielefeld.de."
			}
		]
	]
};

timeline.push(debriefing);

jsPsych.run(timeline)
