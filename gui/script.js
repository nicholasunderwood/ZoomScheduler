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
    form.attr('id','p'+i).attr('task', i);
    form.find(`[name=p0-link-type]`).attr('name', `p${i}-link-type`);
    form.find('.period-title').text('Period ' + periodNumbers[i]);
    
    $(i > 4 ? '#t2' : '#t1').append(form);
  }

  $('#template').remove();

  $('.term-title').on('click', e => {
    $(e.currentTarget).nextAll().slideToggle();
  });

  ipcRenderer.send('load data');
  ipcRenderer.on('userData', (event, userData) => {
    
    userData.forEach((taskData, i) => {
      $(`#p${i} .enable-task`).prop('checked', taskData['enable-task']);
      $(`#p${i} .useURL`).prop('checked', taskData['useURL']);
      $(`#p${i} .useID`).prop('checked', !taskData['useURL']);
      $(`#p${i} .launch`).attr('href', taskData['href']);
      Object.keys(taskData).forEach(key => {
        if(typeof taskData[key] == 'boolean') return;
        $(`#p${i} .${key}`).val(taskData[key])
      });
      if(!taskData['enable-task']){
        $(`#p${i} input:not(.enable-task)`).attr('disabled', true);
        $(`#p${i} .input-wrapper`).hide();
      }
      if(taskData['useURL']) $(`#p${i} .id-row`).hide();
      else $(`#p${i} .url-row`).hide();
    });
  
    $('.enable-task').on('change', (e) => {
      let form = $(e.currentTarget).parents('form')
      let isChecked = e.currentTarget.checked;
      form.find('input:not(.enable-task)').attr('disabled', !isChecked);
      if(isChecked) form.find('.input-wrapper').slideDown();
      else form.find('.input-wrapper').slideUp();
    });
  
    $('.link-type').on('change', (e) => {
      let form = $(e.currentTarget).parents('form')
      form.find('.id-row').slideToggle();
      form.find('.url-row').slideToggle();
    });
  })

  $('form').on('submit', (e) => e.preventDefault());

  $('.launch').on('click', (e) => {
    let task = $(e.currentTarget).parents('form').attr('task');
    console.log('launch', task)
    ipcRenderer.send('launch', task);
  });
});