/**
 * バリデートform
 * @param {el} 対象要素
 * @param {prefix} 使用プレフィックス
 */
function RtValidateForm (el, prefix) {
    // prefix
    this.prefix = 'rv';
    if (prefix !== undefined) this.prefix = prefix;
    // 初期化
    this.initialize(el);
    // イベント
    //this.handleEvents();
}

RtValidateForm.prototype.initialize = function(el) {

    this.form = el;
    this.formKey = this.form.dataset[this.prefix + 'Form'];
    this.form.setAttribute('novalidate', '');

    var validations = document.querySelectorAll(
        '[data-' + this.prefix + '-validate^="' + this.formKey + '."]'
    );
    for (var i = 0; i < validations.length; i++) {
        var validation = new RtValidateView(
            validations[i], this.prefix, this.formKey
        );
        validation.orgOnInvalid = function() {
            this.el.classList.add('error');
        };
        validation.orgOnValid = function() {
            this.el.classList.remove('error');
        };
    }
};

