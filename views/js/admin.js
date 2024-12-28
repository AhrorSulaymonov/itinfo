async function getAdmins() {
  let admin_accessToken = localStorage.getItem("admin_accessToken");
  console.log("admin_accessToken: ", admin_accessToken);
  const accessTokenExpTime = getTokenExpiration(admin_accessToken);
  console.log("accessTokenExpTime: ", accessTokenExpTime);

  if (accessTokenExpTime) {
    const currentTime = new Date();
    if (currentTime < accessTokenExpTime) {
      console.log("admin_accessToken token Faol");
    } else {
      console.log("admin_accessToken token vaqti chiqib ketdi");
      admin_accessToken = await adminRefreshTokenFunc();
      console.log("NewAccessToken", admin_accessToken);
    }
  }

  if (!isCreator(admin_accessToken)) {
    return console.log("Admin creator emas");
  }

  await fetch("http://45.138.158.157:3030/api/admin/all", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${admin_accessToken}`,
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
    .then((admin) => {
      displayAdmin(admin.admins);
    })
    .catch((error) => {
      console.log("Error", error);
    });
}

function getTokenExpiration(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  if (decodedToken.exp) {
    return new Date(decodedToken.exp * 1000);
  }
  return null;
}

function isCreator(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  return decodedToken.admin_is_creator;
}

async function adminRefreshTokenFunc() {
  try {
    const response = await fetch(
      "http://45.138.158.157:3030/api/admin/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.error && data.error == "jwt expired") {
      console.log("Refresh tokkenni ham vaqti chiqib ketdi");
      return window.location.replace("/loginAdmin");
    }
    localStorage.setItem("admin_accessToken", data.admin_accessToken);
    return data.admin_accessToken;
  } catch (error) {
    console.log("admin_refreshToken: ", error);
    return window.location.replace("/loginAdmin");
  }
}

function displayAdmin(admins) {
  const admincards = document.getElementById("cardWrapper");
  admins.forEach((admin) => {
    admincards.innerHTML =
      admincards.innerHTML +
      `<div class="card" style="width: 18rem;">
        <img src="./images/for_admin.png" class="card-img-top" alt="Salomat" />
        <div class="card-body">
            <h5 class="card-title">${admin.admin_name}</h5>
            <p class="card-text">email: ${admin.admin_email} phone: ${admin.admin_phone} </p>
         </div>
        </div>`;
  });
}
