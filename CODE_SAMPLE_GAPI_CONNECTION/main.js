// this is a basic connection schema to the corresponding data for the table provided.
// this API KEY will expire after January 2022
// Written by GSoosalu & ndr3svt
const API_KEY = 'AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
let exerciseIndex;
let exerciseData;
let options;
let states = [];
let correct_answer_index;
let chosen_answer_index;
let totNumberOfQuestions;
let questions = [];
let currentOptions = [];
let currentSelectedResponse;
let currentCorrectResponse;
let questionsResult = [];
let currentQuestionIndex;


let gapiInitied = false;
let gisInited = false;
async function handleClientLoad() {
	await gapi.load('client', initClient);
	// Init our questions
	console.log("test")
}

async function initClient() {
	await gapi.client.init({
		apiKey: API_KEY,
		discoveryDocs: DISCOVERY_DOCS
	});
	gapiInitied = true;
	await getExerciseData();
}

async function getExerciseData() {

	let response;

	try {
		response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
			range: 'Learning!A1:F10',
		});
	} catch (err) {
		console.log('Error: ' + err);
	}
	questions = response.result.values.slice(1)
	totNumberOfQuestions = questions.length
	let questionIndex = Math.floor(Math.random() * questions.length)
	currentQuestionIndex = questionIndex
	let options = questions[questionIndex][3].split(";")
	let optionsContainer = document.querySelector('#options-wrapper')
	const questionTitle = document.getElementById('question')
	questionTitle.innerHTML = questions[questionIndex][2]
	currentOptions = options;
	currentCorrectResponse = questions[questionIndex][4];
	for (let i = 0; i < options.length; i++) {
		optionsContainer.innerHTML += `<div class='unchosen option' id='question${i}'><p class='text' onClick='toggleChoice(${i})'>` + options[i] + "</p></div>"
	}
	optionsContainer.innerHTML += "<br/>"

	let evaluateBtn = document.getElementById('evaluate')
	evaluateBtn.style.display = ''
}

function toggleChoice(index) {
	// Deselect all questions
	// Then select the current one
	for (let i = 0; i < currentOptions.length; i++) {
		let optionContainer = document.getElementById(`question${i}`);
		optionContainer.style.color = "#636363";
	}

	let optionContainer = document.getElementById(`question${index}`);
	optionContainer.style.color = "#5E5DF0";
	currentSelectedResponse = index;
}


function myEvaluation() {
	console.log('an evaluation function place holder')
	console.log(questions);
	let evMessage = document.querySelector('#evaluation-message')
	if (currentSelectedResponse == currentCorrectResponse) {
		evMessage.innerHTML = '<p>Awesome! Correct reply</p>'
		questionsResult.push(questions[currentQuestionIndex][5])

		let evaluateBtn = document.getElementById('evaluate')
		evaluateBtn.style.display = 'none'


		if (questionsResult.length == totNumberOfQuestions) {
			let resultBtn = document.getElementById('resultBtn')
			resultBtn.style.display = ''
		} else {
			let nextBtn = document.getElementById('next')
			nextBtn.style.display = ''
		}

		/*
		let background = document.getElementById('buttonsDiv')
		background.style.backgroundColor = '#00AB66'
		*/


	} else {
		evMessage.innerHTML = '<p>Wrong answer!</p>'
	}
}


function loadNextQuestion() {
	// remove current question from questions list
	questions.splice(currentQuestionIndex, 1)
	let questionIndex = Math.floor(Math.random() * questions.length);
	currentQuestionIndex = questionIndex;
	console.log("current quest: " + questionIndex + " quest length: " + questions.length)
	console.log(questions)
	let options = questions[questionIndex][3].split(";")
	let optionsContainer = document.querySelector('#options-wrapper')
	while (optionsContainer.lastElementChild) {
		optionsContainer.removeChild(optionsContainer.lastElementChild)
	}
	const questionTitle = document.getElementById('question')
	questionTitle.innerHTML = questions[questionIndex][2]
	currentOptions = options;
	currentCorrectResponse = questions[questionIndex][4];
	for (let i = 0; i < options.length; i++) {
		optionsContainer.innerHTML += `<div class='unchosen option' id='question${i}'><p class='text' onClick='toggleChoice(${i})'>` + options[i] + "</p></div>"
	}
	optionsContainer.innerHTML += "<br/>"

	let evaluateBtn = document.getElementById('evaluate')
	evaluateBtn.style.display = ''

	let nextBtn = document.getElementById('next')
	nextBtn.style.display = 'none'

	let evMessage = document.querySelector('#evaluation-message')
	evMessage.innerHTML = ""
}


function loadResults() {
	let totalScore = 0;
	questionsResult.map((currScore) => {
		totalScore += parseInt(currScore);
	})

	let optionsContainer = document.querySelector('#options-wrapper')
	optionsContainer.innerHTML = ""
	let evMessage = document.querySelector('#evaluation-message')
	evMessage.innerHTML = ""

	let resultBtn = document.getElementById('resultBtn')
	resultBtn.style.display = 'none'
	startConfetti();
	const questionTitle = document.getElementById('question')
	questionTitle.innerHTML = "Congratulations, your final score is:"
	const score = document.getElementById('score')
	score.innerHTML = totalScore



	console.log(totalScore)
}