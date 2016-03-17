// 基于 https://github.com/nolimits4web/Framework7/blob/master/src/js/swipeout.js 修改
(function ($) {
    $.weui.swipeOutOpenedEl = undefined;

    let oldFnSwipeOut = $.fn.swipeOut;
    $.fn.swipeOut = function (options) {
        options = $.extend({
            // 菜单是否没有滑动惯性
            noFollow: false
        }, options);

        let isTouched, isMoved, isScrolling, touchesStart = {}, touchStartTime, touchesDiff, swipeOutEl, swipeOutContent, actionsRight, actionsLeft, actionsLeftWidth, actionsRightWidth, translate, opened, openedActions, buttonsLeft, buttonsRight, direction, overswipeLeftButton, overswipeRightButton, overswipeLeft, overswipeRight;

        $(document).on('touchstart', (event) => {
            // 全局触摸可以关闭当前的菜单
            let e = event.originalEvent;
            let target = $(e.target);
            if ($.weui.swipeOutOpenedEl) {
                if (!target.hasClass('weui_swipeout_action')) {
                    $.weui.swipeOutOpenedEl.swipeOutClose();
                }
            }
        });

        function handleTouchStart(event) {
            let e = event.originalEvent;
            if ($.weui.swipeOutOpenedEl) {
                let target = $(e.target);
                if ($(target[0]).is($.weui.swipeOutOpenedEl) || target.parents('.weui_cell_swipeout').is($.weui.swipeOutOpenedEl)) {
                    return;
                }
            }
            isMoved = false;
            isTouched = true;
            isScrolling = undefined;
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = Date.now();
        }

        function handleTouchMove(event) {
            let e = event.originalEvent;
            if (!isTouched) {
                return;
            }
            let pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            let pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (isScrolling) {
                isTouched = false;
                return;
            }

            if (!isMoved) {
                swipeOutEl = $(this);
                swipeOutContent = swipeOutEl.find('.weui_swipeout_content');
                actionsLeft = swipeOutEl.find('.weui_swipeout_actions_left');
                actionsRight = swipeOutEl.find('.weui_swipeout_actions_right');

                actionsLeftWidth = actionsRightWidth = buttonsLeft = buttonsRight = overswipeLeftButton = overswipeRightButton = null;

                if (actionsLeft.length > 0) {
                    actionsLeftWidth = actionsLeft.outerWidth();
                    buttonsLeft = actionsLeft.children('a');
                    overswipeLeftButton = actionsLeft.find('.weui_swipeout_overswipe');
                }
                if (actionsRight.length > 0) {
                    actionsRightWidth = actionsRight.outerWidth();
                    buttonsRight = actionsRight.children('a');
                    overswipeRightButton = actionsRight.find('.weui_swipeout_overswipe');
                }

                opened = swipeOutEl.hasClass('weui_swipeout_opened');
                if (opened) {
                    openedActions = swipeOutEl.find('.weui_swipeout_actions_left.weui_swipeout_actions_opened').length > 0 ? 'left' : 'right';
                }
                swipeOutEl.removeClass('transitioning');
                if (options.noFollow) {
                    swipeOutEl.find('.weui_swipeout_opened').removeClass('.weui_swipeout_opened');
                    swipeOutEl.removeClass('.weui_swipeout_opened');
                }
            }
            isMoved = true;
            event.preventDefault();

            touchesDiff = pageX - touchesStart.x;
            translate = touchesDiff;


            if (opened) {
                if (openedActions === 'right') {
                    translate = translate - actionsRightWidth;
                } else {
                    translate = translate + actionsLeftWidth;
                }
            }


            // 向右滑动而且左边没有按钮 || 向左滑动而且右边没有按钮
            if (translate > 0 && actionsLeft.length === 0 || translate < 0 && actionsRight.length === 0) {
                if (!opened) {
                    isTouched = isMoved = false;
                    swipeOutContent.css('transform', '');
                    if (buttonsLeft && buttonsLeft.length > 0) {
                        buttonsLeft.css('transform', '');
                    }
                    if (buttonsRight && buttonsRight.length > 0) {
                        buttonsRight.css('transform', '');
                    }
                    return;
                }
                translate = 0;
            }

            if (translate < 0) {
                direction = 'to-left';
            } else if (translate > 0) {
                direction = 'to-right';
            } else {
                if (direction) {
                    direction = 'direction';
                } else {
                    direction = 'to-left';
                }
            }

            let i, buttonOffset, progress;
            if (options.noFollow) {
                if (opened) {
                    if (openedActions === 'right' && touchesDiff > 0) {
                        swipeOutEl.swipeOutClose()
                    }
                    if (openedActions === 'left' && touchesDiff < 0) {
                        swipeOutEl.swipeOutClose()
                    }
                } else {
                    if (touchesDiff < 0 && actionsRight.length > 0) {
                        swipeOutEl.swipeOutOpen('right');
                    }
                    if (touchesDiff > 0 && actionsLeft.length > 0) {
                        swipeOutEl.swipeOutOpen('left');
                    }
                }
                isTouched = false;
                isMoved = false;
                return;
            }
            overswipeLeft = false;
            overswipeRight = false;
            let $button;
            if (actionsRight.length > 0 && direction === 'to-left') {
                progress = translate / actionsRightWidth;
                if (translate < -actionsRightWidth) {
                    translate = -actionsRightWidth - Math.pow(-translate - actionsRightWidth, 0.8);
                    if (overswipeRightButton.length > 0) {
                        overswipeRight = true;
                    }
                }
                for (i = 0; i < buttonsRight.length; i++) {
                    if (typeof buttonsRight[i]._buttonOffset === 'undefined') {
                        buttonsRight[i]._buttonOffset = buttonsRight[i].offsetLeft;
                    }
                    buttonOffset = buttonsRight[i]._buttonOffset;
                    $button = $(buttonsRight[i]);
                    if (overswipeRightButton.length > 0 && $buttons.hasClass('swipeout-overswipe')) {
                        $buttons.css({left: (overswipeRight ? -buttonOffset : 0) + 'px'});
                        if (overswipeRight) {
                            $button.addClass('swipeout-overswipe-active');
                        } else {
                            $button.removeClass('swipeout-overswipe-active');
                        }
                    }
                    // 按钮不要回弹的效果
                    $button.css('transform', `translate3d(${Math.max(translate, -actionsRightWidth)}px,0,0)`);
                }

                // content 最多滑多 30px
                swipeOutContent.css('transform', `translate3d(${Math.max(translate, -actionsRightWidth - 30)}px,0,0)`);
            }
            if (actionsLeft.length > 0 && direction === 'to-right') {
                progress = translate / actionsLeftWidth;
                if (translate > actionsLeftWidth) {
                    translate = actionsLeftWidth + Math.pow(translate - actionsLeftWidth, 0.8);
                    if (overswipeLeftButton.length > 0) {
                        overswipeLeft = true
                    }
                }
                for (i = 0; i < buttonsLeft.length; i++) {
                    if (typeof buttonsLeft[i]._buttonOffset === 'undefined') {
                        buttonsLeft[i]._buttonOffset = actionsLeftWidth - buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
                    }
                    buttonOffset = buttonsLeft[i]._buttonOffset;
                    $button = $(buttonsLeft[i]);
                    if (overswipeLeftButton.length > 0 && $button.hasClass('swipeout-overswipe')) {
                        $buttons.cass({left: (overswipeLeft ? buttonOffset : 0) + 'px'});
                        if (overswipeLeft) {
                            $button.addClass('swipeout-overswipe-active');
                        } else {
                            $button.removeClass('swipeout-overswipe-active')
                        }
                    }
                    if (buttonsLeft.length > 1) {
                        $button.css('z-index', buttonsLeft.length - i);
                    }
                    // 按钮不要回弹的效果
                    $button.css('transform', `translate3d(${Math.min(translate, actionsLeftWidth)}px,0,0)`);
                }

                // content 最多滑多 30px
                swipeOutContent.css('transform', `translate3d(${Math.min(translate, actionsLeftWidth + 30)}px,0,0)`);
            }
        }

        function handleTouchEnd(event) {
            let e = event.originalEvent;

            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }

            isTouched = false;
            isMoved = false;
            let timeDiff = Date.now() - touchStartTime;
            let action, actionsWidth, actions, buttons, i;

            actions = direction === 'to-left' ? actionsRight : actionsLeft;
            actionsWidth = direction === 'to-left' ? actionsRightWidth : actionsLeftWidth;

            if (timeDiff < 300 && (touchesDiff < -10 && direction === 'to-left' || touchesDiff > 10 && direction === 'to-right') || timeDiff >= 300 && Math.abs(translate) > actionsWidth / 2) {
                action = 'open'
            } else {
                action = 'close';
            }


            if (timeDiff < 300) {
                if (Math.abs(translate) === 0) {
                    action = 'close';
                }
                if (Math.abs(translate) === actionsWidth) {
                    action = 'open';
                }
            }

            if (action === 'open') {
                $.weui.swipeOutOpenedEl = swipeOutEl;
                swipeOutEl.toggleClass('open');
                swipeOutEl.addClass('weui_swipeout_opened transitioning');
                let newTranslate = direction === 'to-left' ? -actionsWidth : actionsWidth;
                swipeOutContent.css('transform', `translate3d(${newTranslate}px,0,0)`);
                actions.addClass('weui_swipeout_actions_opened');
                buttons = direction === 'to-left' ? buttonsRight : buttonsLeft;
                if (buttons) {
                    for (i = 0; i < buttons.length; i++) {
                        $(buttons[i]).css('transform', `translate3d(${newTranslate }px, 0,0)`);
                    }
                }

                if (overswipeRight) {
                    actionsRight.find('.weui_swipeout_overswipe')[0].click();
                }
                if (overswipeLeft) {
                    actionsLeft.find('.weui_swipeout_overswipe')[0].click();
                }
            } else {
                $.weui.swipeOutOpenedEl = undefined;
                swipeOutEl.toggleClass('close')
                swipeOutEl.addClass('transitioning').removeClass('weui_swipeout_opened');
                swipeOutContent.css('transform', '');
                actions.removeClass('weui_swipeout_actions_opened');
            }

            let buttonOffset;
            if (buttonsLeft && buttonsLeft.length > 0 && buttonsLeft != buttons) {
                for (i = 0; i < buttonsLeft.length; i++) {
                    buttonOffset = buttonsLeft[i]._buttonOffset;
                    if (typeof buttonOffset === 'undefined') {
                        buttonsLeft[i]._buttonOffset = actionsLeftWidth -  buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
                    }
                    $(buttonsLeft[i]).css('transform', `translate3d(${buttonOffset}px,0,0)`);
                }
            }
            if (buttonsRight && buttonsRight.length > 0 && buttonsRight != buttons) {
                for (i = 0; i < buttonsRight.length; i++) {
                    buttonOffset = buttonsRight[i]._buttonOffset;
                    if (typeof buttonOffset === 'undefined') {
                        buttonsRight[i]._buttonOffset = actionsRightWidth -  buttonsRight[i].offsetRight - buttonsRight[i].offsetWidth;
                    }
                    $(buttonsRight[i]).css('transform', `translate3d(${buttonOffset }px,0,0)`);
                }
            }
        }

        $('.weui_cell_swipeout').on('touchstart', handleTouchStart);
        $('.weui_cell_swipeout').on('touchmove', handleTouchMove);
        $('.weui_cell_swipeout').on('touchend', handleTouchEnd);

        return this;
    }
    $.fn.swipeOut.noConflict = () => {
        return oldFnSwipeOut;
    }


    // 打开菜单
    let oldFnSwipeOutOpen = $.fn.swipeOutOpen;
    $.fn.swipeOutOpen = function (dir) {
        let el = $(this);

        if (el.length === 0) return;
        if (el.hasClass('weui_swipeout_opened')) {
            return;
        }
        if (!dir) {
            if (el.find('.weui_swipeout_actions_right').length > 0) {
                dir = 'right';
            } else {
                dir = 'left';
            }
        }
        let swipeOutActions = el.find(`.weui_swipeout_actions_${dir}`);
        if (swipeOutActions.length === 0) {
            return;
        }
        el.toggleClass('open').addClass('weui_swipeout_opened').removeClass('transitioning');
        swipeOutActions.addClass('weui_swipeout_actions_opened');
        let buttons = swipeOutActions.children('a');
        let swipeOutActionsWidth = swipeOutActions.outerWidth();
        let translate = dir === 'right' ? -swipeOutActionsWidth : swipeOutActionsWidth;
        if (buttons.length > 1) {
            for (let i = 0; i < buttons.length; i++) {
                if (dir === 'right') {
                    $(buttons[i]).css('transform', `translate3d(${-buttons[i].offsetLeft}px,0,0)`);
                } else {
                    $(buttons[i]).css('z-index', buttons.length - i)
                                 .css('transform', `translate3d(${swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft}px,0,0)`);
                }
            }
        }
        el.addClass('transitioning');
        for (let i = 0; i < buttons.length; i++) {
            $(buttons[i]).css('transform', `translate3d(${translate}px,0,0)`);
        }
        el.find('.weui_swipeout_content').css('transform', `translate3d(${translate}px,0,0)`).on('transitionend', () => {
            el.toggleClass('opened');
        })
        $.weui.swipeOutOpenedEl = el;
    }
    $.fn.swipeOutOpen.noConflict = () => {
        return oldFnSwipeOutOpen;
    }


    // 关闭菜单
    let oldFnSwipeOutClose = $.fn.swipeOutClose;
    $.fn.swipeOutClose = function () {
        let el = $(this);
        if (!el.hasClass('weui_swipeout_opened')) {
            return;
        }
        let dir = el.find('.weui_swipeout_actions_opened').hasClass('weui_swipeout_actions_right') ? 'right' : 'left';
        let swipeOutActions = el.find('.weui_swipeout_actions_opened').removeClass('weui_swipeout_actions_opened')
        let buttons = swipeOutActions.children('a');
        let swipeOutActionsWidth = swipeOutActions.outerWidth();
        $.weui.allowSwipeout = false;
        el.toggleClass('close')
        el.removeClass('weui_swipeout_opened').addClass('transitioning');

        let closeTO;
        function onSwipeoutClose() {
            $.weui.allowSwipeout = true;
            if (el.hasClass('weui_swipeou_openedt')) {
                return;
            }
            el.removeClass('transitioning');
            buttons.css('tranform', '');
            el.toggleClass('closed');
        }
        el.find('.weui_swipeout_content').css('transform', '').on('transitionend', onSwipeoutClose);
        closeTO = setTimeout(onSwipeoutClose, 500);
        for (let i = 0; i < buttons.length; i++) {
            if (dir === 'right') {
                $(buttons[i]).css('transform', `translate3d(${-buttons[i].offsetLeft}px, 0,0)`);
            } else {
                $(buttons[i]).css('transform', `translate3d(${swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft}px, 0,0)`);
            }
            $(buttons[i]).css({left: 0 + 'px'}).removeClass('weui_swipeout_overswipe_active');
        }
        if ($.weui.swipeOutOpenedEl && $.weui.swipeOutOpenedEl[0] === el[0]) {
            $.weui.swipeOutOpenedEl = undefined;
        }
    }
    $.fn.swipeOutClose.noConflict = () => {
        return oldFnSwipeOutClose;
    }


    // TODO 滑动删除
    let oldFnSwipeOutDelete = $.fn.swipeOutDelete;
    $.fn.swipeOutDelete = function () {
    }
    $.fn.swipeOutDelete.noConflict = () => {
        return oldFnSwipeOutDelete;
    }
})($);
