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
    // エラー
}

RtValidateView.prototype.initialize = function(el) {
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
    this.$el = $(el);
    var self = this;

    // エラーメッセージ非表示
    this.hideErrorMessage(self.prefix, self.formKey, self.validationKey);

    // HTML5のrequiredがあれば必須項目を設定する
    if(el.getAttribute('required')) {
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

    var dataElm = el.dataset;
    // for (var j = 0; dataElm.length; j++) {
    //     console.log(dataElm[j]);
    // }

console.log(dataElm);

//console.log(self.attrs);

    this.model = new RtValidateModel(self.attrs);
};

RtValidateView.prototype.handleEvents = function()  {
    var self = this;
    this.$el.on('keyup', function(e) {
        self.onKeyup(e);
    });

    // this.$submit.on('click', function() {
    //     self.onClick();
    // });
    this.submit.addEventListener('click', function (e) {
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
    //var targetForm = this.form;

    // hide error message
    this.hideErrorMessage(this.prefix, this.formKey, this.validationKey);
    this.orgOnValid();

    // this.submit.click(function(){
    //     targetForm.submit();
    // });
};

RtValidateView.prototype.onInvalid = function() {
    // show error message
    $('[data-' + this.prefix +
                 '-error="' +
                 this.formKey + '.' +
                 this.validationKey + '.' +
                 this.model.errors[0] + '"]'
    ).show();

    this.orgOnInvalid();
};

RtValidateView.prototype.orgOnValid = function() {
    //this.$el.removeClass('error');
};

RtValidateView.prototype.orgOnInvalid = function() {
    //this.$el.addClass('error');
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