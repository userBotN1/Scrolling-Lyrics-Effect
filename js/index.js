const doms = {
  audio: document.querySelector("audio"),
  container: document.querySelector(".container"),
  ul: document.querySelector(".container ul"),
};

/**
 * This function parses the given string timestamp and returns a number in seconds.
 *
 * @param {string} timeStr - A timestamp in format XX:YY.ZZ, where XX is minutes, YY is seconds, and ZZ is milliseconds
 * @returns {number} - The given timestamp as a number in seconds
 */
function parseTime(timeStr) {
  const parts = timeStr.split(":");
  return +parts[0] * 60 + +parts[1];
}

/**
 * This function parses the given string lyrics and returns an array of objects, in format {time: number, content: string}.
 *
 * @param {string} data - The raw lyrics with timestamp
 * @returns {array} - An array of objects {time: number, content: string}
 */
function parseLyrics(data) {
  const arr = [];
  const lines = data.split("\n");

  lines.forEach(function (element) {
    const parts = element.split("]");
    const timeStr = parts[0].substring(1);

    const obj = { time: parseTime(timeStr), content: parts[1] };
    arr.push(obj);
  });

  return arr;
}

/**
 * This function finds the index of the current lyrics.
 *
 * @param {array} lyricsData - An array of objects in the format {time: number, content: string} representing lyrics
 * @returns {number} - An index indicating the current lyrics
 */
function findIndex(lyricsData) {
  const currentTime = doms.audio.currentTime;
  for (let i = 0; i < lyricsData.length; i++) {
    if (currentTime < lyricsData[i].time) {
      return i - 1;
    }
  }
  return lyricsData.length - 1;
}

// ---------- Interface ----------

/**
 * This function creates a <li> element for each line of the lyrics and append it html.
 *
 *  @param {array} lyricsData - An array of objects in the format {time: number, content: string} representing lyrics
 */
function createLyrics(lyricsData) {
  const fragment = document.createDocumentFragment();

  lyricsData.forEach(function (element) {
    const li = document.createElement("li");
    li.textContent = element.content;
    fragment.append(li);
  });

  doms.ul.appendChild(fragment);
}

let userHasScrolled = false;
doms.container.addEventListener("scroll", () => (userHasScrolled = true));

// window.onscroll = function (e) {
//   // userHasScrolled = true;
//   console.log("HELLO");
// };

/**
 * This function implements the scrolling lyrics effect.
 */
function setOffset() {
  userHasScrolled = false;
  //   console.log("setOff");

  if (userHasScrolled) {
    // user is scrolling
    console.log("user is scrolling");
  }

  const lyricsData = this.lyricsData;
  const liHeight = this.liHeight;
  const index = findIndex(lyricsData);

  //   doms.container.addEventListener("scroll", function () {
  //     // user scrolling, override auto scrolling
  //     console.log("user scrolling");
  //   });

  const heightToTop = index * liHeight + liHeight / 2; // height from top of <ul> to the current lyrics
  let offset = heightToTop;

  let currentLine = doms.ul.querySelector(".active");
  if (currentLine) {
    currentLine.classList.remove("active");
  }

  currentLine = doms.ul.children[index];
  if (currentLine) {
    currentLine.classList.add("active");
  }

  doms.ul.style.transform = `translateY(-${offset}px)`;
}

function init() {
  const lyricsData = parseLyrics(rawLyrics);
  createLyrics(lyricsData);

  // Calculate li height outside of createOffset() for efficiency. Doing the dom selection inside the function would cause reflow as they are getting size and position on the webpage
  const liHeight = doms.ul.children[0].clientHeight;

  //   console.log(lyricsData);

  const datas = {
    lyricsData: lyricsData,
    liHeight: liHeight,
  };

  doms.audio.addEventListener("timeupdate", setOffset.bind(datas));
}

init();
