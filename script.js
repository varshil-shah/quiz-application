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

let remainingCategories = document.querySelector("#remainingCategories");

// Init
categoryProceedButton.disabled = true;
categoryProceedButton.style.backgroundColor = "#e1e1e1";

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

  /** 
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

  /**
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

const displayQuizContainer = () => {
  informationPage.style.display = "none";
  quizContainer.style.display = "block";
};

// Event handlers
startButton.addEventListener("click", displayInfoPage);
displayCatogories.addEventListener("click", handleCategories);
informationBoxExit.addEventListener("click", reloadPage);
informationBoxContinue.addEventListener("click", displayAvailableCategories);
categoryProceedButton.addEventListener("click", displayQuizContainer);
