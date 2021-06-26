# 실시간 채팅방 구조 잡기

### 프로젝트 구조 갖추기

- 필요 패키지 설치 후 스키마 작성

  ```bash
  $ npm i mongoose multer axios color-hash
  ```

  - `color-hash`는 익명 닉네임에 컬러를 줄 때 사용한다.

### 스키마 연결하기

- 스키마를 index.js와 연결
  - 익스프레스와 몽구스를 연결
  - .env 파일에 비밀키 입력
- `.env`

  ```
  COOKIE_SECRET=gifchat
  MONGO_ID=root
  MONGO_PASSWORD=1234
  ```

  `app.js`

  ```jsx
  // ...
  const connect = require("./schemas");
  const webSocket = require("./socket");
  const indexRouter = require("./routes");

  const app = express();
  app.set("port", process.env.PORT || 8005);
  app.set("view engine", "html");
  nunjucks.configure("views", {
    express: app,
    watch: true
  });
  connect();
  // ...
  ```

  `schemas/index.js`

  ```jsx
  const mongoose = require("mongoose");
  const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
  const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

  const connect = () => {
    if (NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }
    mongoose.connect(
      MONGO_URL,
      {
        dbName: "gifchat",
        useNewUrlParser: true,
        useCreateIndex: true
      },
      (error) => {
        if (error) {
          console.log("몽고디비 연결 에러", error);
        } else {
          console.log("몽고디비 연결 성공");
        }
      }
    );
  };

  mongoose.connection.on("error", (error) => {
    console.error("몽고디비 연결 에러", error);
  });
  mongoose.connection.on("disconnected", () => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
    connect();
  });

  module.exports = connect;
  ```

### 프론트엔드 파일 작성

- views/layout.html, public/main.css, views/main.html, views/room.html, views/chat.html 작성
- main.html의 코드에서 io.connect의 주소가 달라졌다는 점에 주목하자
- 주소의 /room은 네임스페이스(같은 네임스페이스끼리만 데이터 전달 가능)
- socket에는 newRoom(새 방 생성 시 목록에 방 추가 이벤트)과 removeRoom(방 폭파 시 목록에서 방 제거 이벤트) 이벤트 연결
- chat.html에서는 /chat 네임스페이스에 연결
- join 이벤트(방에 참가할 때 들어왔다는 시스템 메시지 등록)와 exit 이벤트(방에서 나갈 때 나갔다는 시스템 메시지 등록) 연결
- `views/layout.html`

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>{{title}}</title>
      <link rel="stylesheet" href="/main.css" />
    </head>
    <body>
      {% block content %} {% endblock %} {% block script %} {% endblock %}
    </body>
  </html>
  ```

  `views/main.html`

  ```html
  {% extends 'layout.html' %} {% block content %}
  <h1>GIF 채팅방</h1>
  <fieldset>
    <legend>채팅방 목록</legend>
    <table>
      <thead>
        <tr>
          <th>방 제목</th>
          <th>종류</th>
          <th>허용 인원</th>
          <th>방장</th>
        </tr>
      </thead>
      <tbody>
        {% for room in rooms %}
        <tr data-id="{{room._id}}">
          <td>{{room.title}}</td>
          <td>{{'비밀방' if room.password else '공개방'}}</td>
          <td>{{room.max}}</td>
          <td style="color: {{room.owner}}">{{room.owner}}</td>
          <td>
            <button data-password="{{'true' if room.password else 'false'}}" data-id="{{room._id}}" class="join-btn">
              입장
            </button>
          </td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
    <div class="error-message">{{error}}</div>
    <a href="/room">채팅방 생성</a>
  </fieldset>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io.connect("http://localhost:8005/room", {
      // 네임스페이스
      path: "/socket.io"
    });

    socket.on("newRoom", function (data) {
      // 새 방 이벤트 시 새 방 생성
      const tr = document.createElement("tr");
      let td = document.createElement("td");
      td.textContent = data.title;
      tr.appendChild(td);
      td = document.createElement("td");
      td.textContent = data.password ? "비밀방" : "공개방";
      tr.appendChild(td);
      td = document.createElement("td");
      td.textContent = data.max;
      tr.appendChild(td);
      td = document.createElement("td");
      td.style.color = data.owner;
      td.textContent = data.owner;
      tr.appendChild(td);
      td = document.createElement("td");
      const button = document.createElement("button");
      button.textContent = "입장";
      button.dataset.password = data.password ? "true" : "false";
      button.dataset.id = data._id;
      button.addEventListener("click", addBtnEvent);
      td.appendChild(button);
      tr.appendChild(td);
      tr.dataset.id = data._id;
      document.querySelector("table tbody").appendChild(tr); // 화면에 추가
    });

    socket.on("removeRoom", function (data) {
      // 방 제거 이벤트 시 id가 일치하는 방 제거
      document.querySelectorAll("tbody tr").forEach(function (tr) {
        if (tr.dataset.id === data) {
          tr.parentNode.removeChild(tr);
        }
      });
    });

    function addBtnEvent(e) {
      // 방 입장 클릭 시
      if (e.target.dataset.password === "true") {
        const password = prompt("비밀번호를 입력하세요");
        location.href = "/room/" + e.target.dataset.id + "?password=" + password;
      } else {
        location.href = "/room/" + e.target.dataset.id;
      }
    }

    document.querySelectorAll(".join-btn").forEach(function (btn) {
      btn.addEventListener("click", addBtnEvent);
    });
  </script>
  {% endblock %} {% block script %}
  <script>
    window.onload = () => {
      if (new URL(location.href).searchParams.get("error")) {
        alert(new URL(location.href).searchParams.get("error"));
      }
    };
  </script>
  {% endblock %}
  ```

  `views/room.html`

  ```html
  {% extends 'layout.html' %} {% block content %}
  <fieldset>
    <legend>채팅방 생성</legend>
    <form action="/room" method="post">
      <div>
        <input type="text" name="title" placeholder="방 제목" />
      </div>
      <div>
        <input type="number" name="max" placeholder="수용 인원(최소 2명)" min="2" value="10" />
      </div>
      <div>
        <input type="password" name="password" placeholder="비밀번호(없으면 공개방)" />
      </div>
      <div>
        <button type="submit">생성</button>
      </div>
    </form>
  </fieldset>
  {% endblock %}
  ```

  `views/chat.html`

  ```html
  {% extends 'layout.html' %} {% block content %}
  <h1>{{title}}</h1>
  <a href="/" id="exit-btn">방 나가기</a>
  <fieldset>
    <legend>채팅 내용</legend>
    <div id="chat-list">
      {% for chat in chats %} {% if chat.user === user %}
      <div class="mine" style="color: {{chat.user}}">
        <div>{{chat.user}}</div>
        {% if chat.gif %}}
        <img src="/gif/{{chat.gif}}" />
        {% else %}
        <div>{{chat.chat}}</div>
        {% endif %}
      </div>
      {% elif chat.user === 'system' %}
      <div class="system">
        <div>{{chat.chat}}</div>
      </div>
      {% else %}
      <div class="other" style="color: {{chat.user}}">
        <div>{{chat.user}}</div>
        {% if chat.gif %}
        <img src="/gif/{{chat.gif}}" />
        {% else %}
        <div>{{chat.chat}}</div>
        {% endif %}
      </div>
      {% endif %} {% endfor %}
    </div>
  </fieldset>
  <form action="/chat" id="chat-form" method="post" enctype="multipart/form-data">
    <label for="gif">GIF 올리기</label>
    <input type="file" id="gif" name="gif" accept="image/gif" />
    <input type="text" id="chat" name="chat" />
    <button type="submit">전송</button>
  </form>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io.connect("http://localhost:8005/chat", {
      path: "/socket.io"
    });
    socket.on("join", function (data) {
      const div = document.createElement("div");
      div.classList.add("system");
      const chat = document.createElement("div");
      div.textContent = data.chat;
      div.appendChild(chat);
      document.querySelector("#chat-list").appendChild(div);
    });
    socket.on("exit", function (data) {
      const div = document.createElement("div");
      div.classList.add("system");
      const chat = document.createElement("div");
      div.textContent = data.chat;
      div.appendChild(chat);
      document.querySelector("#chat-list").appendChild(div);
    });
  </script>
  {% endblock %}
  ```
