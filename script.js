"strict";
const btn_shorten = document.querySelector(".btn_shorten");
const input_value = document.querySelector(".address_input");
const history_container = document.querySelector(".history_ip");
let arr = getItems();

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".resp_menu");

hamburger.addEventListener("click", mobileMenu);
function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}
const navLink = document.querySelectorAll(".resp_link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

btn_shorten.addEventListener("click", start);

async function start() {
  if (input_value.value.trim() != "" && isValidURL(input_value.value)) {
    removeError();
    btn_shorten.classList.add("button--loading");
    let body = {
      long_url: input_value.value,
      domain: "bit.ly",
    };
    let headers = {
      Authorization: "0111c501da47affbca1cd7a6778ece09b70e8e7d",
      "Content-Type": "application/json",
    };
    fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((users) => {
        htmlAdd(users);
        btn_shorten.classList.remove("button--loading");

        //Test
        arr.push(users.long_url);
        storeLink();
        //
        input_value.value = "";
        copyText();
        deleteItem();
      })
      .catch((err) => errorUI(`There is something wrong - ${err.message}`));
  } else {
    errorUI("Input Valid URL address");
  }
}

function isValidURL(url) {
  var res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );

  return res !== null;
}

function removeError() {
  input_value.classList.remove("error_holder");
  input_value.setAttribute("placeholder", "Shorten a link here...");
}
function errorUI(msg) {
  btn_shorten.classList.remove("button--loading");
  input_value.value = "";
  input_value.classList.add("error_holder");
  input_value.setAttribute("placeholder", msg);
}

function copyText() {
  let copy = document.querySelectorAll(".copy_btn");

  copy.forEach((mov, i) => {
    mov.addEventListener("click", () => {
      copy.forEach((mov) => {
        mov.classList.remove("copied");
        mov.textContent = "copy";
      });
      navigator.clipboard.writeText(mov.previousElementSibling.innerHTML);
      copy[i].textContent = "Copied!";
      copy[i].classList.add("copied");
    });
  });
}

function deleteItem() {
  let delete_btn = document.querySelectorAll(".trash_btn");

  delete_btn.forEach((btn) => {
    btn.addEventListener("click", () => {
      removeArrayItem(
        arr,
        btn.parentElement.previousElementSibling.previousElementSibling
          .textContent
      );
      btn.parentElement.parentElement.remove();
      storeLink();
    });
  });
}

function htmlAdd(users) {
  let html = ` <div class="ip">
    <div class="original_link">${users.long_url}</div>
    <div class="divider_ip"></div>
      <div class="result">
        <a href="${users.link}" class="link_result">${users.link}</a>
        <button class="copy_btn">copy</button>
        <button class="trash_btn">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-trash"
      viewBox="0 0 16 16"
    >
      <path
        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
      />
      <path
        fill-rule="evenodd"
        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
      />
    </svg>
  </button>
      </div>
      </div>`;

  history_container.innerHTML += html;
}

// Load Links in Storage on Refresh EXE
async function shortenLinkOnLoadStorage(url) {
  let body = {
    long_url: url,
    domain: "bit.ly",
  };
  let headers = {
    Authorization: "0111c501da47affbca1cd7a6778ece09b70e8e7d",
    "Content-Type": "application/json",
    access_token: "39af2b3441b33f9c9c794d8c09489001d2988106",
  };
  try {
    const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    htmlAdd(data);
    copyText();
    deleteItem();
    storeLink();
  } catch (err) {
    console.log(err);
  }
}

function getLinks() {
  arr.forEach((x) => {
    shortenLinkOnLoadStorage(x);
  });
}
const removeArrayItem = (arr, item) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].trim() == item.trim()) {
      arr.splice(i, 1);
      console.log("remove");
      break;
    }
  }
};
const storeLink = () => {
  sessionStorage.setItem("links", JSON.stringify(arr));
};

function getItems() {
  return JSON.parse(sessionStorage.getItem("links") || "[]");
}

getLinks();
