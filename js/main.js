$(function () {

    imagesProgress();
    initNav();
    initScene1();
    initScene2();
    initScene3();

    // 顯示圖片載入狀況的進度
    function imagesProgress () {
        var $container = $('#progress'),                      //1
            $progressBar = $container.find('.progress-bar'),  //2
            $progreeText = $container.find('.progress-text'), //3
                //1.進度顯示的整體container
                //2.進度顯示的bar部分
                //3.進度顯示的text部分
            
            imgLoad = imagesLoaded('body'),   //4
            imgTotal = imgLoad.images.length, //5
            //4.利用imagesLoaded函式庫,監控body內圖片載入狀況
            //5.同時紀錄body內全部圖片的數量

            imgLoaded = 0, //6
            current = 0,   //7
            //6.已載入圖片之計數器
            //7.和進度顯示的當前數值 (初始值為0)
            
            progressTimer = setInterval(updateProgress, 1000 / 60);
            // 1秒60次檢查讀取狀況

        imgLoad.on('progress', function(){
            imgLoaded++;
        })
        // 利用imagesLoaded,加總每個已載入的圖片,紀錄其個數

        
        //依照圖片載入狀況更新進度顯示, 此函數因setInterval()方法每秒呼叫60次
        function updateProgress(){

            var target = (imgLoaded / imgTotal) * 100;
            //載入圖片後計算完成的百分比

            current += (target - current) * 0.1;
            //以current(當下位置)和targer(目的地)的距離計算easing

            $progressBar.css({ width: current + '%'});    //1
            $progreeText.text(Math.floor(current) + '%'); //2
            //1.顯示bar的寬度與text反應current的值
            //2.去除字串小數點的部分取整數
            
            //結束處理
            if(current >= 100)

                clearInterval(progressTimer);
                //停止進度顯示的更新
                
                $container.addClass('progess-complete');
                //附加完成的css樣式
                
                //同時處理進度顯示bar和字串的動畫
                //將其群組化為一個jQuery物件
                $progressBar.add($progreeText)
                    .delay(500)
                    //等待0.5秒
                    .animate({opacity:0}, 250, function(){
                        $container.animate({top: '-100%'}, 1000, 'easeInOutQuint');
                    });
                    //執行0.25秒的動畫,將進度顯示bar和字串變成透明時
                    //進行執行一秒的動畫,將overlap往上方slide out.
                
            
            //若current大於99.9, 則視為100並結束處理
            if (current > 99.9) {
                current = 100;
            }
        }
    }

    // Scene 1: 圖片序列的動畫
    function initScene1 () {
        var
            // 圖片container與當中所有圖片的jQuery物件
            $container = $('#scene-1 .image-sequence'),
            $images = $container.find('img'),

            //圖片總數與目前顯示圖片的index
            frameLength = $images.length,
            currentFrame = 0,
            
            // 動畫執行中會用到的數值
            counter = 0,  // 動畫執行狀況的counter
            velocity = 0, // 動畫的速度

            // 動畫的timer (初始為空)
            timer = null,

            // 圖片畫面比例 (width / height)
            imageAspectRatio = 864 / 486;

        // container上觸發滑鼠滾輪事件後執行處理
        $container.on('mousewheel', function(event, delta){
            // 對應滾輪方向計算速度
            if (delta < 0) {
                velocity += 1.5;
            } else if (delta > 0) {
                velocity -= 1.5;
            }
            // 呼叫動畫的開始函數
            startAnimation();
        });

        // 動畫的開始函數
        function startAnimation(){
            // 如果沒有執行的動畫，則執行動畫
            if(!timer) {
                // 每1/60 秒更新一次
                timer = setInterval(animateSequence, 1000 / 30);
            }
        }
        
        // 動畫的結束函數
        function stopAnimation () {
            clearInterval(timer);
            timer = null;
        }
       
        // 動畫函數
        function animateSequence () {
            // 下個顯示圖片的index
            var nextFrame;
            
            // 將速度乘上摩擦係數，讓每次呼叫的值越來越小
            velocity *= 0.9;

            // 檢驗速度，若值在0±0.00001的範圍則視為0並將其停止
            if (-0.00001 < velocity && velocity < 0.00001) {
                stopAnimation();
            } else {
                // 其他狀況則加總counter與velocity
                // カ並將counter的數值範圍限制在圖片數的範圍中
                counter = (counter + velocity) % frameLength;
            }

            // 將counter的數值取整數以表示該影格(frame)
            nextFrame = Math.floor(counter);
            if (currentFrame !== nextFrame) {
                $images.eq(nextFrame).show();
                $images.eq(currentFrame).hide();
                currentFrame = nextFrame;
            }
        }

        // 在container中維持圖片畫面比例並配置於整個顯示區域
        // 每次視窗大小有所改變則連動調整
        $(window).on('resize', function(){
            // 取得視窗寬度、高度
            var $window = $(this),
                windowWidth = $window.width();
                windowHeight = $window.height();

            // 比較圖片與視窗的圖片畫面比例
            // 調整container的大小與位置
            if (imageAspectRatio > windowWidth / windowHeight) {
                $container.css({
                    width: windowHeight * imageAspectRatio,
                    height: '100%',
                    top: 0,
                    left: (windowWidth - windowHeight * imageAspectRatio) / 2
                });
            } else {
                $container.css({
                    width: '100%',
                    height: windowWidth / imageAspectRatio,
                    top: (windowHeight - windowWidth / imageAspectRatio) / 2,
                    left: 0
                });
            }
        });

        // 初始時觸發視窗resize事件以進行調整
        $(window).trigger('resize');
    }

    // 顯示Scene 2
    function initScene2 () {
        $('#scene-2-content').css({ right: '-50%' });
    }

    // Scene 2 (2): 圖形描繪
    function activateScene2 () {
        var $content = $('#scene-2-content'),
            $charts = $content.find('.chart');

        // 內容從右側出現顯示
        $content.stop(true).animate({
            right: 0
        }, 1200, 'easeInOutQuint');


        // 各圓的處理
        $charts.each(function(){
            var $chart = $(this),
                // 保存遮罩、設定角度為0
                $circleLeft = $chart.find('.left .circle-mask-inner')
                 .css({ transform: 'rotate(0)' }),
                $circleRight = $chart.find('.right .circle-mask-inner')
                 .css({ transform: 'rotate(0)' }),
             // 取得百分比
             $percentNumber = $chart.find('.percent-number'),
             percentData = $percentNumber.text();
            
            // 設定百分比顯示為0
             $percentNumber.text(0);

            $({percent:0}).delay(1000).animate({percent: percentData}, {
                duration: 1500,
                progress: function(){
                    var now = this.percent,
                        deg = now * 360 / 100,
                        degRight = Math.min(Math.max(deg, 0), 180),
                        degLeft = Math.min(Math.max(deg - 180, 0), 180);
                    $circleRight.css({transform: 'rotate(' + degRight + 'deg)'});
                    $circleLeft.css({transform: 'rotate(' + degLeft + 'deg)'});
                    $percentNumber.text(Math.floor(now));
                }
            });
        });

    }

    
    // Scene 3: 遮罩動畫
    function initScene3 () {

        var $container = $('#scene-3'),        // container
            $masks = $container.find('.mask'), // mask
            $lines = $masks.find('.line'),     // 邊界線
            maskLength = $masks.length,       // mask總數
            
             // 儲存各mask切割區域資料的陣列
            maskData = [];

        // 儲存各mask切割區域的左側座標
        $masks.each(function(i){
            maskData[i] = { left: 0};
        });

        // 執行滑鼠移入、移出mask的處理
        $container.on({
            mouseenter: function(){
                resizeMask($(this).index());
            },
            mouseleave: function(){
                resizeMask(-1);
            }
        }, '.mask');
        
        // 設定各mask初始切割區域與邊界線
        resizeMask(-1);

        // 各mask切割區域與邊界線的動畫函數
        function resizeMask (active) {
            // 取得container的寬度、高度
            // 作為各切割區域右側、下側的座標
            var w = $container.width(),
                h = $container.height();

            // 處理各mask
            $masks.each(function (i){

                var $this = $(this), // 目前處理的mask
                    l;               // mask切割區域的左側座標

                // active = 滑鼠移入的mask index
                //          -1表示滑鼠為移出的狀態
                // i      = mask的index

                // 依照滑鼠事件計算mask切割區域左側的座標
                if (active === -1){
                    // 滑鼠移出時均等切割
                    l = w / maskLength * i ;
                } else if (active < i) {
                    // 以滑鼠移入的mask為基礎，調整其右側的mask
                    // 將這些切割區域左側往右邊調整
                    l = w * (1 - 0.1 * (maskLength - i));
                } else {
                    // 其他狀況將切割區域左側往左邊調整
                    l = w * 0.05 * i;
                }

                //設定動畫從儲存的左側座標(maskData[i])移動至l的數值
                $(maskData[i]).stop(true).animate({ left: l }, {
                    duration: 1000,
                    easing: 'easeOutQuart',
                    // 改寫mask與邊界線的CSS
                    progress: function () {
                        var now = this.left;
                        $this.css({
                            // 利用各數值組合rect()的參數
                            clip: 'rect(0px ' + w + 'px ' +
                                    h + 'px ' + now + 'px)'
                        });
                        $this.find($lines).css({
                            left: now
                        });
                    }
                });
            });
        }
    }

    // 瀏覽列初始化
    function initNav () {

        var $pageMain = $("#page-main"),
            $nav = $('#nav'),
            $navItem = $nav.find('li'),
            currentScene = 0;

        updateNav();

        $nav.on('click', 'a', function (event) {
            event.preventDefault();
            var i = $(this).closest($navItem).index();
            if (i === currentScene) {
                return;
            }
            if (i === 1) {
                initScene2();
            }
            currentScene = i;
            $pageMain.
                stop(true).
                animate({ top: - 100 * i + '%' }, 1200, 'easeInOutQuint', function () {
                    if (i === 1) {
                        activateScene2(); // Scene 2 描画
                    } else {
                        initScene2();
                    }
                });
            updateNav();
        });

        function updateNav () {
            $navItem.
                removeClass('active').
                eq(currentScene).addClass('active');
        }

    }

});
