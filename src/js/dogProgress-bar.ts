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

const ElementClass: string = 'dog-progress';
const MoveBarClass: string = 'move-bar';
const MoveBtnClass: string = 'move-btn';

export interface ProgressBarOptions {
    height?: string,
    width?: string,
    moveBtnPercentage?: number,
    moveBtnRadius?: string,
    horizontal?: boolean,
    step?: number
    handleProgressChange?: HandleProgressChange,

}


class DogProgressBar {
    options: ProgressBarOptions = {
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
         * @param event
         */
        handleProgressChange: (event: ProgressCustomEvent) => {}
    }
    element: Element;
    moveBar: HTMLElement;
    moveBtn: HTMLElement;
    isDragging: boolean = false;
    horizontal: boolean;
    moveBtnSelect: boolean = false;

    /**
     * 创建一个 ProgressBar 实例
     * @param element
     * @param options - 进度条的配置选项
     * @return void
     * @example
     *    let progressBars = document.querySelectorAll('.volume-progress');
     *     progressBars.forEach(item => new progressBar(item))
     */
    constructor(element: Element, options?: ProgressBarOptions) {
        if (!element) {
            console.error(`Element is "${element}"`);
            return;
        }
        this.element = element;
        this.options = Object.assign({}, this.options, options);
        this.horizontal = this.options.horizontal;
        let dataHorizontal: string = element.getAttribute('data-dogProgress-horizontal');
        if (dataHorizontal) {
            if (dataHorizontal === 'true') this.horizontal = true;
            if (dataHorizontal === 'false') this.horizontal = false;
        }
        this.init();
    }

    /**
     * 初始化Progress
     */
    init = () => {
        this.element.classList.add(ElementClass);
        if (!this.horizontal) {
            this.element.classList.add('progress-vertical')
        }

        let _element: HTMLElement = this.element as HTMLElement;
        _element.style.height = this.element.getAttribute('data-dogProgress-height') ?? this.options.height;
        _element.style.width = this.element.getAttribute('data-dogProgress-width') ?? this.options.width;
        _element.style.borderRadius = (this.element.clientHeight / 2) + 'px';
        _element.addEventListener('click', (event: MouseEvent) => {
            this.updateMoveBarWidthAndMoveBtnLeft(this.horizontal ? event.clientX : event.clientY);
        })
        this.buildMoveBar();
        this.element.addEventListener('positionChange', this.options.handleProgressChange)
        this.element.addEventListener('mouseover', (event: MouseEvent) => {
            this.addKeyboardListeners();
            this.showMoveBtn();
        })
        this.element.addEventListener('mouseout', (event: MouseEvent) => {
            this.removeKeyboardListeners();
            this.hideMovBtn();
        })
    }


    /**
     * 监听键盘事件
     */
    addKeyboardListeners = () => {
        this.removeKeyboardListeners()
        document.addEventListener('keydown', this.handleKeyboardNavigation)
    }

    /**
     * 移除键盘事件
     */
    removeKeyboardListeners = () => {
        document.removeEventListener('keydown', this.handleKeyboardNavigation);
    }

    /**
     * 键盘事件处理
     * @param event - KeyboardEvent
     */
    handleKeyboardNavigation = (event: KeyboardEvent) => {
        let eleRect: DOMRect = this.element.getBoundingClientRect(),
            moveBarRect: DOMRect = this.moveBar.getBoundingClientRect(),
            stepValue: number, mouseCurrentValue: number;
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
            this.updateMoveBarWidthAndMoveBtnLeft(mouseCurrentValue)
        } else {
            stepValue = (this.options.step / 100) * eleRect.height
            if (event.key === 'ArrowUp') {
                mouseCurrentValue = eleRect.top + (eleRect.height - (moveBarRect.height + stepValue));
            } else if (event.key === 'ArrowDown') {
                mouseCurrentValue = eleRect.top + (eleRect.height - (moveBarRect.height - stepValue));
            }
            this.updateMoveBarWidthAndMoveBtnLeft(mouseCurrentValue)
        }


    }

    /**
     * 展示moveBtn按钮
     */
    showMoveBtn = () => {
        this.moveBtn.style.visibility = 'unset';
        this.moveBtn.style.opacity = '1';
    }

    /**
     * 隐藏moveBtn按钮
     */
    hideMovBtn = () => {
        if (this.moveBtnSelect) return;
        this.moveBtn.style.visibility = 'hidden';
        this.moveBtn.style.opacity = '0';
    }


    /**
     * 绑定当bar发生变动时触发事件
     */
    bindPositionChange = () => {
        let rectValue: keyof DOMRect = this.horizontal ? 'width' : 'height';
        let changeEvent: ProgressCustomEvent = new CustomEvent('positionChange', {
            detail: {
                percentage: parseFloat((this.moveBar.getBoundingClientRect()[rectValue] /
                    this.element.getBoundingClientRect()[rectValue]
                ).toFixed(2)),
            }
        });
        // 触发 change 事件
        this.element.dispatchEvent(changeEvent);
    }

    /**
     * 构建moveBar
     */
    buildMoveBar = () => {
        let moveBar: HTMLElement = document.createElement('div'),
            styleValue: any = this.horizontal ? 'width' : 'height',
            percentageValue: number = +this.element.getAttribute('data-dogProgress-value') || this.options.moveBtnPercentage
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
    }

    /**
     * 构建MoveBtn
     */
    buildMoveBtn = () => {
        let moveBtn: HTMLElement = document.createElement('div'),
            positionValue: any = this.horizontal ? 'right' : 'top';
        moveBtn.classList.add(MoveBtnClass);
        moveBtn.style.height = this.options.moveBtnRadius;
        moveBtn.style.width = this.options.moveBtnRadius;
        this.moveBar.append(moveBtn);
        moveBtn.style[positionValue] = `-${moveBtn.offsetWidth / 2}px`;
        this.moveBtn = moveBtn;
        this.moveBtn.addEventListener('mousedown', () => {
            this.isDragging = true;
            this.moveBtnSelect = true;
            document.addEventListener('mousemove', this.onMousemove)
            document.addEventListener('mouseup', this.onMouseup)
        })
    }

    /**
     * 鼠标按下事件
     * @param event - mouseEvent
     */
    onMouseup = (event: MouseEvent) => {
        document.removeEventListener('mousemove', this.onMousemove);
        document.removeEventListener('mouseup', this.onMouseup)
        this.isDragging = false;
        this.moveBtnSelect = false;
        this.hideMovBtn();
        this.setUserSelect('');
    }

    /**
     * 鼠标移动事件
     * @param event - MouseEvent
     */
    onMousemove = (event: MouseEvent) => {
        if (!this.isDragging || !this.element || !this.moveBar || !this.moveBtn) return;
        this.setUserSelect('none');
        this.updateMoveBarWidthAndMoveBtnLeft(this.horizontal ? event.clientX : event.clientY)
    }

    /**
     * 更新moveBar和moveBarBtn的位置
     * @param client - number
     */
    updateMoveBarWidthAndMoveBtnLeft = (client: number) => {
        let eleRectValue: keyof DOMRect, eleRectStyleValue: keyof DOMRect, barValue: any, btnValue: any;
        if (this.horizontal) {
            eleRectValue = 'left';
            eleRectStyleValue = 'width';
            barValue = 'width';
            btnValue = 'right';
        } else {
            eleRectValue = 'top';
            eleRectStyleValue = 'height';
            barValue = 'height';
            btnValue = 'top';
        }


        requestAnimationFrame(() => {
            let eleRect: DOMRect = this.element.getBoundingClientRect(),
                mousePosition: number = client - eleRect[eleRectValue],
                btnPosition: number, barPosition: number,
                barPercentage: number, btnPercentage: number;
            let stepSize: number = eleRect[eleRectStyleValue] * (this.options.step / 100);
            if (this.horizontal) {
                barPosition = Math.max(0, Math.min(mousePosition, eleRect[eleRectStyleValue]));
                barPercentage = Math.min(100, (barPosition / eleRect.width) * 100);
                btnPosition = 0;
                if (barPosition < this.moveBtn.getBoundingClientRect().width) {
                    btnPosition = -(this.moveBtn.getBoundingClientRect().width - (+barPosition.toFixed(0)));
                }
            } else {
                barPosition = Math.round(Math.max(0, Math.min(eleRect[eleRectStyleValue] - mousePosition, eleRect[eleRectStyleValue])) / stepSize) * stepSize;
                barPercentage = (barPosition / eleRect.height) * 100;
                btnPosition = 0;
                if (mousePosition >= eleRect.height - this.moveBtn.getBoundingClientRect().height) {
                    btnPosition = Math.max(-this.moveBtn.offsetWidth, barPosition - this.moveBtn.offsetWidth);
                }
            }
            this.moveBar.style[barValue] = barPercentage + '%';
            this.moveBtn.style[btnValue] = btnPosition + 'px';
            this.bindPositionChange();
        })
    }

    /**
     * 设置用户选中避免拖动突出触发选中
     * @param value - string
     */
    setUserSelect = (value: string) => {
        document.body.style.userSelect = value;
    }
}


type ProgressEvent = {
    percentage: number
}
export type ProgressCustomEvent = CustomEvent<ProgressEvent>;

type HandleProgressChange = (event: ProgressCustomEvent) => void;

export default DogProgressBar;