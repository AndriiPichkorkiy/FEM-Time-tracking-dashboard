const refs = {
  controlPanel: document.querySelector(".card-main__control-buttons"),
  //currentTimeArr: document.querySelectorAll(".card__body-time-now"),
  //previousTimeArr: document.querySelectorAll(".card__body-before"),
};

let dataFromBackEnd;
let cards;

getDataFromBackEnd();
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
  for (const card in Object.keys(cards)) {
    if (!cards.hasOwnProperty(card)) continue;

    //get data
    const infoData = dataFromBackEnd.find(
      (cardBackEnd) => cardBackEnd.title === card
    );

    //destructurization
    const { current, previous } = infoData.timeframes[title];

    //set data
    cards[card].currentTimeEl.textContent = `${current}hr`;
    cards[card].previousTimeEl.textContent = `Previous - ${previous}hrs`;
  }
}

// === === === === === === === ===
// === === === PRELOAD === === ===
// === === === === === === === ===

async function getDataFromBackEnd() {
  const url = window.location.href + "data.json";
  const respons = await fetch(url);
  dataFromBackEnd = await respons.json();
  cards = getCards(dataFromBackEnd);

  switcher("daily");
}

function getCards(data) {
  const cards = {};
  console.log("data", data);

  data.forEach((card) => {
    console.log("card", card);
    const elCard = document.querySelector(`[data-name='${card.title}']`);
    cards[card.title] = {
      currentTimeEl: elCard.querySelector(".card__body-time-now"),
      previousTimeEl: elCard.querySelector(".card__body-time-before"),
    };
  });
  return cards;
}
