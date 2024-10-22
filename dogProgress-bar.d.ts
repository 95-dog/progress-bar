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
import '../css/progress-bar.scss';
export interface ProgressBarOptions {
    height?: string;
    width?: string;
    moveBtnPercentage?: number;
    moveBtnRadius?: string;
    horizontal?: boolean;
    step?: number;
    handleProgressChange?: HandleProgressChange;
}
declare class DogProgressBar {
    options: ProgressBarOptions;
    element: Element;
    moveBar: HTMLElement;
    moveBtn: HTMLElement;
    isDragging: boolean;
    horizontal: boolean;
    moveBtnSelect: boolean;
    isMobile: boolean;
    /**
     * 创建一个 ProgressBar 实例
     * @param element
     * @param options - 进度条的配置选项
     * @return void
     * @example
     *    let progressBars = document.querySelectorAll('.volume-progress');
     *     progressBars.forEach(item => new progressBar(item))
     */
    constructor(element: Element, options?: ProgressBarOptions);
    /**
     * 初始化Progress
     */
    init: () => void;
    /**
     * 判断当前客户端是否为mobile并设置相关参数
     */
    mobile: () => void;
    /**
     * 监听键盘事件
     */
    addKeyboardListeners: () => void;
    /**
     * 移除键盘事件
     */
    removeKeyboardListeners: () => void;
    /**
     * 键盘事件处理
     * @param event - KeyboardEvent
     */
    handleKeyboardNavigation: (event: KeyboardEvent) => void;
    /**
     * 展示moveBtn按钮
     */
    showMoveBtn: () => void;
    /**
     * 隐藏moveBtn按钮
     */
    hideMovBtn: () => void;
    /**
     * 绑定当bar发生变动时触发事件
     */
    bindPositionChange: () => void;
    /**
     * 构建moveBar
     */
    buildMoveBar: () => void;
    /**
     * 构建MoveBtn
     */
    buildMoveBtn: () => void;
    /**
     * 更新事件监听
     */
    updateAddEventListenerStart: () => void;
    /**
     * 更具当前客户端来移除和监听事件
     *
     */
    addEventListenerStart: () => void;
    /**
     * 鼠标移入progress-bar事件
     */
    onElementMouseover: () => void;
    /**
     * 鼠标移出progress-bar事件
     */
    onElementMouseout: () => void;
    /**
     * 触摸开始事件
     */
    onTouchstart: () => void;
    /**
     * 触摸移动事件
     * @param event
     */
    onTouchmove: (event: TouchEvent) => void;
    /**
     * 触摸结束事件
     */
    onTouchend: () => void;
    /**
     * 鼠标按下事件
     */
    onMousedown: () => void;
    /**
     * 鼠标抬起事件
     */
    onMouseup: () => void;
    /**
     * 鼠标移动事件
     * @param event - MouseEvent
     */
    onMousemove: (event: MouseEvent) => void;
    /**
     * 更新moveBar和moveBarBtn的位置
     * @param client - number
     */
    updateMoveBarWidthAndMoveBtnLeft: (client: number) => void;
    /**
     * 设置用户选中避免拖动突出触发选中
     * @param value - string
     */
    setUserSelect: (value: string) => void;
}
type ProgressEvent = {
    percentage: number;
};
export type ProgressCustomEvent = CustomEvent<ProgressEvent>;
type HandleProgressChange = (event: ProgressCustomEvent) => void;
export default DogProgressBar;
