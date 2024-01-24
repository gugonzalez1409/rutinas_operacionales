function filtrarTabla() {
    var input = document.getElementById('search').value.toLowerCase();
    var filter = document.getElementById('filter').value.toLowerCase();
    var rows = document.querySelectorAll('tbody tr');

    rows.forEach(function(row) {
        var cells = row.getElementsByTagName('td');
        var matchSearch = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(input));
        var matchFilter = filter === 'todos' || cells[1].textContent.toLowerCase().includes(filter);

        if (matchSearch && matchFilter) {
        row.style.display = '';
        } else {
        row.style.display = 'none';
        }
    });
}