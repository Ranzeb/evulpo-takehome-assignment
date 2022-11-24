# DEVS INTERVIEWEES TASK
Coding Task for Full Stack Developer at evulpo 
Create a Single Choice Exercise Viewer, where you can go circulate in a random order through a collection of exercises, solve them, evaluate them and get back the score

For this you can use the Google Sheet database we set for you right here:
https://docs.google.com/spreadsheets/d/1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc/edit?usp=sharing.

# Solution

My solution is based on a single page html with some CSS and Javascript logic to update buttons and view.

First of all, I've made the G-API call async. I've loaded all the page elements after the resolve of the call to the G-API to retrieve the test's info.

After that, I've created a question plus possible reply view that allow the user to choose the correct one and the evaluate the result.

If the result is correct, then the javascript load the button to go to the next question and so on until all the question are done.

After that, an evaluation button is shown and then you can see your final result with some confetti's dropping into the screen.

The core idea is to fetch the data from G-API at the loading of the test and then manipulate an array of object to speed up the process and don't make a lot of async call that can slow the overall performances.

* Due to Cross Origin restrictions while using gapi, you need to run your application and connect to the google api (gapi) you need to start a server using npm or npx  http-server

https://www.npmjs.com/package/npx-server

https://www.npmjs.com/package/http-server


# Run

You need to install the dependencies with the command:

npm install

Then, you can run the application by using the command:

node server.js 

in order to avoid the cross origin restrictions and the open the index.html at the localhost address
