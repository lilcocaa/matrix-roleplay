const JsonReturn = require('./json-return');

module.exports = function (err, ret) {
    if (ret.getCode() === 200) {
        ret = new JsonReturn();

        ret.setError(true);
        ret.setCode(500);
        ret.addMessage('Erro interno. Por favor, tente novamente.');

        console.log(`[ERRO INTERNO]: ${err}`);
    } else {
        ret.setError(true);
        if (err.message) {
            ret.addMessage(err.message);
        }
    }

    return ret;
};