document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connect-btn");
    const createAccountBtn = document.getElementById("create-account-btn");
    const loginModalContainer = document.getElementById("login-modal-container");
    const createAccountModalContainer = document.getElementById("create-account-modal-container");

    // Charge le contenu du formulaire de connexion depuis le fichier
    fetch("login.html")
        .then(response => response.text())
        .then(data => {
            loginModalContainer.innerHTML = data;
            const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
            
            // Afficher le modal lorsque le bouton est cliqué
            connectBtn.addEventListener("click", () => {
                loginModal.show();
            });

            // Handle login form submission
            const loginForm = document.getElementById("loginForm");
            loginForm.addEventListener("submit", (event) => {
                event.preventDefault();  // Prevent default form submission
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;

                // Send login data to backend
                fetch("http://localhost:3000/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.token) {
                        // Stocke le token dans localStorage
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('role', data.role);
                        console.log('User logged in successfully');
                    } else {
                        console.log('Login failed');
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("An error occurred. Please try again.");
                });
            });
        })
        .catch(error => {
            console.error("Error loading login form:", error);
        });

    // Charger le formulaire de création de compte
    fetch("create-account.html")
        .then(response => response.text())
        .then(data => {
            createAccountModalContainer.innerHTML = data;
            const createAccountModal = new bootstrap.Modal(document.getElementById("createAccountModal"));
            
            // Afficher le modal de création de compte lorsque le bouton est cliqué
            createAccountBtn.addEventListener("click", () => {
                createAccountModal.show();

                // Initialiser les éléments après le chargement du contenu du modal de création de compte
                const clientBtn = document.getElementById("client-btn");
                const cooperativeBtn = document.getElementById("cooperative-btn");
                const clientForm = document.getElementById("client-form");
                const cooperativeForm = document.getElementById("cooperative-form");

                // Affiche le formulaire CLIENT par défaut et masque le formulaire COOPERATIVE
                clientForm.style.display = "block";
                cooperativeForm.style.display = "none";
                clientBtn.classList.add("active");

                // Fonction pour basculer entre les formulaires
                clientBtn.addEventListener("click", () => {
                    cooperativeForm.style.display = "none";
                    clientForm.style.display = "block";
                    cooperativeBtn.classList.remove("active");
                    clientBtn.classList.add("active");
                });

                cooperativeBtn.addEventListener("click", () => {
                    clientForm.style.display = "none";
                    cooperativeForm.style.display = "block";
                    clientBtn.classList.remove("active");
                    cooperativeBtn.classList.add("active");
                });

                // Form submission handling
                clientForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    const clientData = {
                        mail: document.getElementById("client-email").value,
                        name: document.getElementById("client-name").value,
                        lastname: document.getElementById("client-prenom").value,
                        password: document.getElementById("client-password").value,
                        role: "CLIENT",
                        cin: document.getElementById("client-cin").value,
                        num_tel: document.getElementById("client-tel").value,
                        close_num: document.getElementById("client-tel-proche").value
                    };
                    sendSignupData(clientData, "Client");
                });

                cooperativeForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    const cooperativeData = {
                        mail: document.getElementById("cooperative-email").value,
                        password: document.getElementById("cooperative-password").value,
                        role: "COOPERATIVE",
                        name: document.getElementById("cooperative-name").value,
                        num_tel: document.getElementById("cooperative-tel").value,
                        nif: document.getElementById("cooperative-nif").value,
                        stat: document.getElementById("cooperative-stat").value,
                        centre: document.getElementById("cooperative-centre").value
                    };
                    sendSignupData(cooperativeData, "Cooperative");
                });
            });
        })
        .catch(error => {
            console.error("Error loading account creation form:", error);
        });

    const sendSignupData = async (data, userType) => {
        try {
            const response = await fetch("http://localhost:3000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                alert(`${userType} account created successfully!`);
            } else {
                alert(result.message || "Error creating account");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error creating account");
        }
    };
});
