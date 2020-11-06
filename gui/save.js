
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

        taskData = {
            'enable-task': form.find('.enable-task').prop('checked'),
            'useURL': form.find('.useURL').prop('checked'),
            'link': form.find('.link').val(),
            'meet-id': form.find('.meet-id').val(),
            'pswd': form.find('.pswd').val(),
            'start-time': form.find('.start-time').val(),
            'start-date': form.find('.start-date').val(),
            'end-date': form.find('.end-date').val()
        };

        console.log(taskData)
        userData.push(taskData);

        
        let hours = eval(taskData['start-time'].slice(0,2))-1 + '';
        let time = '0'.slice(0,hours.length) + hours + taskData['start-time'].slice(2) + '-08:00';
        let startBond = taskData['start-date'] + 'T' + time;
        let endBond = taskData['end-date'] + 'T08:00:00-08:00';

        let pswd = ''; let link;
        if(taskData['useURL']){
            link = taskData['link'];
        } else {
            link = 'http://berkeley-net.zoom.us/j/' + taskData['meet-id'].replace(/ /gi,'');
            pswd = ' ' + taskData['pswd'];
        }

        if(!startBond || !endBond || !(link + pswd)) return;

        taskInfo.push({
            'index': i,
            'URI': '/Zoom/' + i,
            'Enabled': taskData['enable-task'],
            'StartBoundary': startBond,
            'EndBoundary': endBond,
            'Arguments': '"' + link + '"' + pswd
        });
    });
    ipcRenderer.send('edit tasks', taskInfo);
});