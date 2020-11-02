// const { ipcRenderer } = require('electron')
console.log('load save')

$('#save').on('click', () => {
    console.log('save');
    const taskInfo = []
    $('.task').each( (i, form) => {
        form = $(form);

        let enabled = form.find('.enable-task').prop('checked');
        
        let time = form.find('.start-time').val();
        let hours = '' + eval(time.slice(0,2))-1
        time = '0'.slice(0,hours.length) + hours + time.slice(2) + '-08:00';
        let startBond = form.find('.start-date').val() + 'T' + time;
        let endBond = form.find('.end-date').val() + 'T08:00:00-08:00';

        let hasURL = form.find('.useURL').prop('checked');
        let pswd = ''; let link;
        if(hasURL){
            link = form.find('.link').val();
        } else {
            link = 'http://berkeley-net.zoom.us/j/' + form.find('.meet-id').val();
            pswd = ' ' + form.find('.pswd').val();
        }

        // console.log(startBond, endBond, link + pswd);
        if(!startBond || !endBond || !(link + pswd)) return;
        console.log('write file', i)

        // constructXMLFile(i-1, $(form));
        taskInfo.push({
            'index': i,
            'URI': '/ZoomScheduler/' + i,
            'Enabled': enabled,
            'StartBoundary': startBond,
            'EndBoundary': endBond,
            'Arguments': '"' + link + pswd + '"'
        });
    });



    window.editTasks(taskInfo);
    console.log('save done');
    window.installTasks();
});