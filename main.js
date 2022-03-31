// select elements
let countSpan = document.querySelector(".count span");
let bulltesSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let results = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// function to get data rom JSON file
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      // create bullets + set questions count
      createBullets(qCount);

      // add question data
      addQuestionData(questionsObject[currentIndex], qCount);

      // start countdown function
      countdown(120, qCount);

      // click on submit
      submitButton.onclick = () => {
        // get right answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        // Increase index
        currentIndex++;

        // check the answer
        checkAnswer(theRightAnswer, qCount);

        // remove old question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // add question data
        addQuestionData(questionsObject[currentIndex], qCount);

        // handel bulltes class
        handleBulltes();

        // countdown function
        clearInterval(countdownInterval);
        countdown(120, qCount);

        // show results
        shwoResults(qCount);
      };
    }
  };
  myRequest.open("GET", "htmlQuestions.json", true);
  myRequest.send();
}

getQuestions();

// create bullets function
function createBullets(num) {
  countSpan.innerHTML = num;

  // create spans
  for (let i = 0; i < num; i++) {
    // create span
    let theBullet = document.createElement("span");

    // check if it is first span
    if (i === 0) {
      theBullet.className = "on";
    }

    // append bullet to min bullets container
    bulltesSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create h2 question h2 title
    let questionTitle = document.createElement("h2");

    // create and append text in h2
    let questionText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);

    // append question to quiz area
    quizArea.appendChild(questionTitle);

    // create answers
    for (let i = 1; i <= 4; i++) {
      // create the answer div
      let mainDiv = document.createElement("div");

      // add answer class to div
      mainDiv.className = "answer";

      // create radio input
      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      radioInput.name = "questions";
      if (i === 1) {
        radioInput.checked = true;
      }
      // append radio input to answer container
      mainDiv.appendChild(radioInput);

      // create label for radio input
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      // append label text to label
      label.appendChild(labelText);
      // append label to answer container
      mainDiv.appendChild(label);

      // append answer container to answers area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(right, count) {
  let answers = document.getElementsByName("questions");
  let theChoosenAnswer;

  answers.forEach((a) => {
    if (a.checked) {
      theChoosenAnswer = a.dataset.answer;
    }
  });

  if (right === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBulltes() {
  let bulltesSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulltesSpan);

  arrayOfSpans.forEach((span, index) => {
    span.classList.remove("on");
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function shwoResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good , ${rightAnswers} From ${count}</span>`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect , ${rightAnswers} From ${count}</span>`;
    } else {
      theResults = `<span class="bad">bad , ${rightAnswers} From ${count}</span>`;
    }
    results.innerHTML = theResults;
    results.style.padding = "10px";
    results.style.backgroundColor = "white";
    results.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
