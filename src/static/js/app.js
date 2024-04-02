const main = document.getElementById("main");

window.addEventListener("load", (e) => {
  loadTopics();
});

async function loadTopics() {
  const res = await fetch(`https://cnodejs.org/api/v1/topics`);
  const json = await res.json();
  main.innerHTML = await json.data.map(createTopic).join("\n");
}

function createTopic(topic) {
  return `
    <div class="topic">
      <img src="${topic.author.avatar_url}" alt=""/>
      <div class="title" onclick="createArticle('${topic.id}')">${topic.title}</div>
    </div>
  `;
}

function createArticle(id) {
  const res = fetch(`https://cnodejs.org/api/v1/topic/${id}`);
  res.then(async (res) => {
    const article = await res.json();
    console.log(article);
    const newWindow = window.open("", "_blank");
    newWindow.document.body.innerHTML = `
      <div class="article">
        <img src="${article.data.author.avatar_url}" alt=""/>
        <div class="title">${article.data.title}</div>
        <div class="content">${article.data.content}</div>
      </div>
    `;
  });
}

window.addEventListener("load", (e) => {
  loadTopics();
  // 注册 serviceWorker
  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker.register("static/js/sw.js");
      console.log("serviceWorker register success!");
    } catch (error) {
      console.log("serviceWorker register failure!");
    }
  }
});
