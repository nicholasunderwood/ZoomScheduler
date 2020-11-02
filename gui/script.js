console.log('load script')
const ids = ['-enable','-useURL','-useID'];
const periodNumbers = [0,1,3,5,7,0,2,4,6,7];
const times = ['07:59','09:14','10:29','12:14','13:29'];
const term1Dates = ['2020-10-12', '2020-11-14'];
const term2Dates = ['2020-11-15', '2020-12-19'];



$(document).ready(() => {


  for(let i = 1; i < 10; i++){
    let form = $('#p0').clone(true, false);
    ids.forEach(id => {
      form.find(`#p0${id}`).addBack(form).attr('id', `p${i}${id}`);
      form.find(`[for=p0${id}]`).attr('for', `p${i}${id}`);
    });
    form.attr('id','p'+i)
    form.find(`[name=p0-link-type]`).attr('name', `p${i}-link-type`);
    form.find('.period-title').text('Period ' + periodNumbers[i]);
    
    $(i > 4 ? '#t2' : '#t1').append(form);
  }

  $('.term-title').on('click', e => {
    console.log('col',  )
    $(e.currentTarget).nextAll().slideToggle();
  });

  $('.start-time').each((i, el) => {
    $(el).val(times[i%5])
  });

  $('#t1 .start-date').each((_, input) => { $(input).val(term1Dates[0]) });
  $('#t1 .end-date').each((_, input) => { $(input).val(term1Dates[1]) });
  $('#t2 .start-date').each((_, input) => { $(input).val(term2Dates[0]) });
  $('#t2 .end-date').each((_, input) => { $(input).val(term2Dates[1]) });


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
  
  $('#t1 .form:first,#t1 .form:last,#t2 .form:first,#t2 .form:last')
    .find('.enable-task')
    .prop('checked',false)
    .change();

  $('.id-row').hide();

  console.log()
  $('#p1 .link').val('https://berkeley-net.zoom.us/j/81167547619?pwd=cEpLYXBrUlBNcHhISlEwdHpPUVhBUT09')

  $('form').on('submit', (e) => e.preventDefault());
});