const socket = io();

const enterRoom = document.getElementById("enterRoom");
const enterRoomForm = enterRoom.querySelector("form");
const nickname = document.getElementById("nickname");
const nicknameForm = nickname.querySelector("form");
const sendMessage = document.getElementById("sendMessage");
const sendMessageForm = sendMessage.querySelector("form");

enterRoom.hidden = false;
nickname.hidden = false;
sendMessage.hidden = true;

enterRoom.querySelector("h2").hidden = true;

let roomName;

function roomTitle(count) {
  const h3 = sendMessage.querySelector("h3");
  let msg = count === 1 ? `user` : `users`;
  msg = `Room ${roomName} [ ${count} ${msg} joined ]`;
  h3.innerText = msg;
}

function addMessage(msg) {
  const ul = sendMessage.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.emit("nickname", input.value);
  input.value = "";
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = sendMessageForm.querySelector("input");
  const value = input.value;
  socket.emit("message", roomName, input.value, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom(count) {
  enterRoom.hidden = true;
  sendMessage.hidden = false;

  roomTitle(count);

  sendMessageForm.addEventListener("submit", handleMessageSubmit);
}

function enterRoomEmit(room) {
  socket.emit("enter_room", room, showRoom);
}

function handleEnterSubmit(event) {
  event.preventDefault();
  const input = enterRoomForm.querySelector("input");
  roomName = input.value;
  enterRoomEmit(roomName);
  input.value = "";
}

socket.on("welcome", (me, count) => {
  roomTitle(count);

  addMessage(`${me} Joined!`);
});

socket.on("bye", (me, count) => {
  roomTitle(count);

  addMessage(`${me} Left!`);
});

socket.on("message", addMessage);

socket.on("room_change", (publicRooms) => {
  const roomList = enterRoom.querySelector("ul");
  roomList.innerHTML = "";
  if (publicRooms.length === 0) {
    enterRoom.querySelector("h2").hidden = true;
    return;
  } else {
    enterRoom.querySelector("h2").hidden = false;
  }

  const li = document.createElement("li");
  publicRooms.forEach((room) => {
    li.innerText = room;
    roomList.append(li);
  });
  /*
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.innerText = "Enter";
  publicRooms.forEach((room) => {
    li.innerText = room;
    btn.value = room;
    li.appendChild(btn);
    roomList.append(li);
  });
  btn.addEventListener("click", (event) => {
    const value = event.target.value;
    const roomName = JSON.stringify(value);
    enterRoomEmit(roomName);
  });
  */
});

enterRoomForm.addEventListener("submit", handleEnterSubmit);
nicknameForm.addEventListener("submit", handleNickSubmit);
