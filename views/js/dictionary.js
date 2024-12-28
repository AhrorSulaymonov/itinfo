const div = document.getElementById("cardWrapper");

(async function () {
  try {
    const response = await fetch("http://45.138.158.157:3030/api/dict/all");
    if (!response.ok) {
      throw new Error(`HTTP xato: ${response.status}`);
    }
    const data = await response.json();
    if (data.terms.length == 0) {
      iv.innerHTML = `<div class="card" style="width: 18rem;">
        <img src="./images/for_termin.png" class="card-img-top" alt="Salomat" />
        <div class="card-body">
            <h5 class="card-title">Term: None</h5>
            <p class="card-text">letter: none </p>
         </div>
        </div>`;
    }
    for (const term of data.terms) {
      div.innerHTML =
        div.innerHTML +
        `<div class="card" style="width: 18rem;">
        <img src="./images/for_termin.png" class="card-img-top" alt="Salomat" />
        <div class="card-body">
            <h5 class="card-title">${term.term}</h5>
            <p class="card-text">letter: ${term.letter} </p>
         </div>
        </div>`;
    }
  } catch (error) {
    console.error("Xatolik yuzaga kelidi ", error);
  }
})();
