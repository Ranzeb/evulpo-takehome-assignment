// this is a basic connection schema to the corresponding data for the table provided.
// this API KEY will expire after January 2022
// Written by GSoosalu & ndr3svt
const API_KEY = 'AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4'
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly"
let exerciseIndex
let exerciseData
let states = []
let totNumberOfQuestions
let questions = []
let currentOptions = []
let currentSelectedResponse
let currentCorrectResponse
let questionsResult = []
let currentQuestionIndex


async function handleClientLoad() {
	await gapi.load('client', initClient)
}


// Init Google API client and call the function that retreive questions
async function initClient() {
	await gapi.client.init({
		apiKey: API_KEY,
		discoveryDocs: DISCOVERY_DOCS
	});
	await getExerciseData()
}

// Retrieve exercise data from the Google Sheets provided then init the HTML page with the first question and options
// Evaluate button is displayed
async function getExerciseData() {

	let response

	try {
		response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
			range: 'Learning!A1:F10',
		});
	} catch (err) {
		console.log('Error: ' + err)
	}

	questions = response.result.values.slice(1)
	totNumberOfQuestions = questions.length

	let questionIndex = Math.floor(Math.random() * questions.length)
	currentQuestionIndex = questionIndex

	let options = questions[questionIndex][3].split(";");

	let optionsContainer = document.querySelector('#options-wrapper');
	const questionTitle = document.getElementById('question')
	questionTitle.innerHTML = questions[questionIndex][2]

	currentOptions = options
	currentCorrectResponse = questions[questionIndex][4]

	for (let i = 0; i < options.length; i++) {
		optionsContainer.innerHTML += `<div class='unchosen option' id='question${i}'><p class='text' onClick='toggleChoice(${i})'>` + options[i] + "</p></div>"
	}
	optionsContainer.innerHTML += "<br/>"

	const evaluateBtn = document.getElementById('evaluate')
	evaluateBtn.style.display = ''
}

// When a response between the possible available is selected, all the other options are unselected
// Then select the current one.
function toggleChoice(index) {

	for (let i = 0; i < currentOptions.length; i++) {
		const optionContainer = document.getElementById(`question${i}`)
		optionContainer.style.color = "#636363"
	}

	const optionContainer = document.getElementById(`question${index}`)
	optionContainer.style.color = "#5E5DF0"
	currentSelectedResponse = index
}

// Evaluate the response selected by the user and show a msg with the evaluation.
// If all questions are answered, shows the button to display the final view
// Otherwise, if the answer is correct, shows the button to load the next question
function myEvaluation() {

	const evMessage = document.querySelector('#evaluation-message')
	if (currentSelectedResponse == currentCorrectResponse) {
		evMessage.innerHTML = '<p>Awesome! Correct reply</p>'
		questionsResult.push(questions[currentQuestionIndex][5])

		const evaluateBtn = document.getElementById('evaluate')
		evaluateBtn.style.display = 'none'


		if (questionsResult.length == totNumberOfQuestions) {
			const resultBtn = document.getElementById('resultBtn')
			resultBtn.style.display = ''
		} else {
			const nextBtn = document.getElementById('next')
			nextBtn.style.display = ''
		}

	} else {
		evMessage.innerHTML = '<p>Wrong answer!</p>'
	}
}

// Load next random question by removing all the current options and then show the next one.
function loadNextQuestion() {

	questions.splice(currentQuestionIndex, 1)

	let questionIndex = Math.floor(Math.random() * questions.length)
	currentQuestionIndex = questionIndex

	let options = questions[questionIndex][3].split(";")

	const optionsContainer = document.querySelector('#options-wrapper')
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

	const evaluateBtn = document.getElementById('evaluate')
	evaluateBtn.style.display = ''

	const nextBtn = document.getElementById('next')
	nextBtn.style.display = 'none'

	const evMessage = document.querySelector('#evaluation-message')
	evMessage.innerHTML = ""
}

// Calculate the total score and then load the final view with some confetti dropping.
function loadResults() {
	let totalScore = 0;
	questionsResult.map((currScore) => {
		totalScore += parseInt(currScore);
	})

	const optionsContainer = document.querySelector('#options-wrapper')
	optionsContainer.innerHTML = ""
	const evMessage = document.querySelector('#evaluation-message')
	evMessage.innerHTML = ""

	const resultBtn = document.getElementById('resultBtn')
	resultBtn.style.display = 'none'

	startConfetti();

	const questionTitle = document.getElementById('question')
	questionTitle.innerHTML = "Congratulations, your final score is:"
	const score = document.getElementById('score')
	score.innerHTML = totalScore
}