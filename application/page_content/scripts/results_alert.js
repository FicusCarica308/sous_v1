$(document).ready(function(){
    let status = $("#Status").attr("class")
    if (status == 'Unauth') {
        alert('Please sign in or login !!!')
    } else if (status == 'No-Results' || $('.recipe').length == 0) {
        alert('No Results !!!')
    }
});
