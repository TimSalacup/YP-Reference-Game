let info = [];
let questions = [];
const verse = document.querySelector(".verse");
const choice1 = document.querySelector(".choices__1");
const choice2 = document.querySelector(".choices__2");
const choice3 = document.querySelector(".choices__3");
const response = document.querySelector("select");
const errorMessage = document.querySelector(".errorMessage");
const loadingIcon = document.querySelector(".loading");
const choicesSkeleton = document.querySelectorAll(".choices__skeleton");

loadingIcon.classList.toggle("show");
choicesSkeleton.forEach((el) => {
  el.classList.toggle("show");
});

async function fetchData() {
  try {
    const res = await fetch("https://bible-api.com/data/web/random");
    const data = await res.json();
    return data;
  } catch (error) {
    loadingIcon.classList.toggle("show");
    errorMessage.innerHTML +=
      "Bible API didn't respond, please wait a few moments...";
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}

// CONVERTS THE RANDOM VERSES TO KJV
async function fetchKJV(i) {
  try {
    const res = await fetch(
      `https://bible-api.com/${info[i].book.toLowerCase()} ${info[i].chapter}:${
        info[i].verse
      }?translation=kjv`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    loadingIcon.classList.toggle("show");
    errorMessage.innerHTML +=
      "Bible API didn't respond, please wait a few moments...";
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}

// GENERATES THE INDEX OF THE ANSWER
const generateRandomNum = () => {
  return Math.floor(Math.random() * 3);
};

// GENERATES THREE RANDOM VERSES (NOT YET KJV) AND PUTS THEM IN AN ARRAY
const loadChoices = async () => {
  for (i = 0; i <= 2; i++) {
    const data = await fetchData();
    info.push(data.random_verse);
  }
  if (info.length === 3) {
    loadQuestions();
  }
};

const answer = generateRandomNum();

// PUTS THE KJV VERSES INTO AN ARRAY
const loadQuestions = async () => {
  for (i = 0; i <= 2; i++) {
    const data = await fetchKJV(i);
    questions.push(data.verses[0]);
  }
  if (questions.length === 3) {
    loadingIcon.classList.toggle("show");
    choicesSkeleton.forEach((el) => {
      el.classList.toggle("show");
    });
    setPage();
  }
};

const setPage = () => {
  verse.innerHTML += `${questions[answer].text}`;
  choice1.innerHTML += `1: ${questions[0].book_name} ${questions[0].chapter}:${questions[0].verse}`;
  choice2.innerHTML += `2: ${questions[1].book_name} ${questions[1].chapter}:${questions[1].verse}`;
  choice3.innerHTML += `3: ${questions[2].book_name} ${questions[2].chapter}:${questions[2].verse}`;
};

const checkAnswer = () => {
  if (!response) {
    errorMessage.innerHTML += "Please select an answer";
  } else if (response.value - 1 === answer) {
    response.value === "1" && choice1.classList.toggle("correct");
    response.value === "2" && choice2.classList.toggle("correct");
    response.value === "3" && choice3.classList.toggle("correct");
  } else {
    response.value === "1" && choice1.classList.toggle("wrong");
    response.value === "2" && choice2.classList.toggle("wrong");
    response.value === "3" && choice3.classList.toggle("wrong");
  }
};

document.querySelector(".checkAnswer").addEventListener("click", checkAnswer);
document
  .querySelector(".reset")
  .addEventListener("click", () => location.reload());

loadChoices();
