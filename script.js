// Global variables
let generatedOTP;
let userData;
let otpTimer;
let timeLeft = 120; // 2 minutes for OTP

// Navigation
function scrollToForm() {
    document.getElementById("register").scrollIntoView({ behavior: "smooth" });
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

// Tab functionality for workshops
function openTab(day) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(day).classList.add('active');
    
    // Activate clicked button
    event.target.classList.add('active');
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId !== '#') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Send OTP
function sendOTP() {
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const city = document.getElementById("city").value.trim();
    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value;

    // Validation
    if (!name || !mobile) {
        alert("Please fill in all required fields (Name and Mobile Number)");
        return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
        alert("Please enter a valid 10-digit mobile number");
        return;
    }

    if (email && !validateEmail(email)) {
        alert("Please enter a valid email address");
        return;
    }

    // Generate OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000);
    
    // Store user data
    userData = {
        name: name,
        mobile: mobile,
        email: email || "Not provided",
        city: city || "Not provided",
        company: company || "Not provided",
        role: role || "Not specified",
        timestamp: new Date().toISOString()
    };

    // Show OTP in alert (simulating SMS)
    alert(`OTP sent to ${mobile}\nYour OTP is: ${generatedOTP}\n\nNote: This is a demo. In production, OTP would be sent via SMS.`);

    // Switch to OTP step
    document.getElementById("step1").classList.remove("active");
    document.getElementById("step2").classList.add("active");
    
    // Start OTP timer
    startOTPTimer();
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Start OTP timer
function startOTPTimer() {
    clearInterval(otpTimer);
    timeLeft = 120;
    
    const timerDisplay = document.getElementById("otpTimer");
    timerDisplay.textContent = formatTime(timeLeft);
    
    otpTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(otpTimer);
            alert("OTP has expired. Please request a new one.");
            document.getElementById("step2").classList.remove("active");
            document.getElementById("step1").classList.add("active");
        }
    }, 1000);
}

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Resend OTP
function resendOTP() {
    if (timeLeft > 100) {
        alert("Please wait before requesting a new OTP");
        return;
    }
    
    generatedOTP = Math.floor(100000 + Math.random() * 900000);
    alert(`New OTP sent to ${userData.mobile}\nYour OTP is: ${generatedOTP}`);
    
    // Reset timer
    startOTPTimer();
}

// Verify OTP
function verifyOTP() {
    const enteredOTP = document.getElementById("otpInput").value.trim();

    if (!enteredOTP) {
        alert("Please enter the OTP");
        return;
    }

    if (enteredOTP == generatedOTP) {
        clearInterval(otpTimer);
        
        // Generate registration ID
        const regId = "SUMMIT-" + Date.now().toString().slice(-6);
        userData.regId = regId;

        // Save to localStorage
        let registrations = JSON.parse(localStorage.getItem("startupRegistrations")) || [];
        registrations.push(userData);
        localStorage.setItem("startupRegistrations", JSON.stringify(registrations));

        // Display success
        document.getElementById("regIdDisplay").textContent = regId;
        document.getElementById("step2").classList.remove("active");
        document.getElementById("step3").classList.add("active");
        
        // Generate QR Code (simulated)
        generateQRCode(regId);
        
        // Scroll to success section
        document.getElementById("register").scrollIntoView({ behavior: "smooth" });
        
    } else {
        alert("Invalid OTP. Please try again.");
        document.getElementById("otpInput").value = "";
        document.getElementById("otpInput").focus();
    }
}

// Generate QR Code (simulated)
function generateQRCode(regId) {
    // In a real application, you would use a QR code library
    // For demo, we'll just show a placeholder
    console.log(`QR Code generated for: ${regId}`);
    
    // Example of how you might implement QR code with a library:
    // QRCode.toCanvas(document.getElementById('qrcode'), regId, function(error) {
    //     if (error) console.error(error);
    // });
}

// Download Ticket (simulated)
function downloadTicket() {
    const ticketData = `
        STARTUP SUMMIT EXPO 2024
        =========================
        
        Registration ID: ${userData.regId}
        Name: ${userData.name}
        Mobile: ${userData.mobile}
        Email: ${userData.email}
        
        Event Date: December 15-17, 2024
        Venue: Bangalore International Convention Centre
        
        Please show this ticket at the entry.
        
        Thank you for registering!
    `;
    
    // Create a blob and download link
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StartupSummit-Ticket-${userData.regId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Ticket downloaded successfully!");
}