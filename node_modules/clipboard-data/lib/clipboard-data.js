var clipdata = require('bindings')('ClipboardData.node');

function checkRequired(val, name) {
    if (!val || val.length <= 0) {
        throw new Error(name + ' is required.');
    }
}

module.exports = {
    setText: function(value) {
        checkRequired(value, 'value');
        clipdata.setText(value);
    },

    getText: function() {
        return clipdata.getText();
    },

    getImage: function() {
        return clipdata.getImage();
    }
}