
// ======================================
// STAR SCOPE - JAVASCRIPT
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. Notification button
    const notificationBtn = document.getElementById("notificationBtn");

    notificationBtn.addEventListener("click", () => {
        showToast("Welcome to Star Scope! Keep exploring the universe.");
    });


    // 2. Navigation active state
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });


    // 3. Global Search
    const searchInput = document.getElementById("globalSearch");

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            const query = searchInput.value.trim().toLowerCase();

            if (!query) {
                showToast("Please enter something to search.");
                return;
            }

            const searchableItems = document.querySelectorAll(
                ".stat-card, .planet-card, .mission-card, .section-title"
            );

            let foundItem = null;

            searchableItems.forEach(item => {

                if (
                    !foundItem &&
                    item.textContent.toLowerCase().includes(query)
                ) {
                    foundItem = item;
                }

            });

            if (foundItem) {

                foundItem.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                showToast("Matching space information found!");

            } else {

                showToast("No matching information found.");

            }
        }
    });


    // 4. Toast notification function
    function showToast(message) {

        const oldToast = document.querySelector(".toast-message");

        if (oldToast) {
            oldToast.remove();
        }

        const toast = document.createElement("div");

        toast.className = "toast-message";
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }


    // 5. Welcome message
    console.log("Star Scope initialized successfully!");
    console.log("Frontend is running.");

});
