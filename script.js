const startButton = document.querySelector(".start_btn");
const availableCategories = document.querySelector(".wrapper");
const displayCatogories = document.querySelector("#available_tags");
const categoryProceedButton = document.querySelector(".proceed");
const selectedCategories = [];

let remainingCategories = document.querySelector("#remainingCategories");

// Init
categoryProceedButton.disabled = true;
categoryProceedButton.style.backgroundColor = "#e2e2e2";

const categoriesUrl = "https://opentdb.com/api_category.php";
async function displayAvailableCategories() {
  const response = await fetch(categoriesUrl);
  const data = await response.json();
  availableCategories.style.display = "block";
  startButton.style.display = "none";
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

  if (currentCategory.classList.contains("tag_selected")) {
    currentCategory.classList.remove("tag_selected");
    selectedCategories.pop(categoryId);
  } else if (currentCategory.classList.contains("tag")) {
    if (selectedCategories.length < 5) {
      currentCategory.classList.add("tag_selected");
      selectedCategories.push(categoryId);
    }
  }

  if (selectedCategories.length > 0) {
    categoryProceedButton.disabled = false;
    categoryProceedButton.style.backgroundColor = "crimson";
  } else {
    categoryProceedButton.disabled = true;
    categoryProceedButton.style.backgroundColor = "#e2e2e2";
  }

  remainingCategories.textContent = 5 - selectedCategories.length;
};

startButton.addEventListener("click", displayAvailableCategories);
displayCatogories.addEventListener("click", handleCategories);
