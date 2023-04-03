const keycloak = new Keycloak();

function initKeycloak(redirectUri = "", onLoad = "login-required") {
  keycloak
    .init({
      onLoad: onLoad,
      redirectUri: redirectUri,
      flow: "standard",
    })
    .then(function () {
      keycloak
      .loadUserProfile()
      .then((profile) => {
        console.log(keycloak.token)
        console.log(keycloak.idToken)
        console.log("authenticated user:", profile);  
      })
      .catch(() => {
        console.log("It's impossible to get informations from user;");
        window.location.href = "http://10.3.20.97:5500/";
      });
    })
    .catch((error) => {
      console.error("Keycloak initialization failed", error);
      window.location.reload();
    });
}

// example in login page 
function initWithcheckSSO() {
  keycloak
  .init({
    onLoad: "check-sso",
  })
  .then(function () {
    keycloak
      .loadUserProfile()
      .then((profile) => {
        console.log(keycloak.token);
        console.log("authenticated user:", profile);
      })
      .catch(() => {
        console.log("It's impossible to get informations from user;");
      });
  })
  .catch((error) => {
    console.error("Keycloak initialization failed", error);
  });
}

function getToken() {
  return keycloak.token;
}

function logout() {
  keycloak.logout({
    redirectUri: window.location.origin + "/",
  });
}

function refreshToken(){
  //Token Refresh
  setInterval(() => {
    keycloak
      .updateToken()
      .then((refreshed) => {
        if (refreshed) {
          // loadData();
          console.log(keycloak.token);
          console.log("If Refreshed Token =", refreshed);
        } else {
          console.log(
            "Token not refreshed, valid for " +
              Math.round(
                keycloak.tokenParsed.exp +
                  keycloak.timeSkew -
                  new Date().getTime() / 1000
              ) +
              " seconds"
          );
        }
      })
      .catch((err) => {
        console.log("Failed to refresh token, because = ", err);
        window.location.href = "http://10.3.20.97:5500/";
      });
  }, 30000);
}
