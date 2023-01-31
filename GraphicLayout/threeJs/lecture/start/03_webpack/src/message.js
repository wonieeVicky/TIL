export function message(msg) {
  const elem = document.createElement("p");
  elem.innerHTML = msg;
  document.body.append(elem);
}
