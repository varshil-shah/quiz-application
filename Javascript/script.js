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

// Quiz container-
const question = document.querySelector(".que_text");
const optionsList = document.querySelector(".option_list");
const showTime = document.querySelector(".timer_sec");
const nextButton = document.querySelector(".next_btn");
const timeLine = document.querySelector(".time_line");
const quizQuestion = document.querySelector("#quizQuestion");

// Result container-
const resultContainer = document.querySelector(".result_box");
const resultScore = document.querySelector("#resultScore");
const resultQuestions = document.querySelector("#resultQuestions");
const resultBoxReplay = document.querySelector("#resultBoxReplay");
const resultBoxQuit = document.querySelector("#resultBoxQuit");

// Footer section-
const footerCurrentQuestion = document.querySelector("#footerCurrentQuestion");

const questionData = {
  currentQuestion: 0,
  questionLimit: 15,
  timer: [30, 45, 60],
  correctAnswers: 0,
  levels: ["easy", "medium", "hard"],
  answer: "",
};

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

/*
  randomNumber function generates a random number,
  returns a random value from an array,
*/
const randomNumber = (array) => {
  return array[Math.floor(Math.random() * array.length)];
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
        // REFACTOR
        correctElement.children[1].classList.add("correct");
        correctElement.classList.add("correct");
        correctElement.children[1].children[0].classList.add("fa-check");
        nextButton.style.display = "block";
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
    console.log(Math.floor((100 * offset) / time));
    const percentage = Math.floor((100 * offset) / time);
    if (percentage >= 100) {
      clearInterval(interval);
      console.log(`Time line completed`);
    }
    timeLine.style.width = `${percentage}%`;
  }, 1000);
};

const categoriesUrl = "https://opentdb.com/api_category.php";
async function displayAvailableCategories() {
  const response = await fetch(categoriesUrl);
  const data = await response.json();
  availableCategories.style.display = "block";
  informationPage.style.display = "none";
  setCategories(data);
}

const setCategories = function (data) {
  let htmlCode = "";
  data.trivia_categories.forEach((_, i) => {
    const { id, name } = data.trivia_categories[i];
    if (![13, 16, 19, 25, 30].includes(id)) {
      htmlCode += `<li data-category-id="${id}" class="tag">${name}</li>`;
    }
  });
  displayCatogories.insertAdjacentHTML("afterbegin", htmlCode);
};

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

async function fetchQuiz() {
  if (questionData.currentQuestion < questionData.questionLimit) {
    const id = randomNumber(selectedCategories);
    const { currentQuestion, timer, levels } = questionData;
    const index = Math.floor(currentQuestion / 5);
    let errorOffset = 0;

    let data;
    do {
      const url = `https://opentdb.com/api.php?amount=15&category=${id}&difficulty=${
        levels[index + errorOffset]
      }&type=multiple`;
      const response = await fetch(url);
      data = await response.json();
      ++errorOffset;
    } while (data.response_code);

    showTime.textContent = timer[index];
    quizContainer.style.display = "block";
    availableCategories.style.display = "none";
    nextButton.style.display = "none";
    optionClicked = false;
    optionsList.classList.remove("disabled");
    clearInterval(counter);
    startTimer(timer[index]);
    clearInterval(interval);
    startTimeLine(timer[index]);
    setDynamicQuestions(data);
  } else {
    clearInterval(counter);
    clearInterval(interval);
    showResult();
  }
}

const shuffleArray = (array, element) => {
  array.push(element);
  questionData.answer = md5(decodeHtmlCharacter(element));
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Set dynamic questions-
const setDynamicQuestions = (data) => {
  optionsList.innerHTML = "";
  const currentObject = data.results[questionData.currentQuestion];
  const newQuestion = currentObject.question;
  question.innerHTML = `<span>${
    questionData.currentQuestion + 1
  }. ${newQuestion}</span>`;
  const availableOptions = shuffleArray(
    currentObject.incorrect_answers,
    currentObject.correct_answer
  );

  let htmlCode = "";
  availableOptions.forEach((ele) => {
    // Bad practice: DEBUG
    htmlCode += `
      <div class="option" data-value="${md5(decodeHtmlCharacter(ele))}">
        <span>${ele}</span>
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

  // set icon function:
  const setIconAndClass = function (element, className, fontAwesomeClass) {
    element.children[1].classList.add(className);
    element.classList.add(className);
    element.children[1].children[0].classList.add(fontAwesomeClass);
  };

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

const replayQuiz = () => {
  confetti.stop();
  resultContainer.classList.add("disabled");
  availableCategories.style.display = "block";
  document.querySelector("body").style.backgroundColor = "crimson";
};

// Event handlers
startButton.addEventListener("click", displayInfoPage);
displayCatogories.addEventListener("click", handleCategories);
informationBoxExit.addEventListener("click", reloadPage);
informationBoxContinue.addEventListener("click", displayAvailableCategories);
categoryProceedButton.addEventListener("click", fetchQuiz);
nextButton.addEventListener("click", fetchQuiz);
optionsList.addEventListener("click", handleSelectOption);
resultBoxReplay.addEventListener("click", replayQuiz);
resultBoxQuit.addEventListener("click", reloadPage);
