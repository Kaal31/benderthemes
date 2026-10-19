/* Explanation showcase. Samples deliberately perform no Steam actions. */
(() => {
 const hub=window.ThemeHub;
 hub.on('input',({btn})=>{if(btn==='up'||btn==='down')document.getElementById('showcase').scrollBy({top:btn==='up'?-240:240,behavior:'auto'});});
 hub.connect({keyboard:true,textInput:true,handles:['up','down'],autoBack:false});
})();
