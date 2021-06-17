$(document).ready(function(){
    let status = $("#Status").attr("class")
    if (status == 'Sign-In-True'){
        alert('sign in was succesful !');
        alert(statusOther);
    } else if (status == 'Sign-In-False') {
        alert('sign in was not succesful');
    } else if (status == 'Unauth') {
        alert('Please sign in or login !!!')
    } else if (status == 'Create-False') {
        alert('That username already exists !')
    }
});