const startButton = document.querySelector(".start_btn");
const availableCategories = document.querySelector(".wrapper");
const displayCatogories = document.querySelector("#available_tags");
const categoryProceedButton = document.querySelector(".proceed");
const informationBoxExit = document.querySelector("#informationBoxExit");
const quizContainer = document.querySelector(".quiz_box");
const informationBoxContinue = document.querySelector(
  "#informationBoxContinue"
);
const informationPage = document.querySelector(".info_box");
const selectedCategories = [];
const randNumber = [];

// Quiz container-
const question = document.querySelector(".que_text");
const optionsList = document.querySelector(".option_list");
const showTime = document.querySelector(".timer_sec");
const nextButton = document.querySelector(".next_btn");
const timeLine = document.querySelector(".time_line");
const quizQuestion = document.querySelector("#quizQuestion");
const highScore = document.querySelector(".highscore_value");

// Result container-
const resultContainer = document.querySelector(".result_box");
const resultScore = document.querySelector("#resultScore");
const resultQuestions = document.querySelector("#resultQuestions");
// const resultBoxReplay = document.querySelector("#resultBoxReplay");
const resultBoxQuit = document.querySelector("#resultBoxQuit");

// Footer section-
const footerCurrentQuestion = document.querySelector("#footerCurrentQuestion");

// store users data-
const questionData = {
  currentQuestion: 0,
  questionLimit: 15,
  timer: [30, 45, 60],
  correctAnswers: 0,
  levels: ["easy", "medium", "hard"],
  answer: "",
};

let fetchedQuestions = [];

let remainingCategories = document.querySelector("#remainingCategories");
let counter, interval;
let counterLine, currentTime;
let optionClicked = false;

// Init
categoryProceedButton.disabled = true;
categoryProceedButton.style.backgroundColor = "#e1e1e1";
footerCurrentQuestion.textContent = questionData.currentQuestion;
quizQuestion.textContent = questionData.questionLimit;
resultContainer.classList.add("disabled");

// Set icon and className:
const setIconAndClass = function (element, className, fontAwesomeClass) {
  element.children[1].classList.add(className);
  element.classList.add(className);
  element.children[1].children[0].classList.add(fontAwesomeClass);
};

// use to store highscore-
const setLocalStorage = function () {
  const localStorageValue = localStorage.getItem("highscore");
  if (localStorageValue) {
    const noOfCorrectAns = questionData.correctAnswers;
    if (noOfCorrectAns > localStorageValue) {
      localStorage.setItem("highscore", noOfCorrectAns);
    }
    highScore.textContent = localStorageValue;
  } else {
    localStorage.setItem("highscore", "0");
    highScore.textContent = 0;
  }
};

const startTimer = function (time) {
  currentTime = time;
  function timer() {
    showTime.textContent = String(currentTime).padStart(2, 0);
    if (currentTime === 0) {
      clearInterval(counter);
      if (!optionClicked) {
        const options = Array.from(optionsList.children);
        const correctElement = options.find(
          (ele) => ele.dataset.value === questionData.answer
        );
        setIconAndClass(correctElement, "correct", "fa-check");
        nextButton.style.display = "block";
        optionsList.classList.add("disabled");
      }
    }
    --currentTime;
  }
  timer();
  counter = setInterval(timer, 1000);
};

const startTimeLine = function (time) {
  interval = setInterval(function () {
    let offset = time - currentTime;
    const percentage = Math.floor((100 * offset) / time);
    if (percentage >= 100) {
      clearInterval(interval);
    }
    timeLine.style.width = `${percentage}%`;
  }, 1000);
};

// Use to shuffle available options-
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

async function displayAvailableCategories() {
  const response = await fetch(`https://opentdb.com/api_category.php`);
  const data = await response.json();
  availableCategories.style.display = "block";
  informationPage.style.display = "none";
  setCategories(data);
}

const setCategories = function (data) {
  let htmlCode = "";
  data.trivia_categories.forEach((_, i) => {
    const { id, name } = data.trivia_categories[i];
    htmlCode += `<li data-category-id="${id}" class="tag">${name}</li>`;
  });
  displayCatogories.insertAdjacentHTML("afterbegin", htmlCode);
};

// handle categories
const handleCategories = function (e) {
  e.preventDefault();
  const currentCategory = e.target;
  const categoryId = currentCategory.dataset.categoryId;

  if (currentCategory.classList.contains("tag_selected")) {
    currentCategory.classList.remove("tag_selected");
    selectedCategories.pop(categoryId);
  } else if (currentCategory.classList.contains("tag")) {
    if (selectedCategories.length < 5) {
      currentCategory.classList.add("tag_selected");
      selectedCategories.push(categoryId);
    }
  }

  const noOfSelectedCategories = selectedCategories.length;
  categoryProceedButton.disabled = !noOfSelectedCategories;
  categoryProceedButton.style.backgroundColor = noOfSelectedCategories
    ? "crimson"
    : "#e2e2e2";
  remainingCategories.textContent = 5 - noOfSelectedCategories;
};

const reloadPage = () => location.reload();

const decodeHtmlCharacter = (str) => {
  let ele = document.createElement("textarea");
  ele.innerHTML = str;
  return ele.value;
};

const displayInfoPage = () => {
  informationPage.style.display = "block";
  startButton.style.display = "none";
};

// whenever the quiz ends, show result to the user-
const showResult = () => {
  resultContainer.classList.remove("disabled");
  quizContainer.style.display = "none";
  document.querySelector("body").style.backgroundColor = "#fff";
  resultScore.textContent = questionData.correctAnswers;
  resultQuestions.textContent = questionData.questionLimit;
  if (questionData.correctAnswers >= 5) {
    confetti.start();
    setTimeout(function () {
      confetti.stop();
    }, 10000);
  }
};

const clearIntervals = () => {
  clearInterval(counter);
  clearInterval(interval);
};

// handle the quiz ui part-
const handleQuizUI = function (timer) {
  showTime.textContent = timer;
  quizContainer.style.display = "block";
  availableCategories.style.display = "none";
  nextButton.style.display = "none";
  optionClicked = false;
  optionsList.classList.remove("disabled");
  clearIntervals();
  startTimer(timer);
  startTimeLine(timer);
};

// fetch new question-
const fetchQuiz = async () => {
  const { currentQuestion, timer, levels } = questionData;
  const difficultyIndex = Math.floor(currentQuestion / 5);
  if (
    questionData.currentQuestion < questionData.questionLimit &&
    Math.floor(currentQuestion) % 5 === 0
  ) {
    fetchedQuestions = [];
    const questionsToFetch = Math.ceil(5 / selectedCategories.length);
    const url = `https://opentdb.com/api.php?amount=${questionsToFetch}&category=CATEGORY_ID&difficulty=DIFFICULTY&type=multiple`;
    for (let category of selectedCategories) {
      let errorOffset = 0;
      let isDataFound = true;
      do {
        const response = await fetch(
          url
            .replace("CATEGORY_ID", category)
            .replace("DIFFICULTY", levels[difficultyIndex + errorOffset])
        );
        const data = await response.json();
        if (data.response_code > 0) {
          isDataFound = false;
          ++errorOffset;
          return;
        }
        fetchedQuestions.push(...data.results);
        isDataFound = true;
      } while (!isDataFound);
    }

    fetchedQuestions = shuffleArray(fetchedQuestions);
  }

  if (questionData.currentQuestion < questionData.questionLimit) {
    handleQuizUI(timer[difficultyIndex]);
    setQuestion(fetchedQuestions[questionData.currentQuestion % 5]);
  } else {
    clearIntervals();
    showResult();
  }
  setLocalStorage();
};

// Set dynamic questions-
const setQuestion = (currentQuestion) => {
  optionsList.innerHTML = "";
  const newQuestion = currentQuestion.question;
  question.innerHTML = `<span>${
    questionData.currentQuestion + 1
  }. ${newQuestion}</span>`;

  questionData.answer = md5(
    decodeHtmlCharacter(currentQuestion.correct_answer)
  );

  const availableOptions = shuffleArray([
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ]);

  let htmlCode = "";
  availableOptions.forEach((option) => {
    htmlCode += `
      <div class="option" data-value="${md5(decodeHtmlCharacter(option))}">
        <span>${option}</span>
        <div class="icon"><i class="fas"></i></div>
      </div>`;
  });
  optionsList.insertAdjacentHTML("afterbegin", htmlCode);
  questionData.currentQuestion++;
  footerCurrentQuestion.textContent = questionData.currentQuestion;
};

// handle option selection
const handleSelectOption = function (e) {
  e.preventDefault();
  const click = e.target.closest(".option");

  nextButton.style.display = "none";
  if (click) {
    optionClicked = true;
    const options = Array.from(optionsList.children);
    click.children[1].style.display = "block";
    clearInterval(interval);
    clearInterval(counter);
    if (click.dataset.value === questionData.answer) {
      setIconAndClass(click, "correct", "fa-check");
      questionData.correctAnswers++;
      if (questionData.correctAnswers % 5 === 0) {
        randNumber.length = 0;
      }
    } else {
      setIconAndClass(click, "incorrect", "fa-times");
      const correctElement = options.find(
        (ele) => ele.dataset.value === questionData.answer
      );
      correctElement.children[1].style.display = "block";
      setIconAndClass(correctElement, "correct", "fa-check");
    }
    nextButton.style.display = "block";
    options.forEach((ele) => ele.classList.add("disabled"));
    optionsList.classList.add("disabled");
  }
};

// Event handlers-
startButton.addEventListener("click", displayInfoPage);
displayCatogories.addEventListener("click", handleCategories);
informationBoxExit.addEventListener("click", reloadPage);
informationBoxContinue.addEventListener("click", displayAvailableCategories);
categoryProceedButton.addEventListener("click", fetchQuiz);
nextButton.addEventListener("click", fetchQuiz);
optionsList.addEventListener("click", handleSelectOption);
resultBoxQuit.addEventListener("click", reloadPage);
