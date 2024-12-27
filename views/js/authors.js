const div = document.getElementById("cardWrapper");

(async function () {
  try {
    const response = await fetch("http://45.138.158.157:3030/api/author/all");
    if (!response.ok) {
      throw new Error(`HTTP xato: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    if (data.authors.length == 0) {
      return (div.innerHTML = `<div class="card" style="width: 18rem;">
        <img src="./images/for_author.png" class="card-img-top" alt="Salomat" />
        <div class="card-body">
            <h5 class="card-title">Author: None</h5>
            <p class="card-text">email: none phone: none </p>
         </div>
        </div>`);
    }
    for (const author of data.authors) {
      div.innerHTML =
        div.innerHTML +
        `<div class="card" style="width: 18rem;">
        <img src="./images/for_author.png" class="card-img-top" alt="Salomat" />
        <div class="card-body">
            <h5 class="card-title">${author.author_first_name} ${author.author_last_name}</h5>
            <p class="card-text">email: ${author.author_email} phone: ${author.author_phone} </p>
         </div>
        </div>`;
    }
  } catch (error) {
    console.error("Xatolik yuzaga kelidi ", error);
  }
})();
