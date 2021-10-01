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
const timeLeft = document.querySelector(".timer_sec");
const nextButton = document.querySelector(".next_btn");

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

// Init
categoryProceedButton.disabled = true;
categoryProceedButton.style.backgroundColor = "#e1e1e1";
footerCurrentQuestion.textContent = questionData.currentQuestion;

/*
  randomNumber function generates a random number,
  returns a random value from an array,
*/
const randomNumber = (array) => {
  return array[Math.floor(Math.random() * array.length)];
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
  console.log(!!noOfSelectedCategories);
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

async function fetchQuiz() {
  const id = randomNumber(selectedCategories);
  const { currentQuestion, timer, levels } = questionData;
  const index = Math.floor(currentQuestion / 5);
  const url = `https://opentdb.com/api.php?amount=15&category=${+id}&difficulty=${
    levels[index]
  }&type=multiple`;
  timeLeft.textContent = timer[index];

  const response = await fetch(url);
  const data = await response.json();
  console.log(data, url);
  quizContainer.style.display = "block";
  availableCategories.style.display = "none";
  nextButton.style.display = "none";
  optionsList.classList.remove("disabled");
  setDynamicQuestions(data);
}

const shuffleArray = (array, element) => {
  array.push(element);
  questionData.answer = decodeHtmlCharacter(element);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Set dynamic questions-
const setDynamicQuestions = (data) => {
  if (questionData.currentQuestion < 15) {
    optionsList.innerHTML = "";
    const currentObject = data.results[questionData.currentQuestion];
    console.log(data);
    const newQuestion = currentObject.question;
    console.log(newQuestion);
    question.innerHTML = `<span>${
      questionData.currentQuestion + 1
    }. ${newQuestion}</span>`;
    const availableOptions = shuffleArray(
      currentObject.incorrect_answers,
      currentObject.correct_answer
    );

    // IMPLEMENT : try to use data-set
    // <div class="icon"><i class="fas"></i></div>
    let htmlCode = "";
    availableOptions.forEach((ele) => {
      // Bad practice: DEBUG
      htmlCode += `
      <div class="option" data-value="${decodeHtmlCharacter(ele)}">
        <span>${ele}</span>
        <div class="icon"><i class="fas"></i></div>
      </div>`;
    });
    optionsList.insertAdjacentHTML("afterbegin", htmlCode);
    questionData.currentQuestion++;
    footerCurrentQuestion.textContent = questionData.currentQuestion;
  } else {
    console.log(`Quiz completed`);
  }
};

// handle option selection
const handleSelectOption = function (e) {
  e.preventDefault();
  const click = e.target.closest(".option");
  const result = click.dataset.value === questionData.answer;
  const icons = document.querySelectorAll(".icon");
  icons.forEach((ele) => {
    console.log(ele.parent);
  });
  nextButton.style.display = "none";
  if (click) {
    const options = Array.from(optionsList.children);
    if (result) {
      click.classList.add("correct");
      questionData.correctAnswers++;
    } else {
      click.classList.add("incorrect");
      options
        .find((ele) => ele.dataset.value === questionData.answer)
        .classList.add("correct");
      console.log(`Incorrect answer`);
    }
    console.log(e);
    nextButton.style.display = "block";
    options.forEach((ele) => ele.classList.add("disabled"));
    optionsList.classList.add("disabled");
  }
};

// Event handlers
startButton.addEventListener("click", displayInfoPage);
displayCatogories.addEventListener("click", handleCategories);
informationBoxExit.addEventListener("click", reloadPage);
informationBoxContinue.addEventListener("click", displayAvailableCategories);
categoryProceedButton.addEventListener("click", fetchQuiz);
nextButton.addEventListener("click", fetchQuiz);

optionsList.addEventListener("click", handleSelectOption);
