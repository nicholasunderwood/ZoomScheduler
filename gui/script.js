const { ipcRenderer } = require('electron')

console.log('load script')
const ids = ['enable','useURL','useID'];
const periodNumbers = [0,1,3,5,7,0,2,4,6,7];

$(document).ready(() => {


  for(let i = 0; i < 10; i++){
    let form = $('#template').clone(true, false);
    ids.forEach(id => {
      form.find(`#${id}`).addBack(form).attr('id', `p${i}-${id}`);
      form.find(`[for=${id}]`).attr('for', `p${i}-${id}`);
    });
    form.attr('id','p'+i)
    form.find(`[name=p0-link-type]`).attr('name', `p${i}-link-type`);
    form.find('.period-title').text('Period ' + periodNumbers[i]);

 
    
    $(i > 4 ? '#t2' : '#t1').append(form);
  }

  
  $('#template').remove();

  $('.term-title').on('click', e => {
    $(e.currentTarget).nextAll().slideToggle();
  });
  
  $('.enable-task').on('change', (e) => {
    form = $(e.currentTarget).parents('form')
    let isChecked = e.currentTarget.checked;
    form.find('input:not(.enable-task)').attr('disabled', !isChecked);
    if(isChecked) form.find('.input-wrapper').slideDown();
    else form.find('.input-wrapper').slideUp();
  });
  
  $('.link-type').on('change', (e) => {
    form = $(e.currentTarget).parents('form')
    form.find('.id-row').slideToggle();
    form.find('.url-row').slideToggle();
  });
  
  $('.id-row').hide();


  const userData = ipcRenderer.send('load data');
  ipcRenderer.on('userData', (event, userData) => {

    console.log('load data', userData)
    
    userData.forEach((taskData, i) => {
      Object.keys(taskData).forEach(key => {
        let el = $(`#p${i} .${key}`)
        if(typeof taskData[key] == 'boolean'){
          el.prop('checked', taskData[key])
        } else {
          el.val(taskData[key])
        }
      });
      $(`#p${i} .useID`).prop('checked', !taskData['useURL']);
    });
  
    $('.enable-task').change();
    $('.link-type').change();
  })


  $('form').on('submit', (e) => e.preventDefault());

});