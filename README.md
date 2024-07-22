## 进度条

这是一个使用TypeScript编写的可自定义进度条组件。它支持水平和垂直方向的进度显示，支持键盘导航和鼠标拖动来调整进度。
该组件具有高度的可配置性，并且易于集成到您的网页项目中。

## 使用方法

要使用 DogProgressBar，您需要导入该类并创建一个实例，将目标元素和选项作为参数传递。

### 示例

~~~
<link rel="stylesheet" href="/dist/css/dogProgress-bar.css">
<script type="module">
    import DogProgressBar from '/dist/js/dogProgress-bar.es.js';

    const progressBarElement = document.querySelector('.test-progress');
    const options = {
        height: '10px',
        width: '80%',
        moveBtnPercentage: 0.5,
        moveBtnRadius: '15px',
        horizontal: true,
        step: 5,
        handleProgressChange: (event) => {
            console.log('进度改变：', event.detail.percentage);
        }
    };

    new DogProgressBar(progressBarElement, options);
</script>
~~~

or

~~~
<link rel="stylesheet" crossorigin href="/dist/css/dogProgress-bar.css">
<script src='/dist/js/dogProgress-bar.umd.js'></script>

const progressBarElement = document.querySelectorAll('.test-progress');
const options = {
    height: '10px',
    width: '80%',
    moveBtnPercentage: 0.5,
    moveBtnRadius: '15px',
    horizontal: true,
    step: 5,
    handleProgressChange: (event) => {
        console.log('进度改变：', event.detail.percentage);
    }
};
progressBarElement.forEach((item) => {
       new DogProgressBar(item, options)
   })
~~~

## 配置选项

#### DogProgressBar 支持以下配置选项：

配置也可以通过data-dogProgress-*传递，适用于多个进度条使用。

例：data-dogProgress-height="10px"

* height: 进度条的高度，默认为 '10px'。
* width: 进度条的宽度，默认为 '100%'。
* moveBtnPercentage: 移动按钮初始位置的百分比（0-1），默认为 0。
* moveBtnRadius: 移动按钮的半径，默认为 '15px'。
* horizontal: 进度条是否为水平，默认为 true。
* step: 键盘导航时的步长，默认为 1。
* handleProgressChange: 进度条变化时的回调函数(event.detail.percentage 返回当前进度条所处位置百分比)。

## 方法

`init()`

初始化进度条，设置初始样式和事件监听器。

`addKeyboardListeners()`

添加键盘事件监听器，用于键盘导航。

`removeKeyboardListeners()`

移除键盘事件监听器。

`handleKeyboardNavigation(event: KeyboardEvent)`

处理键盘导航事件。

`showMoveBtn()`

显示移动按钮。

`hideMovBtn()`

隐藏移动按钮。

`bindPositionChange()`

绑定进度条位置改变事件，触发自定义事件。

`buildMoveBar()`

构建移动条。

`buildMoveBtn()`

构建移动按钮。

`onMouseup(event: MouseEvent)`

处理鼠标松开事件。

`onMousemove(event: MouseEvent)`

处理鼠标移动事件。

`updateMoveBarWidthAndMoveBtnLeft(client: number)`

更新移动条和移动按钮的位置。

`setUserSelect(value: string)`

设置用户选中状态，避免拖动过程中触发选中。

### 自定义事件

`positionChange`

当进度条位置发生改变时触发。事件对象包含以下属性：

* percentage: 当前进度的百分比（0-1）。
