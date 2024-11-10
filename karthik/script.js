// Copy Referral Link Function
function copyReferralLink() {
    const referralLink = document.getElementById("referralLink");
    referralLink.select();
    document.execCommand("copy");
    alert("Referral link copied to clipboard!");
}

// Simulated User Data Storage (for demonstration only; not secure for production)
const users = JSON.parse(localStorage.getItem("users")) || [];

// Registration Function
function registerUser(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const referralCode = document.getElementById("referralCode").value || null;

    if (users.find(user => user.username === username)) {
        alert("Username already exists. Please choose a different username.");
        return;
    }

    const newUser = {
        name,
        age,
        phoneNumber,
        username,
        password,
        referralCode,
        earnings: 0,
        referrals: 0
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
}
function initiateDeposit() {
    const amount = 10000; // Amount in the smallest currency unit (e.g., 10000 paise = 100 INR)
    const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual API key
        amount: amount,
        currency: "INR",
        name: "Network Marketing Site",
        description: "Add funds to your account",
        image: "https://yourwebsite.com/logo.png", // Optional
        handler: function (response) {
            // Handle the successful payment response here
            console.log("Payment ID:", response.razorpay_payment_id);
            console.log("Order ID:", response.razorpay_order_id);
            console.log("Signature:", response.razorpay_signature);

            // Update balance on the frontend
            updateBalance(amount);
        },
        prefill: {
            name: "User Name", // Prefill user name
            email: "user@example.com", // Prefill email if available
            contact: "1234567890" // Prefill phone number if available
        },
        theme: {
            color: "#3399cc"
        }
    };

    const paymentObject = new Razorpay(options);
    paymentObject.open();
}

function updateBalance(amount) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    loggedInUser.earnings += amount / 100; // Convert from paise to INR
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    document.getElementById("earnings").innerText = `?${loggedInUser.earnings.toFixed(2)}`;
    alert("Deposit successful! Your new balance is ?" + loggedInUser.earnings.toFixed(2));
}


// Login Function
function loginUser(event) {
    event.preventDefault();
    
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid username or password. Please try again.");
    }
}

// Initialize Dashboard
function initDashboard() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (!loggedInUser) {
        alert("You need to log in to access the dashboard.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userReferralCode").innerText = loggedInUser.username;
    document.getElementById("earnings").innerText = `$${loggedInUser.earnings.toFixed(2)}`;
    document.getElementById("referrals").innerText = loggedInUser.referrals;
    document.getElementById("referralLink").value = `https://yourwebsite.com/register?ref=${loggedInUser.username}`;
}
// Function to toggle between Light and Dark mode
function toggleTheme() {
    const root = document.documentElement;

    // Switch to Dark mode
    if (root.style.getPropertyValue('--primary-color') === '#4CAF50') {
        root.style.setProperty('--primary-color', '#333');
        root.style.setProperty('--secondary-color', '#4CAF50');
        root.style.setProperty('--background-color', '#333');
        root.style.setProperty('--text-color', '#f2f2f2');
        root.style.setProperty('--card-shadow', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--hover-card-shadow', 'rgba(255, 255, 255, 0.15)');
    } 
    // Switch to Light mode
    else {
        root.style.setProperty('--primary-color', '#4CAF50');
        root.style.setProperty('--secondary-color', '#333');
        root.style.setProperty('--background-color', '#f2f2f2');
        root.style.setProperty('--text-color', '#333');
        root.style.setProperty('--card-shadow', 'rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--hover-card-shadow', 'rgba(0, 0, 0, 0.15)');
    }
}


// Call this function to toggle the theme based on user action, e.g., a button click
document.addEventListener("DOMContentLoaded", () => {
    const themeToggleButton = document.createElement("button");
    themeToggleButton.innerText = "Toggle Theme";
    themeToggleButton.onclick = toggleTheme;
    themeToggleButton.style.position = "fixed";
    themeToggleButton.style.bottom = "20px";
    themeToggleButton.style.right = "20px";
    themeToggleButton.style.padding = "10px 20px";
    themeToggleButton.style.backgroundColor = "var(--primary-color)";
    themeToggleButton.style.color = "white";
    themeToggleButton.style.border = "none";
    themeToggleButton.style.borderRadius = "5px";
    themeToggleButton.style.cursor = "pointer";
    document.body.appendChild(themeToggleButton);
});

// Deposit Funds Function (simulated)
function initiateDeposit() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    loggedInUser.earnings += 100; // Simulating deposit
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    localStorage.setItem("users", JSON.stringify(users.map(user => user.username === loggedInUser.username ? loggedInUser : user)));

    alert("Deposit successful! Your new earnings balance is $" + loggedInUser.earnings.toFixed(2));
    document.getElementById("earnings").innerText = `$${loggedInUser.earnings.toFixed(2)}`;
}

// Attach event listeners when the document loads
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("registerForm")) {
        document.getElementById("registerForm").addEventListener("submit", registerUser);
    }
    
    if (document.getElementById("loginForm")) {
        document.getElementById("loginForm").addEventListener("submit", loginUser);
    }
    
    if (window.location.pathname.includes("dashboard.html")) {
        initDashboard();
    }
});
