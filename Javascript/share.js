const whatsApp = document.querySelector("#whatsapp");
const telegram = document.querySelector("#telegram");
const gmail = document.querySelector("#gmail");
const linkedin = document.querySelector("#linkedin");

const setShareLink = function () {
  const pageUrl = encodeURIComponent(document.URL);
  const text = `Thanks for sharing the quiz application!!. 
There are many categories in this quiz application, and the questions will be drawn only from those categories. A total of 15 questions will be asked, and after every 5 questions, 15 seconds will be added, as well as the difficulty level of the questions. Try`;
  let url = null;

  // WhatsApp-
  whatsApp.addEventListener("click", function () {
    url = `whatsapp://send?text=${text}%20${pageUrl}`;
    socialWindow(url, 570, 450);
  });

  // gmail-
  gmail.addEventListener("click", function () {
    url = `mailto:?subject=%22${text}%22&body=Read%20the%20article%20%22${text}%22%20on%20${pageUrl}`;
    socialWindow(url, 570, 450);
  });

  // telegram-
  telegram.addEventListener("click", function () {
    url = `https://telegram.me/share/url?text=${text}&url=${pageUrl}`;
    socialWindow(url, 570, 450);
  });
};

function socialWindow(url, width, height) {
  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 2;
  var params = `menubar=no,toolbar=no,status=no,width=${width},height= ${height} ,top= ${top},left=${left}`;
  window.open(url, "", params);
}

window.onload = setShareLink;
