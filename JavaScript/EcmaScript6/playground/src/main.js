class Blog {
  constructor() {
    this.setInitVariables();
    this.registerEvents();
    this.likedSet = new Set();
  }

  setInitVariables() {
    this.blogList = document.querySelector(".blogList > ul");
  }

  registerEvents() {
    const dataURL = "../data/data.json";
    const startBtn = document.querySelector(".start");

    startBtn.addEventListener("click", () => {
      this.setInitData(dataURL);
    });

    this.blogList.addEventListener("click", ({ target }) => {
      const { className: targetClassName } = target;
      if (targetClassName !== "like" && targetClassName !== "unlike") return;

      const postTitle = target.previousElementSibling.textContent; // 옆에 있는 엘리먼트의 텍스트를 가지고 온다.

      // 찜 취소를 클릭한 경우, 찜하기로 다시 변경하고, 찜 목록을 제고하고 찜 목록뷰를 렌더링한다.
      if (targetClassName === "unlike") {
        target.className = "like";
        target.innerText = "찜하기";
        this.likedSet.delete(postTitle);
      } else {
        // 찜하기 된 목록(div)의 버튼 클래스를 like에서 unlike로 변경
        target.className = "unlike";
        target.innerText = "찜취소";
        // 찜 목록에 추가
        this.likedSet.add(postTitle); // set은 중복된 데이터를 넣지 않으므로 중복 데이터는 없다.
      }

      // 내 찜 목록 UI 추가
      this.updateLikedList();
    });
  }

  updateLikedList() {
    const ul = document.querySelector(".like-list > ul");
    let likedSum = "";
    // li태그에 찜 리스트를 넣고 한번의 innerHTML을 사용한다.
    this.likedSet.forEach((v) => {
      likedSum += `<li>${v}</li>`;
    });
    ul.innerHTML = likedSum;
  }

  setInitData(dataURL) {
    this.getData(dataURL, this.insertPosts.bind(this));
  }

  getData(dataURL, fn) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", () => {
      const list = JSON.parse(oReq.responseText).body;
      fn(list);
    });
    oReq.open("GET", dataURL);
    oReq.send();
  }

  insertPosts(list) {
    const li = list
      .map(
        (v) => `<li>
        <a href=${v.link}>${v.title}</a>
        <div class="like">찜하기</div>
      </li>`
      )
      .join("");
    this.blogList.innerHTML += li;
  }
}
export default Blog;
