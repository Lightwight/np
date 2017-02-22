np.view.extend ('MediathekMediaView', {
    didInsert: function () {
        $('#mediathek-folder-selection').niceSelect ();
    }
});