/**
 * バリデートmodel
 */
function RtValidateModel(attrs) {
    this.val = '';

    this.listeners = {
        valid: [],
        invalid: []
    };

    this.attrs = {};
    this.terms = {
        required: '',
        maxlength: 0,
        minlength: 0,
        //number: /^[-]?[0-9]+(?.[0-9]+)?$/,
        number: /^([1-9]\d*|0)(\.\d+)?$/,
        url: /^(https?|ftp)(:\/\/[-_.!~*?'()a-zA-Z0-9;?/?:?@&=+?$,%#]+)$/,
        mail: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    };

    if (attrs.required !== undefined) this.attrs.required = attrs.required;
    if (attrs.minlength !== undefined) this.attrs.minlength = attrs.minlength;
    if (attrs.maxlength !== undefined) this.attrs.maxlength = attrs.maxlength;
    if (attrs.number !== undefined) this.attrs.number = this.terms.number;
    if (attrs.url !== undefined) this.attrs.url = this.terms.url;
    if (attrs.mail !== undefined) this.attrs.mail = this.terms.mail;
}

RtValidateModel.prototype.set = function(val) {
    this.val = val;
    this.validate();
};

RtValidateModel.prototype.validate = function() {
    var val;
    // バリデーションでエラーが出たものを保存しておく配列を用意
    this.errors = [];

    for (var key in this.attrs) {
        val = this.attrs[key];
        if (!this[key](val)) {this.errors.push(key); break;}
    }

    this.trigger(!this.errors.length ? 'valid' : 'invalid');
};

RtValidateModel.prototype.required = function() {
    return this.val === '';
};

RtValidateModel.prototype.minlength = function(rule) {
    if (this.val === '') return true;
    return rule <= this.val.length;
};

RtValidateModel.prototype.maxlength = function(rule) {
    if (this.val === '') return true;
    return rule >= this.val.length;
};

RtValidateModel.prototype.number = function(rule) {
    if (this.val === '') return true;
    return this.val.match(rule);
};

RtValidateModel.prototype.url = function(rule) {
    if (this.val === '') return true;
    return this.val.match(rule);
};

RtValidateModel.prototype.mail = function(rule) {
    if (this.val === '') return true;
    return this.val.match(rule);
};

/**
 * オブザーバーの振る舞いを設定
 */
RtValidateModel.prototype.on = function(event, func) {
    this.listeners[event].push(func);
};

/**
 * オブザーバーのイベントを発火
 */
RtValidateModel.prototype.trigger = function(event) {
    var listeners = this.listeners[event];
    for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
    }
};