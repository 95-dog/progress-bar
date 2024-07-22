'use strict';

/**
 *  ###########################################
 *
 * 注意事项：
 *
 * 如果设置了moveBar width的动画则会影响updateMoveBarWidthAndMoveBtnLeft方法
 *
 * 无法读取this.element.getBoundingClientRect()当前的值
 *
 * 因为此时浏览器还没有绘制完成 可使用setTimeout() 设置大于动画时间的延迟解决
 *
 * ############################################
 */
const ElementClass = 'dog-progress';
const MoveBarClass = 'move-bar';
const MoveBtnClass = 'move-btn';
class DogProgressBar {
    /**
     * 创建一个 ProgressBar 实例
     * @param element
     * @param options - 进度条的配置选项
     * @return void
     * @example
     *    let progressBars = document.querySelectorAll('.volume-progress');
     *     progressBars.forEach(item => new progressBar(item))
     */
    constructor(element, options) {
        this.options = {
            height: '10px',
            width: '100%',
            horizontal: true,
            //0-1
            moveBtnPercentage: 0,
            moveBtnRadius: '15px',
            //0-100
            step: 1,
            /**
             * 当进度条发生改变时触发事件
             *
             */
            handleProgressChange: () => { return; }
        };
        this.isDragging = false;
        this.moveBtnSelect = false;
        this.isMobile = false;
        /**
         * 初始化Progress
         */
        this.init = () => {
            this.mobile();
            this.element.classList.add(ElementClass);
            if (!this.horizontal) {
                this.element.classList.add('progress-vertical');
            }
            let _element = this.element;
            _element.style.height = this.element.getAttribute('data-dogProgress-height') ?? this.options.height;
            _element.style.width = this.element.getAttribute('data-dogProgress-width') ?? this.options.width;
            _element.style.borderRadius = (this.element.clientHeight / 2) + 'px';
            _element.addEventListener('click', (event) => {
                this.updateMoveBarWidthAndMoveBtnLeft(this.horizontal ? event.clientX : event.clientY);
            });
            this.buildMoveBar();
            this.element.addEventListener('positionChange', this.options.handleProgressChange);
            window.addEventListener('resize', () => {
                this.updateAddEventListenerStart();
            });
        };
        /**
         * 判断当前客户端是否为mobile并设置相关参数
         */
        this.mobile = () => {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.isMobile = true;
                this.element.classList.add('isMobile');
            }
            else {
                this.isMobile = false;
                this.element.classList.remove('isMobile');
            }
        };
        /**
         * 监听键盘事件
         */
        this.addKeyboardListeners = () => {
            this.removeKeyboardListeners();
            document.addEventListener('keydown', this.handleKeyboardNavigation);
        };
        /**
         * 移除键盘事件
         */
        this.removeKeyboardListeners = () => {
            document.removeEventListener('keydown', this.handleKeyboardNavigation);
        };
        /**
         * 键盘事件处理
         * @param event - KeyboardEvent
         */
        this.handleKeyboardNavigation = (event) => {
            let eleRect = this.element.getBoundingClientRect(), moveBarRect = this.moveBar.getBoundingClientRect(), stepValue, mouseCurrentValue;
            if (this.horizontal) {
                stepValue = (this.options.step / 100) * eleRect.width;
                if (event.key === 'ArrowLeft') {
                    mouseCurrentValue = Math.max(0, moveBarRect.width - stepValue) + eleRect.left;
                    // this.moveBar.style.width = `${Math.max(0, (moveBarRect.width - stepValue)).toFixed(1)}px`;
                }
                if (event.key === 'ArrowRight') {
                    mouseCurrentValue = Math.min(eleRect.width, (moveBarRect.width + stepValue)) + eleRect.left;
                    // 处理向右键的逻辑
                    // this.moveBar.style.width = `${Math.min(eleRect.width, (moveBarRect.width + stepValue)).toFixed(1)}px`;
                }
                this.updateMoveBarWidthAndMoveBtnLeft(mouseCurrentValue);
            }
            else {
                stepValue = (this.options.step / 100) * eleRect.height;
                if (event.key === 'ArrowUp') {
                    mouseCurrentValue = eleRect.top + (eleRect.height - (moveBarRect.height + stepValue));
                }
                else if (event.key === 'ArrowDown') {
                    mouseCurrentValue = eleRect.top + (eleRect.height - (moveBarRect.height - stepValue));
                }
                this.updateMoveBarWidthAndMoveBtnLeft(mouseCurrentValue);
            }
        };
        /**
         * 展示moveBtn按钮
         */
        this.showMoveBtn = () => {
            this.moveBtn.style.visibility = 'unset';
            this.moveBtn.style.opacity = '1';
        };
        /**
         * 隐藏moveBtn按钮
         */
        this.hideMovBtn = () => {
            if (this.moveBtnSelect)
                return;
            this.moveBtn.style.visibility = 'hidden';
            this.moveBtn.style.opacity = '0';
        };
        /**
         * 绑定当bar发生变动时触发事件
         */
        this.bindPositionChange = () => {
            let rectValue = this.horizontal ? 'width' : 'height';
            let changeEvent = new CustomEvent('positionChange', {
                detail: {
                    percentage: +(this.moveBar.getBoundingClientRect()[rectValue] /
                        this.element.getBoundingClientRect()[rectValue]).toFixed(2),
                }
            });
            // 触发 change 事件
            this.element.dispatchEvent(changeEvent);
        };
        /**
         * 构建moveBar
         */
        this.buildMoveBar = () => {
            let moveBar = document.createElement('div'), styleValue = this.horizontal ? 'width' : 'height', percentageValue = +this.element.getAttribute('data-dogProgress-value') || this.options.moveBtnPercentage;
            moveBar.classList.add(MoveBarClass);
            if (typeof percentageValue === 'number') {
                if (percentageValue < 0 || percentageValue > 1) {
                    throw new Error('moveBtnPercentage的值为0-1之间');
                }
                moveBar.style[styleValue] = `${percentageValue * 100}%`;
            }
            moveBar.style.borderRadius = (this.element.clientHeight / 2) + 'px';
            this.element.append(moveBar);
            this.moveBar = moveBar;
            this.buildMoveBtn();
        };
        /**
         * 构建MoveBtn
         */
        this.buildMoveBtn = () => {
            let moveBtn = document.createElement('div'), positionValue = this.horizontal ? 'right' : 'top';
            moveBtn.classList.add(MoveBtnClass);
            moveBtn.style.height = this.options.moveBtnRadius;
            moveBtn.style.width = this.options.moveBtnRadius;
            this.moveBar.append(moveBtn);
            moveBtn.style[positionValue] = `-${moveBtn.offsetWidth / 2}px`;
            this.moveBtn = moveBtn;
            this.addEventListenerStart();
        };
        /**
         * 更新事件监听
         */
        this.updateAddEventListenerStart = () => {
            this.mobile();
            this.addEventListenerStart();
        };
        /**
         * 更具当前客户端来移除和监听事件
         *
         */
        this.addEventListenerStart = () => {
            if (this.isMobile) {
                document.removeEventListener('mousedown', this.onMousedown);
                document.removeEventListener('mousemove', this.onMousemove);
                document.removeEventListener('mouseup', this.onMouseup);
                this.element.removeEventListener('mouseover', this.onElementMouseover);
                this.element.removeEventListener('mouseout', this.onElementMouseout);
                this.moveBtn.addEventListener('touchstart', this.onTouchstart, { passive: true });
            }
            else {
                document.removeEventListener('touchstart', this.onTouchstart);
                document.removeEventListener('touchmove', this.onTouchmove);
                document.removeEventListener('touchend', this.onTouchend);
                this.element.addEventListener('mouseover', this.onElementMouseover);
                this.element.addEventListener('mouseout', this.onElementMouseout);
                this.moveBtn.addEventListener('mousedown', this.onMousedown);
            }
        };
        /**
         * 鼠标移入progress-bar事件
         */
        this.onElementMouseover = () => {
            this.addKeyboardListeners();
            this.showMoveBtn();
        };
        /**
         * 鼠标移出progress-bar事件
         */
        this.onElementMouseout = () => {
            this.removeKeyboardListeners();
            this.hideMovBtn();
        };
        /**
         * 触摸开始事件
         */
        this.onTouchstart = () => {
            this.isDragging = true;
            this.moveBtnSelect = true;
            document.addEventListener('touchmove', this.onTouchmove, { passive: true });
            document.addEventListener('touchend', this.onTouchend);
        };
        /**
         * 触摸移动事件
         * @param event
         */
        this.onTouchmove = (event) => {
            if (!this.isDragging || !this.element || !this.moveBar || !this.moveBtn)
                return;
            let touch = event.touches[0];
            this.setUserSelect('none');
            this.updateMoveBarWidthAndMoveBtnLeft(this.horizontal ? touch.clientX : touch.clientY);
        };
        /**
         * 触摸结束事件
         */
        this.onTouchend = () => {
            document.removeEventListener('touchmove', this.onTouchmove);
            document.removeEventListener('touchend', this.onTouchend);
            this.isDragging = false;
            this.moveBtnSelect = false;
            this.setUserSelect('');
        };
        /**
         * 鼠标按下事件
         */
        this.onMousedown = () => {
            this.isDragging = true;
            this.moveBtnSelect = true;
            document.addEventListener('mousemove', this.onMousemove);
            document.addEventListener('mouseup', this.onMouseup);
        };
        /**
         * 鼠标抬起事件
         */
        this.onMouseup = () => {
            document.removeEventListener('mousemove', this.onMousemove);
            document.removeEventListener('mouseup', this.onMouseup);
            this.isDragging = false;
            this.moveBtnSelect = false;
            this.hideMovBtn();
            this.setUserSelect('');
        };
        /**
         * 鼠标移动事件
         * @param event - MouseEvent
         */
        this.onMousemove = (event) => {
            if (!this.isDragging || !this.element || !this.moveBar || !this.moveBtn)
                return;
            this.setUserSelect('none');
            this.updateMoveBarWidthAndMoveBtnLeft(this.horizontal ? event.clientX : event.clientY);
        };
        /**
         * 更新moveBar和moveBarBtn的位置
         * @param client - number
         */
        this.updateMoveBarWidthAndMoveBtnLeft = (client) => {
            let eleRectValue, eleRectStyleValue, barValue, btnValue;
            if (this.horizontal) {
                eleRectValue = 'left';
                eleRectStyleValue = 'width';
                barValue = 'width';
                btnValue = 'right';
            }
            else {
                eleRectValue = 'top';
                eleRectStyleValue = 'height';
                barValue = 'height';
                btnValue = 'top';
            }
            requestAnimationFrame(() => {
                let eleRect = this.element.getBoundingClientRect(), mousePosition = client - eleRect[eleRectValue], btnPosition, barPosition, barPercentage, moveBtnRect = this.moveBtn.getBoundingClientRect();
                let stepSize = eleRect[eleRectStyleValue] * (this.options.step / 100);
                if (this.horizontal) {
                    barPosition = Math.max(0, Math.min(mousePosition, eleRect[eleRectStyleValue]));
                    barPercentage = Math.min(100, (barPosition / eleRect.width) * 100);
                    btnPosition = 0;
                    if (barPosition < moveBtnRect.width) {
                        btnPosition = -(moveBtnRect.width - (+barPosition.toFixed(0)));
                    }
                }
                else {
                    barPosition = Math.round(Math.max(0, Math.min(eleRect[eleRectStyleValue] - mousePosition, eleRect[eleRectStyleValue])) / stepSize) * stepSize;
                    barPercentage = (barPosition / eleRect.height) * 100;
                    btnPosition = 0;
                    if (mousePosition >= eleRect.height - moveBtnRect.height) {
                        btnPosition = Math.max(-this.moveBtn.offsetWidth, barPosition - this.moveBtn.offsetWidth);
                    }
                }
                this.moveBar.style[barValue] = barPercentage + '%';
                this.moveBtn.style[btnValue] = btnPosition + 'px';
                this.bindPositionChange();
            });
        };
        /**
         * 设置用户选中避免拖动突出触发选中
         * @param value - string
         */
        this.setUserSelect = (value) => {
            document.body.style.userSelect = value;
        };
        if (!element) {
            console.error(`Element is "${element}"`);
            return;
        }
        this.element = element;
        this.options = Object.assign({}, this.options, options);
        this.horizontal = this.options.horizontal;
        let dataHorizontal = element.getAttribute('data-dogProgress-horizontal');
        if (dataHorizontal) {
            if (dataHorizontal === 'true')
                this.horizontal = true;
            if (dataHorizontal === 'false')
                this.horizontal = false;
        }
        this.init();
    }
}

module.exports = DogProgressBar;
//# sourceMappingURL=dogProgress-bar.cjs.js.map
