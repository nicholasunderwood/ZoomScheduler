// const { ipcRenderer } = require('electron')

$('#save').on('click', () => {
    console.log('save')
    $('.task').each( (i, form) => {
        if(i != 1) return;
        form = $(form)

        let enabled = form.find('.enable-task').prop('checked');
        
        let time = form.find('.start-time').val();
        time = (eval(time.slice(0,2))+7)%24 + time.slice(2) + '-07:00';
        let startBond = form.find('.start-date').val() + 'T' + time;
        let endBond = form.find('.end-date').val();

        let hasURL = form.find('.useURL').prop('checked');
        let pswd = ''; let link;
        if(hasURL){
            link = form.find('.link').val();
        } else {
            link = 'http://berkeley-net.zoom.us/j/' + form.find('.meet-id').val();
            pswd = ' ' + form.find('.pswd').val();
        }

        // ipcRenderer.send('edit task', {
        //     'index': i,
        //     'Enabled': enabled,
        //     'StartBoundary': startBond,
        //     'EndBoundary': endBond,
        //     'Arguments': link + pswd
        // });

        window.editTask({
            'index': i,
            'Enabled': enabled,
            'StartBoundary': startBond,
            'EndBoundary': endBond,
            'Arguments': link + pswd
        });
        // constructXMLFile(i-1, $(form));
    });
});