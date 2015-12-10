/**
 * バリデートform
 * @param {formKey} 対象formキー名
 * @param {prefix} 使用プレフィックス
 */
function RtValidateForm (formKey, prefix) {
    this.formKey = formKey;
    // prefix
    this.prefix = 'rv';
    if (prefix !== undefined) this.prefix = prefix;
    // 初期化
    //this.initialize(el);
    // error class
    this.onValid = function(){};
    this.onInValid = function(){};
}

RtValidateForm.prototype.initialize = function() {
    this.form = document.querySelector(
      '[data-' + this.prefix + '-form="' + this.formKey + '"]'
    );
    this.form.setAttribute('novalidate', '');
    var self = this;

    var validations = this.form.querySelectorAll(
        '[data-' + this.prefix + '-validate]'
    );

    for (var i = 0; i < validations.length; i++) {
        var validation = new RtValidateView(
            validations[i], this.prefix, this.form
        );
        validation.orgOnValid = this.onValid;
        validation.orgOnInValid = this.onInValid;
    }
};

RtValidateForm.prototype.isValid = function() {
    var errorMes = this.form.querySelectorAll(
        '[data-' + this.prefix + '-error]'
    );
    for (var i = 0; i < errorMes.length; i++) {
        if (errorMes[i].style.display === 'block') {
            return false;
        }
    }
    return true;
};

RtValidateForm.prototype.setErrorClass = function(className) {
    this.errorClass = className;
};

RtValidateForm.prototype.setOnValid = function(func) {
    this.onValid = func;
};

RtValidateForm.prototype.setOnInValid = function(func) {
    this.onInValid = func;
};