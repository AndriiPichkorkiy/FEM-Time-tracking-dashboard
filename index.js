const refs = {
  controlPanel: document.querySelector(".card-main__control-buttons"),
  //currentTimeArr: document.querySelectorAll(".card__body-time-now"),
  //previousTimeArr: document.querySelectorAll(".card__body-before"),
};

let dataFromBackEnd;
const cards = {};

prepareBackEndDataAndCards();
refs.controlPanel.addEventListener("click", controlPanelHandler);

// === === === === === === === ===
// === === == FUNCTIONS == === ===
// === === === === === === === ===

function controlPanelHandler({ target: button }) {
  if (button.nodeName !== "LI") return;

  //change cards
  const title = button.textContent.toLocaleLowerCase();
  switcher(title);

  //change active status css
  for (const el of refs.controlPanel.children) {
    el.classList.remove("active");
  }
  button.classList.add("active");
}

function switcher(title) {
  for (const card of Object.keys(cards)) {
    //get data
    const infoData = dataFromBackEnd.find(
      (cardBackEnd) => cardBackEnd.title === card
    );

    //destructurization
    const { current, previous } = infoData.timeframes[title];

    //set data
    cards[card].currentTimeEl.textContent = `${current}${getPostfix(current)}`;
    cards[card].previousTimeEl.textContent = `${getPrefix(
      title
    )}${previous}${getPostfix(title)}
    `;
  }
}

function getPrefix(title) {
  switch (title) {
    case "daily":
      return "Yesterday - ";

    case "weekly":
      return "Last week - ";

    case "monthly":
      return "Last month - ";

    default:
      return "Previous period -  ";
  }
}

const getPostfix = (hours) => (hours == 1 ? "hr" : "hrs");

// === === === === === === === ===
// === === === PRELOAD === === ===
// === === === === === === === ===

async function prepareBackEndDataAndCards() {
  const url = window.location.href + "data.json";
  const respons = await fetch(url);
  dataFromBackEnd = await respons.json();
  getCards(dataFromBackEnd);

  switcher("daily");
}

function getCards(data) {
  data.forEach((card) => {
    const elCard = document.querySelector(`[data-name='${card.title}']`);
    cards[card.title] = {
      currentTimeEl: elCard.querySelector(".card__body-time-now"),
      previousTimeEl: elCard.querySelector(".card__body-time-before"),
    };
  });
}
