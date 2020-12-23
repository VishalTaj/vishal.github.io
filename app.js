me = {
    "terminal": {
        "help_text": "Enter \"help\" for more information."
    }
}
$.get('resume.json', function(data) { Object.assign(me, data); });

renderTemplate = function(name, target) {
    $.get(`templates/${name}.hbs`, function (data) {
        var template=Handlebars.compile(data);
        $(target).html(template(me));
    }, 'html')
}

/* Open */
openNav =  function() {
  document.getElementById("views").style.height = "100%";
}
    
/* Close */
closeNav = function() {
  document.getElementById("views").style.height = "0%";
}

/* view */

renderView = function(partial) {
  openNav();
  renderTemplate(partial, '#views .overlay-content');
}

// document.onkeydown = function(e) {
//     if(event.keyCode == 123) {
//       console.log('You cannot inspect Element');
//        return false;
//     }
//     if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
//       console.log('You cannot inspect Element');
//       return false;
//     }
//     if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
//       console.log('You cannot inspect Element');
//       return false;
//     }
//     if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
//       console.log('You cannot inspect Element');
//       return false;
//     }
//     if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
//       console.log('You cannot inspect Element');
//       return false;
//     }
//   } 
//   // prevents right clicking
//   document.addEventListener('contextmenu', e => e.preventDefault());