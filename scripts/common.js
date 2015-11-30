/**
 * バリデートmodel
 */
function AppModel(attrs) {
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

    if (attrs.required !== undefined) this.attrs['required'] = attrs.required;
    if (attrs.minlength !== undefined) this.attrs['minlength'] = attrs.minlength;
    if (attrs.maxlength !== undefined) this.attrs['maxlength'] = attrs.maxlength;
    if (attrs.number !== undefined) this.attrs['number'] = this.terms.number;
    if (attrs.url !== undefined) this.attrs['url'] = this.terms.url;
    if (attrs.mail !== undefined) this.attrs['mail'] = this.terms.mail;

    // TODO モデルの持ち物ではないので廃止
    this.message = {
        required: '必須項目です',
        maxlength: this.attrs.maxlength + '文字以下にしてください',
        minlength: this.attrs.minlength + '文字以上入力してください',
        number: '半角数字で入力してください',
        url: 'URLが正しくありません',
        mail: 'メールアドレスが正しくありません'
    };

}

AppModel.prototype.set = function(val) {
    this.val = val;
    this.validate();
};

AppModel.prototype.validate = function() {
    var val;
    // バリデーションでエラーが出たものを保存しておく配列を用意
    this.errors = [];

    for (var key in this.attrs) {
        val = this.attrs[key];
        if (!this[key](val)) {this.errors.push(key); break;}
    }

    this.trigger(!this.errors.length ? 'valid' : 'invalid');
};

AppModel.prototype.required = function() {
    return this.val === '';
};

AppModel.prototype.minlength = function(rule) {
    if (this.val === '') return true;
    return rule <= this.val.length;
};

AppModel.prototype.maxlength = function(rule) {
    if (this.val === '') return true;
    return rule >= this.val.length;
};

AppModel.prototype.number = function(rule) {
    if (this.val === '') return true;
    return this.val.match(rule);
};

AppModel.prototype.url = function(rule) {
    if (this.val === '') return true;
    return this.val.match(rule);
};

AppModel.prototype.mail = function(rule) {
    if (this.val === '') return true;
    return this.val.match(rule);
};

/**
 * オブザーバーの振る舞いを設定
 */
AppModel.prototype.on = function(event, func) {
    this.listeners[event].push(func);
};

/**
 * オブザーバーのイベントを発火
 */
AppModel.prototype.trigger = function(event) {
    $.each(this.listeners[event], function() {
        this();
    });
};

/**
 * バリデートview
 * @param {el} 対象要素
 */
function AppView (el) {
    // prefix
    this.prefix = 'rv';
    // 初期化
    this.initialize(el);
    // イベント
    this.handleEvents();
}

AppView.prototype.initialize = function(el) {
    this.$el = $(el);
    this.$list = this.$el.next();
    this.$submit = $('.js-submit');
    this.$form = $('.js-form');
    // var obj = this.$el.data(),
    //     attrs = {},
    //     self = this;
    this.attrs = {};
    var self = this;

    // HTML5のrequiredがあれば必須項目を設定する
    if(this.$el.prop('required')) {
        self.attrs["required"] = "";
    }

    // prefixから対象の属性のみ取得し、prefixを削除する
    $.each(this.$el.data(), function(index, val) {

        // 先頭に「prefix-」となっているものを対象とする

        var num = index.indexOf(self.prefix, 0);

        index = index.toLowerCase().substring(num+2, index.length);
        self.attrs[index] = val;
    });

    this.model = new AppModel(self.attrs);
};

AppView.prototype.handleEvents = function()  {
    var self = this;
    this.$el.on('keyup', function(e) {
        self.onKeyup(e);
    });

    this.$submit.on('click', function() {
        self.onClick();
    });

    this.model.on('valid', function() {
        self.onValid();
    });

    this.model.on('invalid', function() {
        self.onInvalid();
    });
};

AppView.prototype.onKeyup = function(e) {
    var $target = $(e.currentTarget);
    this.model.set($target.val());
};

AppView.prototype.onClick = function() {
    var $target = this.$el;

    if($target.hasClass('js-validate-required')){
        this.model.set($target.val());
    }

};

AppView.prototype.onValid = function() {
    var $targetForm = this.$form;

    this.$el.removeClass('error');
    this.$list.find('.errText').remove();

    // エラーメッセージを非表示にする


    this.$submit.click(function(){
        $targetForm.submit();
    });
};

AppView.prototype.onInvalid = function() {
    var self = this;
    self.message = this.model.message;

    this.$el.addClass('error');
    this.$list.find('.errText').remove();

    $.each(this.model.errors, function(index, val) {
        var elem = self.message[val];
        self.$list.append('<p class="errText">' + elem + '</p>');
    });

    console.log(this.attrs);
};

;(function() {
    //$('.js-validate').each(function(){
    $('[data-rv-validate]').each(function() {
        new AppView(this);
    });
    // エラーメッセージを非表示
    $('[data-rv-error]').each(function() {
        $(this).hide();
    });
})();