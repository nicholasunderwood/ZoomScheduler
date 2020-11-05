
var dots = 0;
var userData, load;
const saveButton = $('#save')

function loadAnimation() {
    
    dots = (dots + 1) % 4;
    if(dots == 0) saveButton.text(saveButton.text().slice(0,-3));
    else saveButton.text(saveButton.text() + '.');
    
}

ipcRenderer.on('process', msg => console.log(msg));

ipcRenderer.on('tasks created', () => {
    console.log('tasks created')
    ipcRenderer.send('install tasks')
    saveButton.text('Installing Tasks');
});

ipcRenderer.on('tasks installed', (_, msg) => {
    console.log('tasks installed: \n', msg)
    ipcRenderer.send('save data', userData)
    saveButton.text('Saving Data');
});

ipcRenderer.on('data saved', () => {
    console.log('data saved')
    saveButton.attr('disabled', false).text('Save');
    clearInterval(load)
});


saveButton.on('click', () => {
    console.log('save');
    const taskInfo = [];
    userData = [];

    $('#save').attr('disabled', 'true')
    load = setInterval(loadAnimation, 500);


    $('.task').each( (i, form) => {

        form = $(form);

        let enabled = form.find('.enable-task').prop('checked');
        
        let time = form.find('.start-time').val();
        let hours = '' + eval(time.slice(0,2))
        time = '0'.slice(0,hours.length) + hours + time.slice(2) + '-08:00';
        let startBond = form.find('.start-date').val() + 'T' + time;
        let endBond = form.find('.end-date').val() + 'T08:00:00-08:00';

        let hasURL = form.find('.useURL').prop('checked');
        let pswd = ''; let link;
        if(hasURL){
            link = form.find('.link').val();
        } else {
            link = 'http://berkeley-net.zoom.us/j/' + form.find('.meet-id').val().replace(/ /gi,'');
            pswd = ' ' + form.find('.pswd').val();
        }
        
        userData.push({
            'enable-task': enabled,
            'useURL': hasURL,
            'link': form.find('.link').val(),
            'meet-id': form.find('.meet-id').val(),
            'pswd': form.find('.pswd').val(),
            'start-time': form.find('.start-time').val(),
            'start-date': form.find('.start-date').val(),
            'end-date': form.find('.end-date').val()
        })

        if(!startBond || !endBond || !(link + pswd)) return;

        // constructXMLFile(i-1, $(form));
        taskInfo.push({
            'index': i,
            'URI': '/Zoom/' + i,
            'Enabled': enabled,
            'StartBoundary': startBond,
            'EndBoundary': endBond,
            'Arguments': '"' + link + pswd + '"'
        });
    });
    ipcRenderer.send('edit tasks', taskInfo);

});