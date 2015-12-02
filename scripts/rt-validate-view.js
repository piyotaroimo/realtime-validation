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
    this.$el = $(el);
    this.$form = this.$el.parents('form');
    this.formKey = this.$form.data(this.prefix + '-form');
    this.validationKey = this.$el.data(this.prefix + '-validate');
    this.$submit = $('.js-submit');
    this.attrs = {};
    var self = this;

    // エラーメッセージ非表示
    $('[data-' + self.prefix +
                 '-error^="' +
                 self.formKey + '.' +
                 self.validationKey + '."]'
    ).hide();

    // HTML5のrequiredがあれば必須項目を設定する
    if(this.$el.prop('required')) {
        self.attrs.required = "";
    }

    // prefixから対象の属性のみ取得し、prefixを削除する
    $.each(this.$el.data(), function(index, val) {
        // prefixが付いている属性を対象とする
        var num = index.indexOf(self.prefix, 0);
        if (num === 0) {
            index = index.toLowerCase().substring(
                                            num + self.prefix.length,
                                            index.length
                                        );
            self.attrs[index] = val;
        }
    });

    this.model = new RtValidateModel(self.attrs);
};

RtValidateView.prototype.handleEvents = function()  {
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

RtValidateView.prototype.onKeyup = function(e) {
    var $target = $(e.currentTarget);
    this.model.set($target.val());
};

RtValidateView.prototype.onClick = function() {
    var $target = this.$el;

    if($target.hasClass('js-validate-required')){
        this.model.set($target.val());
    }

};

RtValidateView.prototype.onValid = function() {
    var $targetForm = this.$form;

    // エラーメッセージを非表示にする
    $('[data-' + this.prefix +
                 '-error^="' +
                 this.formKey + '.' +
                 this.validationKey + '."]'
    ).hide();

    this.$submit.click(function(){
        $targetForm.submit();
    });
};

RtValidateView.prototype.onInvalid = function() {
    // show error message
    $('[data-' + this.prefix +
                 '-error="' +
                 this.formKey + '.' +
                 this.validationKey + '.' +
                 this.model.errors[0] + '"]'
    ).show();

    this.setInvalid();
};

RtValidateView.prototype.setInvalid = function() {
    //this.$el.addClass('error');
};