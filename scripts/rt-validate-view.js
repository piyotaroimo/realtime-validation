/**
 * バリデートview
 * @param {el} 対象要素
 * @param {prefix} 使用プレフィックス
 * @param {formElm} form要素
 */
function RtValidateView (el, prefix, formElm) {
    // prefix
    this.prefix = prefix;
    // form element
    this.form = formElm;
    // 初期化
    this.initialize(el);
    // イベント
    this.handleEvents();
}

RtValidateView.prototype.initialize = function(el) {
    this.el = el;
    this.validationKey = el.getAttribute('data-' + this.prefix + '-validate');
    this.submit = this.form.querySelector(
        '[data-' + this.prefix + '-submit]'
    );
    this.attrs = {};
    var self = this;

    // エラーメッセージ非表示
    this.hideErrorMessage(self.prefix, self.form, self.validationKey);

    // HTML5のrequiredがあれば必須項目を設定する
    if(el.getAttribute('required') !== null) {
        self.attrs.required = "";
    }

    // prefixから対象の属性を特定・取得し、prefixを削除する
    var attributes = el.attributes;
    for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i],
            num = attribute.name.indexOf('data-' + self.prefix + '-', 0);
        if (num === 0) {
            var key = attribute.name.split('-')[2];
            if (key === 'validate') {continue;}
            self.attrs[key] = attribute.value;
        }
    }

    this.model = new RtValidateModel(self.attrs);
};

RtValidateView.prototype.handleEvents = function()  {
    var self = this;
    this.addEvent(this.el, 'keyup', function (e) {
        self.onKeyup(e);
    });

    this.addEvent(this.submit, 'click', function (e) {
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
    this.hideErrorMessage(this.prefix, this.form, this.validationKey);
    this.orgOnValid();
};

RtValidateView.prototype.onInvalid = function() {
    // hide error message
    this.hideErrorMessage(this.prefix, this.form, this.validationKey);
    // show error message
    this.form.querySelector(
        '[data-' + this.prefix + '-error="' +
        this.validationKey + '.' + this.model.errors[0] + '"]'
    ).style.display = 'block';

    this.orgOnInValid();
};

RtValidateView.prototype.orgOnValid = function() {
};

RtValidateView.prototype.orgOnInValid = function() {
};

RtValidateView.prototype.hideErrorMessage = function(
    prefix, formElm, validationKey
){
    var errorMes = formElm.querySelectorAll(
        '[data-' + prefix + '-error^="' + validationKey + '."]'
    );
    for (var i = 0; i < errorMes.length; i++) {
        errorMes[i].style.display = 'none';
    }
};

RtValidateView.prototype.addEvent = function(target, name, fn) {
    if (!name) { return false; }

    if (window.addEventListener) {
        target.addEventListener(name, fn, false);
        return true;
    } else if (window.attachEvent) {
        target.attachEvent('on' + name, fn);
        return true;
    }
    return false;
};