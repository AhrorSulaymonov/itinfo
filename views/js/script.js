async function getAuthors() {
  let accessToken = localStorage.getItem("accessToken");
  let salom = localStorage.getItem("message");
  console.log("salom", salom);

  console.log("accessToken: ", accessToken);
  const accessTokenExpTime = getTokenExpiration(accessToken);
  console.log("accessTokenExpTime: ", accessTokenExpTime);

  if (accessTokenExpTime) {
    const currentTime = new Date();
    if (currentTime < accessTokenExpTime) {
      console.log("Access token Faol");
    } else {
      console.log("Access token vaqti chiqib ketdi");
      accessToken = await refreshTokenFunc();
      console.log("NewAccessToken", accessToken);
    }
  }

  await fetch("http://45.138.158.157:3030/api/author/all", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Request failed with status: " + response.status);
      }
    })
    .then((author) => {
      console.log(author.authors);
      displayAuthor(author.authors);
    })
    .catch((error) => {
      console.error("Error", error);
    });
}

function getTokenExpiration(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  if (decodedToken.exp) {
    return new Date(decodedToken.exp * 1000);
  }
  return null;
}

function displayAuthor(authors) {
  const authorcards = document.getElementById("cardWrapper");
  authors.forEach((author) => {
    authorcards.innerHTML =
      authorcards.innerHTML +
      `<div class="card" style="width: 18rem;">
        <img src="./images/for_author.png" class="card-img-top" alt="Salomat" />
        <div class="card-body">
            <h5 class="card-title">${author.author_first_name} ${author.author_last_name}</h5>
            <p class="card-text">email: ${author.author_email} phone: ${author.author_phone} </p>
         </div>
        </div>`;
  });
}

async function refreshTokenFunc() {
  try {
    const response = await fetch(
      "http://45.138.158.157:3030/api/author/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("data error refreshtoken", data.error);
    console.log("data refreshtoken", data);

    if (data.error && data.error == "jwt expired") {
      console.log("Refresh tokkenni ham vaqti chiqib ketdi");
      return window.location.replace("/login");
    }
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.log("Refreshtoken: ", error);
    return window.location.replace("/login");
  }
}
