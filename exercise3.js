const userGrid = document.querySelector("#userGrid");
const viewToggleBtn = document.querySelector("#viewToggleBtn");
const deleteIdInput = document.querySelector("#deleteIdInput");
const deleteBtn = document.querySelector("#deleteBtn");
const sortByGroupBtn = document.querySelector("#sortByGroupBtn");
const sortByIdBtn = document.querySelector("#sortByIdBtn");

let users = [];

const user_api = "https://69a1e4862e82ee536fa2806e.mockapi.io/users_api"

async function retrieveData() {
    try {
        let res = await fetch(user_api)

        const data = await res.json();

        users = data;
        console.log("Users:", users)

        render(users);
    }
    catch (err) {
        console.error("retrieveData error:", err);
    }
    
}

document.addEventListener("DOMContentLoaded", retrieveData);

function render(userArray) {
    if (!userGrid) return;

    userGrid.innerHTML = userArray.map(
        (user) => `
            <article class="user-card">
            <h3>${user.first_name ?? ""}</h3>
            <p>first_name: ${user.first_name ?? ""}</p>
            <p>user_group: ${user.user_group ?? ""}</p>
            <p>id: ${user.id ?? ""}</p>
            </article>
            `
    )
    .join("")
}

viewToggleBtn.addEventListener("click", () => {
    if (userGrid.classList.contains("grid-view")) {
        userGrid.classList.remove("grid-view");
        userGrid.classList.add("list-view");
    } else if (userGrid.classList.contains("list-view")) {
        userGrid.classList.remove("list-view");
        userGrid.classList.add("grid-view");
    }
    
})

sortByGroupBtn.addEventListener("click", () => {
    users.sort((a, b) => {
        const ga = Number(a.user_group);
        const gb = Number(b.user_group);
        return ga - gb;
    });
    render(users);
})

sortByIdBtn.addEventListener("click", () => {
    users.sort((a, b) => Number(a.id) - Number(b.id));
    render(users);
})

if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
        try {
            const idToDelete = deleteIdInput?.value?.trim();

            if (!idToDelete) {
                console.error("Delete failed: Please enter a user id.");
                return;
            }

            const existingIndex = users.findIndex((u) => String(u.id) === String(idToDelete));
            if (existingIndex === -1) {
                console.error(`Delete Failed: No matching user with id=${idToDelete}.`);
                return;
            }

            const deleteUrl = `${user_api}/${encodeURIComponent(idToDelete)}`;

            const res = await fetch(deleteUrl, { method: "DELETE"});

            if (!res.ok) {
                console.error(`Delete failed for id = ${idToDelete}. Status: ${res.status}`);
                return;
            }

            users.splice(existingIndex, 1);
            render(users);

            deleteIdInput.value = "";
        } catch (err) {
            console.error("Delete failed due to an error", err);
        }
    });
}