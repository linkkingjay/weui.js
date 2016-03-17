$(function () {
    $('.container').on('click', '#btnAlert', function (e) {
        $.weui.alert('警告你', function () {
            console.log('知道了...');
        });
    }).on('click', '#btnConfirm', function (e) {
        $.weui.confirm('确认删除吗？', function () {
            console.log('删除了...');
        }, function () {
            console.log('不删除...');
        });
    }).on('click', '#btnDialog', function (e) {
        $.weui.dialog({
            title: '自定义标题',
            content: '自定义内容',
            buttons: [{
                label: '知道了',
                type: 'default',
                onClick: function () {
                    console.log('知道了......');
                }
            }, {
                label: '好的',
                type: 'primary',
                onClick: function () {
                    console.log('好的......');
                }
            }]
        });
    }).on('click', '#btnToast', function (e) {
        $.weui.toast('已完成');
    }).on('click', '#btnLoading', function (e) {
        $.weui.loading('数据加载中...');
        setTimeout($.weui.hideLoading, 3000);
    }).on('click', '#btnTopTips', function (e) {
        $.weui.topTips('格式不对');
    }).on('click', '#btnActionSheet', function (e) {
        $.weui.actionSheet([{
            label: '示例菜单',
            onClick: function () {
                console.log('click1');
            }
        }, {
            label: '示例菜单',
            onClick: function () {
                console.log('click2');
            }
        }, {
            label: '示例菜单',
            onClick: function () {
                console.log('click3');
            }
        }]);
    });

    $('#uploader').uploader({
        maxCount: 4,
        onChange: function (file) {
            var update = this.update;
            var success = this.success;
            var error = this.error;
            $.ajax({
                type: 'POST',
                url: '/api/v1/upload?format=base64',
                data: {
                    data: file.data
                },
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();
                    xhr.addEventListener('progress', function(evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            update(percentComplete + '%');
                        }
                    }, false);
                    return xhr;
                },
                success: function(res){
                    success();
                },
                error: function (err){
                    error();
                }
            });
        }
    });

    // 为表单加入检测功能：当required的元素blur时校验，并弹出错误提示
    var $form = $("#form");
    $form.form();

    // 表单校验
    $("#formSubmitBtn").on("click", function(){
        $form.validate();
        // $form.validate(function(error){ console.log(error);}); // error: {$dom:[$Object], msg:[String]}
    });

    // tab
    $('.weui_tab').tab();

    // searchBar
    $('.search_bar_wrap').searchBar({
        //替换原模板的“取消”
        cancelText:"取消",
        //替换原模板的“搜索”
        searchText:'搜索',
        //搜索栏获得焦点时
        onfocus: function (value) {
            console.log('focus!The value is '+value);
        },
        //搜索栏失去焦点时
        onblur:function(value) {
            console.log('blur!The value is '+value);
        },
        //搜索栏在输入时
        oninput: function(value) {
            console.log('Input!The value is '+ value);
        },
        //搜索栏提交时，如果没有submit方法，则沿用浏览器默认的提交方式
        onsubmit:function(value){
            console.log('Submit!The value is '+ value);
        },
        //点击取消按钮
        oncancel:function(){
            console.log('click cancel');
        },
        //点击清空按钮
        onclear:function(){
            console.log('click clear');
        }
    });

    // swipe out
    $('.weui_cells_swipeout').swipeOut().on('touchstart', '.swipe_action1', (e) => {
        $.weui.alert('action1');
    }).on('click', '.swipe_action2', (e) => {
        $.weui.alert('action2');
    });
});

