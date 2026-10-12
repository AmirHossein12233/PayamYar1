const nameInput = document.querySelector("#username");
const saveName = document.querySelector("#saveName");
const profileStatus = document.querySelector("#profileStatus");
const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const chatPanel = document.querySelector("#chatPanel");
const callPanel = document.querySelector("#callPanel");

let displayName = "";

saveName.addEventListener("click", () => {
  const value = nameInput.value.trim();
  if (!value) {
    profileStatus.textContent = "اول یک نام وارد کن.";
    return;
  }
  displayName = value;
  profileStatus.textContent = `نام نمایشی ذخیره شد: ${displayName}`;
});

document.querySelector("#messagesButton").addEventListener("click", () => {
  chatPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  messageInput.focus();
});

document.querySelector("#callsButton").addEventListener("click", () => {
  callPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = messageInput.value.trim();
  if (!value) return;

  if (!displayName) {
    profileStatus.textContent = "برای فرستادن پیام آزمایشی، اول نامت را ذخیره کن.";
    nameInput.focus();
    return;
  }

  const empty = messages.querySelector(".empty");
  if (empty) empty.remove();

  const bubble = document.createElement("div");
  bubble.className = "message";

  const sender = document.createElement("small");
  sender.textContent = displayName;

  const body = document.createElement("div");
  body.textContent = value;

  bubble.append(sender, body);
  messages.appendChild(bubble);
  messageInput.value = "";
  messages.scrollTop = messages.scrollHeight;
});

document.querySelector("#callInfo").addEventListener("click", () => {
  document.querySelector("#callStatus").textContent =
    "هنوز تماس برقرار نمی‌شود؛ در مرحله بعد اتصال آنلاین و صدای WebRTC را پیاده‌سازی می‌کنیم.";
});
