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
const optionsArray = document.querySelectorAll(".option");
console.log(optionsArray);

const currQuestionData = {
  currentQuestion: 0,
  questionLimit: 15,
  timer: [30, 45, 60],
  levels: ["easy", "medium", "hard"],
};

let remainingCategories = document.querySelector("#remainingCategories");

// Init
categoryProceedButton.disabled = true;
categoryProceedButton.style.backgroundColor = "#e1e1e1";

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
    htmlCode += `<li data-category-id="${id}" class="tag">${name}</li>`;
  });
  displayCatogories.insertAdjacentHTML("afterbegin", htmlCode);
};

const handleCategories = function (e) {
  e.preventDefault();
  const currentCategory = e.target;
  const categoryId = currentCategory.dataset.categoryId;

  /* 
    IF CONDITON-
    If the user clicks the category which is already been selected, then it will deselect the 
    category also will remove the category id from the array.

    ELSE-IF CONDITION-
    If the user click on the category and if the length of the array is less than 5 than the
    category id will be added in the array also the backgroundColor  will be changed
  */
  if (currentCategory.classList.contains("tag_selected")) {
    currentCategory.classList.remove("tag_selected");
    selectedCategories.pop(categoryId);
  } else if (currentCategory.classList.contains("tag")) {
    if (selectedCategories.length < 5) {
      currentCategory.classList.add("tag_selected");
      selectedCategories.push(categoryId);
    }
  }

  /*
    If any of the category is selected the proceed button will be activated, else it will be 
    disabled
  */
  if (selectedCategories.length > 0) {
    categoryProceedButton.disabled = false;
    categoryProceedButton.style.backgroundColor = "crimson";
  } else {
    categoryProceedButton.disabled = true;
    categoryProceedButton.style.backgroundColor = "#e2e2e2";
  }

  remainingCategories.textContent = 5 - selectedCategories.length;
};

const reloadPage = () => location.reload();

const displayInfoPage = () => {
  informationPage.style.display = "block";
  startButton.style.display = "none";
};

async function fetchQuiz() {
  const randomCategoryId = randomNumber(selectedCategories);
  const response = await fetch(
    `https://opentdb.com/api.php?amount=15&category=${randomCategoryId}&difficulty=medium&type=multiple`
  );
  console.log(selectedCategories.length, randomCategoryId);
  const data = await response.json();
  quizContainer.style.display = "block";
  informationPage.style.display = "none";
  setDynamicQuestions(data);
}

/*
  Shuffle array will shuffle elements from an array,
  For example: [1,2,3,4,5], array.length = 5,
  j will have a random number between 0 - 4,
  If any number repeats, it's index will be changed again,
*/
const shuffleArray = (array, element) => {
  array.push(element);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    console.log(`j: ${j} | i: ${i}`);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// Set dynamic questions-
const setDynamicQuestions = (data) => {
  const newQuestion = data.results[0].question;
  question.innerHTML = `<span>${newQuestion}</span>`;
  const availableOptions = shuffleArray(
    data.results[0].incorrect_answers,
    data.results[0].correct_answer
  );
  optionsArray.forEach((element, i) => {
    element.innerHTML = `<span>${availableOptions[i]}</span>`;
  });
};

// Event handlers
startButton.addEventListener("click", displayInfoPage);
displayCatogories.addEventListener("click", handleCategories);
informationBoxExit.addEventListener("click", reloadPage);
informationBoxContinue.addEventListener("click", displayAvailableCategories);
categoryProceedButton.addEventListener("click", fetchQuiz);
