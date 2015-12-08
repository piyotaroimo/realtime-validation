/**
 * バリデートview
 * @param {el} 対象要素
 * @param {prefix} 使用プレフィックス
 */
function RtValidateView (el, prefix) {
    // prefix
    this.prefix = 'rv';
    if (prefix !== undefined) this.prefix = prefix;
    // 初期化
    this.initialize(el);
    // イベント
    this.handleEvents();
}

RtValidateView.prototype.initialize = function(el) {
    this.el = el;
    this.form = null;
    var parent = el;
    for (var i = 0; parent; i++) {
        if (parent.nodeName === 'FORM') {this.form = parent; break;}
        parent = parent.parentNode;
    }
    this.formKey = this.form.dataset[this.prefix + 'Form'];
    this.validationKey = el.dataset[this.prefix + 'Validate'];
    this.submit = document.querySelector(
        '[data-' + this.prefix + '-submit="' + this.formKey + '"]'
    );
    this.attrs = {};
    var self = this;

    // エラーメッセージ非表示
    this.hideErrorMessage(self.prefix, self.formKey, self.validationKey);
    this.form.setAttribute('novalidate', '');

    // HTML5のrequiredがあれば必須項目を設定する
    if(el.getAttribute('required') !== null) {
        self.attrs.required = "";
    }

    // prefixから対象の属性のみ取得し、prefixを削除する
    var dataElm = el.dataset;
    for (var dataKey in dataElm) {
        // prefixが付いている属性を対象とする
        var num = dataKey.indexOf(self.prefix, 0);
        if (num === 0) {
            var key = dataKey.toLowerCase().substring(
                                                num + self.prefix.length,
                                                dataKey.length
                                            );
            self.attrs[key] = dataElm[dataKey];
        }
    }

    this.model = new RtValidateModel(self.attrs);
};

RtValidateView.prototype.handleEvents = function()  {
    var self = this;
    this.el.addEventListener('keyup', function (e) {
        self.onKeyup(e);
    });

    this.submit.addEventListener('click', function (e) {
        self.onClick(e);
    });

    this.model.on('valid', function() {
        self.onValid();
    });

    this.model.on('invalid', function() {
        self.onInvalid();
    });
};

RtValidateView.prototype.onKeyup = function(e) {
    this.model.set(e.currentTarget.value);
};

RtValidateView.prototype.onClick = function(e) {
    e.preventDefault();
    if (this.model.errors !== undefined && this.model.errors.length > 0) {
        return false;
    }

    if(this.el.getAttribute('required') !== null) {
        this.model.set(this.el.value);
    }

};

RtValidateView.prototype.onValid = function() {
    // hide error message
    this.hideErrorMessage(this.prefix, this.formKey, this.validationKey);
    this.orgOnValid();

    // var targetForm = this.form;
    // this.submit.click(function(){
    //     targetForm.submit();
    // });
};

RtValidateView.prototype.onInvalid = function() {
    // hide error message
    this.hideErrorMessage(this.prefix, this.formKey, this.validationKey);
    // show error message
    document.querySelector(
        '[data-' + this.prefix + '-error="' + this.formKey + '.' +
        this.validationKey + '.' + this.model.errors[0] + '"]'
    ).style.display = 'block';

    this.orgOnInvalid();
};

RtValidateView.prototype.orgOnValid = function() {
};

RtValidateView.prototype.orgOnInvalid = function() {
};

RtValidateView.prototype.hideErrorMessage = function(
    prefix, formKey, validationKey
){
    var errorMes = document.querySelectorAll(
        '[data-' + prefix + '-error^="' + formKey + '.' + validationKey + '."]'
    );
    for (var i = 0; i < errorMes.length; i++) {
        errorMes[i].style.display = 'none';
    }
};