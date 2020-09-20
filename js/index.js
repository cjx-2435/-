window.addEventListener("load", function () {
    //前一张焦点图
    var prev = document.querySelector(".prev");
    //后一张焦点图
    var next = document.querySelector(".next");
    //焦点图区域元素对像
    var focus = document.querySelector(".focus");
    //焦点图ul
    var ul = focus.querySelector("ul");
    //焦点图圆点控件
    var circle = document.querySelector(".circle");
    //获取焦点图的宽度
    var focusWidth = focus.offsetWidth;
    //当前是第几张焦点图
    var num = 0;
    //点击前后切换控件改变圆点控件变量circle_index
    var circle_index = 0;
    //设置节流阀控制变量flag
    var flag = true;

    //圆点选定排他函数(清空所有圆点类名)
    function current() {
        for (var i = 0; i < circle.children.length; i++) {
            circle.children[i].className = "";
        }
    }
    //通过for循环根据轮播图图片数量创造圆点控件,并随即绑定点击事件和索引
    for (var i = 0; i < ul.children.length; i++) {
        var li = document.createElement("li");
        circle.appendChild(li);
        circle.children[0].className = "current";
        circle.children[i].setAttribute("data-index", i);
        circle.children[i].addEventListener("click", function () {
            if (flag) {
                flag = false;//节流阀开启
                current();
                this.className = "current";
                //根据索引切换图片
                var index = this.getAttribute("data-index");
                animate(ul, - index * focusWidth, function () {
                    flag = true;//节流阀关闭
                });
                //点击后同步控制变量
                num = index;
                circle_index = index;
            }
        })
    }
    //在生成圆点控件之后（深）克隆第一张焦点图，并追加到最后一张焦点图后面，使图片向后切换至最后一张图片时实现无缝滚动
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);
    //图片前后切换控件绑定点击事件
    //向后切换
    next.addEventListener("click", function () {
        if (flag) {
            flag = false; //节流阀开启
            //判断是否为最后一张图片，是则快速切换到第一张
            if (num == circle.children.length) {
                num = 0;
                ul.style.left = - num * focusWidth + "px";
            }
            num++;
            animate(ul, - num * focusWidth, function () {
                flag = true;//节流阀关闭
            });
            circle_index++;
            //如果控制变量等于了圆点控件个数，就说明到最后一张图片了，则需要切换为0
            circle_index = circle_index == circle.children.length ? circle_index = 0 : circle_index;
            current();
            circle.children[circle_index].className = "current";
        }
    })
    //向前切换
    prev.addEventListener("click", function () {
        if (flag) {
            flag = false; //节流阀开启
            //判断是否为第一张图片，是则快速切换到最后一张
            if (num == 0) {
                num = circle.children.length;
                ul.style.left = - num * focusWidth + "px";
            }
            num--;
            animate(ul, - num * focusWidth, function () {
                flag = true;//节流阀关闭
            });
            circle_index--;
            //如果控制变量等于了圆点控件个数，就说明到第一张图片了，则需要切换值为圆点控件长度
            circle_index = circle_index == -1 ? circle.children.length - 1 : circle_index;
            current();
            circle.children[circle_index].className = "current";
        }
    })
    //鼠标经过焦点图区域显示更换焦点图控件
    focus.addEventListener("mouseover", function () {
        prev.style.display = "block";
        next.style.display = "block";
        clearInterval(autoPlay);
        autoPlay = null;
    });
    //鼠标经过焦点图区域隐藏更换焦点图控件
    focus.addEventListener("mouseout", function () {
        prev.style.display = "none";
        next.style.display = "none";
        autoPlay = setInterval(function () {
            next.click();
        }, 2000);
    });
    //自动播放轮播图
    var autoPlay = setInterval(function () {
        next.click();
    }, 2000);
})