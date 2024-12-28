const div = document.getElementById("cardWrapper");

(async function () {
  try {
    const response = await fetch("http://45.138.158.157:3030/api/topic/all");
    if (!response.ok) {
      throw new Error(`HTTP xato: ${response.status}`);
    }
    const data = await response.json();
    if (data.topics.length == 0) {
      return (div.innerHTML = `<div class="card" style="width: 18rem;">
        <img src="./images/for_author.png" class="card-img-top" alt="Salomat" />
        <div class="card-body">
            <h5 class="card-title">Title: None</h5>
            <p class="card-text">text: none </p>
         </div>
        </div>`);
    }
    for (const topic of data.topics) {
      div.innerHTML =
        div.innerHTML +
        `<div class="card" style="width: 18rem;">
        <img src="./images/for_topic.png" class="card-img-top" alt="Salomat" />
        <div class="card-body">
            <h5 class="card-title">Title: ${topic.topic_title}</h5>
            <p class="card-text">Text: ${topic.topic_text}</p>
         </div>
        </div>`;
    }
  } catch (error) {
    console.error("Xatolik yuzaga kelidi ", error);
  }
})();
