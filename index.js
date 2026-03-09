function showSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'flex';
}

function hideSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'none';
}

// Close sidebar when clicking outside of it
document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const nav4 = document.getElementById('nav4');
    if (sidebar && nav4 && !nav4.contains(e.target)) {
        sidebar.style.display = 'none';
    }
});
