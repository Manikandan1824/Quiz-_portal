const quizData = {
  status: "success",
  message: "Quiz questions fetched successfully",
  data: {
    questions: [
      {
        id: 1,
        question: "What does the <article> element in HTML5 represent?",
        options: [
          "A section of content that is self-contained",
          "An inline element",
          "A block of text within a paragraph",
          "A navigational link"
        ],
        correctAnswer: "A section of content that is self-contained",
        category: "HTML"
      },
      {
        id: 2,
        question: "Which HTML5 element is used for playing audio files?",
        options: ["<audio>", "<video>", "<media>", "<sound>"],
        correctAnswer: "<audio>",
        category: "HTML"
      },
      {
        id: 3,
        question: "Which of the following is a new input type introduced in HTML5?",
        options: ["date", "checkbox", "text", "submit"],
        correctAnswer: "date",
        category: "HTML"
      },
      {
        id: 4,
        question: "Which element is used to embed an external resource, such as a webpage or a video, into an HTML document?",
        options: ["<media>", "<object>", "<iframe>", "<embed>"],
        correctAnswer: "<iframe>",
        category: "HTML"
      },
      {
        id: 5,
        question: "Which CSS property controls the text size?",
        options: ["text-size", "font-size", "size", "font-style"],
        correctAnswer: "font-size",
        category: "CSS"
      },
      {
        id: 6,
        question: "What is the correct syntax to add a border with a width of 1px, solid style, and red color to an element in CSS?",
        options: [
          "border-color: red solid 1px;",
          "border: 1px solid red;",
          "border-width: 1px; border-style: solid; border-color: red;",
          "border-style: solid 1px red;"
        ],
        correctAnswer: "border: 1px solid red;",
        category: "CSS"
      },
      {
        id: 7,
        question: "Which property is used to change the background color of an element in CSS?",
        options: ["bgcolor", "color", "background-color", "background"],
        correctAnswer: "background-color",
        category: "CSS"
      },
      {
        id: 8,
        question: "How do you apply a class to an element in HTML?",
        options: [
          "<div id='classname'>",
          "<div style='classname'>",
          "<div name='classname'>",
          "<div class='classname'>"
        ],
        correctAnswer: "<div class='classname'>",
        category: "HTML"
      },
      {
        id: 9,
        question: "Which is the correct way to declare a variable in JavaScript?",
        options: [
          "let x = 5;",
          "var x = 5;",
          "const x = 5;",
          "All of the above"
        ],
        correctAnswer: "All of the above",
        category: "JavaScript"
      },
      {
        id: 10,
        question: "What is the output of console.log(typeof 42); in JavaScript?",
        options: ["number", "string", "integer", "float"],
        correctAnswer: "number",
        category: "JavaScript"
      }
    ]
  }
};

let currentQuestionIndex = 0;
let questions = [];
const flaggedQuestions = new Set();
const selectedAnswers = {};
let timerDuration = 10 * 60;

function loadQuestions() {
  questions = quizData.data.questions;
  loadQuestion(currentQuestionIndex);
}

function loadQuestion(index) {
  const questionObj = questions[index];
  document.getElementById("question-container").textContent =
    questionObj.question;

  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  questionObj.options.forEach((answer, i) => {
    const answerButton = document.createElement("button");
    answerButton.textContent = answer;
    answerButton.classList.add("answer-item");

    if (selectedAnswers[index] === i) {
      answerButton.classList.add("selected");
    }

    answerButton.addEventListener("click", () => selectAnswer(i));
    answersContainer.appendChild(answerButton);
  });

  document.getElementById("prev-btn").disabled = index === 0;
  document.getElementById("next-btn").disabled = index === questions.length - 1;

  const flagBtn = document.getElementById("flag-btn");
  flagBtn.classList.toggle("flagged", flaggedQuestions.has(index));
  flagBtn.innerHTML = flaggedQuestions.has(index)
    ? "Unflag"
    : '<i class="bi bi-flag"></i>';

  updateProgress();
}

function selectAnswer(selectedIndex) {
  const answerButtons = document.querySelectorAll("#answers-container button");

  answerButtons.forEach((button, index) => {
    if (index === selectedIndex) {
      button.classList.add("selected");
      selectedAnswers[currentQuestionIndex] = selectedIndex;

      localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
    } else {
      button.classList.remove("selected");
    }
  });
}

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion(currentQuestionIndex);
  }
});

document.getElementById("flag-btn").addEventListener("click", () => {
  const flaggedList = document.getElementById("flagged-questions");
  const flagBtn = document.getElementById("flag-btn");

  if (flaggedQuestions.has(currentQuestionIndex)) {
    flaggedQuestions.delete(currentQuestionIndex);
    flagBtn.classList.remove("flagged");
    flagBtn.innerHTML = '<i class="bi bi-flag"></i>';

    const listItem = document.querySelector(
      `li[data-question-index="${currentQuestionIndex}"]`
    );
    if (listItem) {
      flaggedList.removeChild(listItem);
    }
  } else {
    flaggedQuestions.add(currentQuestionIndex);
    flagBtn.classList.add("flagged");
    flagBtn.textContent = "Unflag";

    const listItem = document.createElement("li");
    listItem.textContent = `Question ${currentQuestionIndex + 1}`;
    listItem.dataset.questionIndex = currentQuestionIndex;

    listItem.addEventListener("click", function () {
      currentQuestionIndex = parseInt(this.dataset.questionIndex);
      loadQuestion(currentQuestionIndex);
    });

    flaggedList.prepend(listItem);
  }

  localStorage.setItem(
    "flaggedQuestions",
    JSON.stringify([...flaggedQuestions])
  );
});

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  document.getElementById("exam-progress").value = progress;
  document.getElementById("progress-text").textContent = `${Math.round(
    progress
  )}% Completed`;
}

function calculateResult() {
  let correctAnswers = 0;
  questions.forEach((question, index) => {
    if (
      questions[index].options[selectedAnswers[index]] ===
      question.correctAnswer
    ) {
      correctAnswers++;
    }
  });

  const totalQuestions = questions.length;
  const score = (correctAnswers / totalQuestions) * 100;

  localStorage.setItem("studentScore", score.toFixed(2));

  // Clear saved answers from localStorage
  localStorage.removeItem("selectedAnswers");
  localStorage.removeItem("remainingTime");

  window.location.href = "result.html";
}

let timerInterval;

function startTimer() {
  const timerElement = document.getElementById("timer");

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  const savedTimer = localStorage.getItem("remainingTime");
  if (savedTimer !== null) {
    timerDuration = parseInt(savedTimer, 10);
  }

  timerInterval = setInterval(function () {
    let minutes = Math.floor(timerDuration / 60);
    let seconds = timerDuration % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerElement.textContent = `${minutes}:${seconds}`;

    if (timerDuration < 60) {
      timerElement.classList.add("timer-warning");
    }

    if (timerDuration <= 0) {
      clearInterval(timerInterval);
      localStorage.removeItem("remainingTime");
      window.location.href = "timeout.html";
    }

    timerDuration--;
    localStorage.setItem("remainingTime", timerDuration);
  }, 1000);
}

window.onload = function () {
  loadQuestions();

  const storedStudentName = localStorage.getItem("studentName");
  const storedStudentID = localStorage.getItem("studentID");
  const storedStudentImage = localStorage.getItem("studentImage");

  const loggedInStudentName = storedStudentName ? storedStudentName : "Unknown";
  const loggedInStudentID = storedStudentID ? storedStudentID : "Unknown";

  document.getElementById(
    "student-name"
  ).textContent = `Name: ${loggedInStudentName}`;
  document.getElementById(
    "student-id"
  ).textContent = `ID: ${loggedInStudentID}`;

  if (storedStudentImage) {
    const imgElement = document.createElement("img");
    imgElement.src = storedStudentImage;
    imgElement.alt = "Student Image";
    imgElement.style.width = "50px";
    imgElement.style.height = "50px";
    imgElement.style.borderRadius = "50%";
    document.getElementById("user-info").appendChild(imgElement);
  }

  const savedFlaggedQuestions = localStorage.getItem("flaggedQuestions");
  if (savedFlaggedQuestions) {
    const flaggedArray = JSON.parse(savedFlaggedQuestions);
    flaggedArray.forEach((questionIndex) =>
      flaggedQuestions.add(questionIndex)
    );

    flaggedArray.forEach((questionIndex) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Question ${questionIndex + 1}`;
      listItem.dataset.questionIndex = questionIndex;

      listItem.addEventListener("click", function () {
        currentQuestionIndex = parseInt(this.dataset.questionIndex);
        loadQuestion(currentQuestionIndex);
      });

      document.getElementById("flagged-questions").prepend(listItem);
    });
  }

  startTimer();
};

window.onbeforeunload = function () {
  localStorage.setItem("remainingTime", timerDuration);
};

document
  .getElementById("submit-btn")
  .addEventListener("click", calculateResult);
