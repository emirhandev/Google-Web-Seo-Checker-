document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
 
    searchButton.addEventListener('click', function () {
        const inputValue = searchInput.value;
        const url = `http://localhost:3000/?url=${encodeURIComponent(inputValue)}`;
        
       
        window.location.href = url;
 
      
        setTimeout(function () {
            window.location.href = "/view/dashboard/dashboard.html";
        }, 15000);
    });
 });
 