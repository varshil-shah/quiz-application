const whatsApp = document.querySelector("#whatsapp");
const telegram = document.querySelector("#telegram");
const gmail = document.querySelector("#gmail");
const linkedin = document.querySelector("#linkedin");

const handleClickEvent = (url) => socialWindow(url, 570, 450);

const setShareLink = function () {
  const pageUrl = encodeURIComponent(document.URL);
  const text = `I'm playing a quiz, and I want you to take part.
There are many categories in this quiz application, and the questions will be drawn only from those categories. A total of 15 questions will be asked, and after every 5 questions, 15 seconds will be added, as well as the difficulty level of the questions will be increased. Try`;

  // WhatsApp-
  whatsApp.addEventListener(
    "click",
    handleClickEvent.bind(null, `whatsapp://send?text=${text}%20${pageUrl}`)
  );

  // gmail-
  gmail.addEventListener(
    "click",
    handleClickEvent.bind(
      null,
      `mailto:?subject=%22${text}%22&body=Read%20the%20article%20%22${text}%22%20on%20${pageUrl}`
    )
  );

  // telegram-
  telegram.addEventListener(
    "click",
    handleClickEvent.bind(
      null,
      `https://telegram.me/share/url?text=${text}&url=${pageUrl}`
    )
  );
};

function socialWindow(url, width, height) {
  let left = (screen.width - width) / 2;
  let top = (screen.height - height) / 2;
  let params = `menubar=no,toolbar=no,status=no,width=${width},height= ${height} ,top= ${top},left=${left}`;
  window.open(url, "", params);
}

window.onload = setShareLink;
