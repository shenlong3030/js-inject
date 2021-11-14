var lazUrl = "https://www.lazada.vn/"; //-i1358457802.html
var toyProductsUrl = "https://toy1.phukiensh.com/lazop/products.php";
var toyProductUpdateUrl = "https://toy1.phukiensh.com/lazop/update_gui.php";

function copyToClipBoard(text) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

function inject(){
    console.log("inject");
    $(".toy").remove();
    $(".next-table-row.product-header-row").each(function( index ) {
        var idNode = $(this).find('.copy-text').first();
        var itemId = idNode.text();
        
        // show lazada link
        var href = lazUrl + "-i" + itemId + ".html";
        var link = $('<a style="margin-left:5px" class="toy laz-link" href="' + href + '" target="_blank">URL</a>');
        idNode.parent().append(link);
        
        // show toy link
        href = toyProductsUrl + "?item_id=" + itemId;
        link = $('<a style="margin-left:5px" class="toy" href="' + href + '" target="_blank">Toy</a>');
        idNode.parent().append(link);
        
        // show update link
        var expandRow = $(this).next();
        expandRow.find('.copy-text').each(function(){
            skuNode = $(this);
            var sku = skuNode.text();
            href = toyProductUpdateUrl + "?item_id=" + itemId + "&sku=" + sku;
            link = $('<a class="toy" href="' + href + '" target="_blank">Update</a>');
            skuNode.parent().append(link);
        });
    });
}

setTimeout(function(){
    inject();   

    // show button inject
    var body = $("body");
    var container = $('<div class="dialog"></div>');
    container.prependTo(body);
    container.dialog({
        position: { my: "right", at: "right"}
    });

    var btn = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Inject"/>');
    btn.appendTo(container);
    btn.click(function(){
        console.log("inject btn click");
        inject();
    });
    
    // show button copy URL
    var btn1 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Copy URLs"/>');
    btn1.appendTo(container);
    btn1.click(function(){
        var text = "";
        $(".laz-link").each(function(){
            text = text + $(this).attr('href') + "\n";
        });
        console.log("copy text : " + text );
        copyToClipBoard(text);
    });

    // show button copy URL
    var btn2 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Copy Names"/>');
    btn2.appendTo(container);
    btn2.click(function(){
        var text = "";
        $(".product-desc-link-image").each(function(){
            text = text + $(this).next().text() + "\n";
        });
        console.log("copy text : " + text );
        copyToClipBoard(text);
    });

    // show button select 
    var btn3 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Select highlighted orders"/>');
    btn3.appendTo(container);
    btn3.click(function(){
        console.log("btn3 click");
        var checkList = [];
        $(".chrome-extension-highlight").each(function(){
            var cbContainer = $(this).closest(".order-sub-table");
            var cbContainerId = cbContainer.attr("data-spm");
            if(!checkList.includes(cbContainerId)) {
                console.log(cbContainerId);
                checkList.push(cbContainerId);
                
                var cb = cbContainer.find("input[type=checkbox]:first");
                cb.click();
            }
        });
    });

    // button print MaVanChuyen
    var btn3_0 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Hiện 50 đơn"/>');
    btn3_0.appendTo(container);
    btn3_0.click(function(){
        $('p[data-spm="d_order_table_pagination_50"]').click();
    });

    var btn3_1 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Chọn các đơn hàng không tô màu"/>');
    btn3_1.appendTo(container);
    btn3_1.click(function() {
        // select all
        $('input[data-spm="d_table_checkall"]').click();

        // unselect highlighted
        setTimeout(function() {
            var checkList = [];
            $(".chrome-extension-highlight").each(function() {
                var cbContainer = $(this).closest(".order-sub-table");
                var cbContainerId = cbContainer.attr("data-spm");
                if (!checkList.includes(cbContainerId)) {
                    console.log(cbContainerId);
                    checkList.push(cbContainerId);

                    var cb = cbContainer.find("input[type=checkbox]:first");
                    cb.click();
                }
            });
        }, 2000);
    });

    // button print MaVanChuyen
    var btn4 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In mã vận chuyển"/>');
    btn4.appendTo(container);
    btn4.click(function(){
        $('.toolbar-container button[data-spm="d_print_module"]').click();
        $('li[title="In mã vận chuyển"]').click();
    });

    // button print HoaDon
    var btn5= $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In hóa đơn"/>');
    btn5.appendTo(container);
    btn5.click(function(){
        $('.toolbar-container button[data-spm="d_print_module"]').click();
        $('li[title="In hóa đơn"]').click();
    });

    // button print DanhSachSP
    var btn6 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In hóa đơn"/>');
    btn6.appendTo(container);
    btn6.click(function(){
        $('.toolbar-container button[data-spm="d_print_module"]').click();
        $('li[title="In danh sách sản phẩm được chọn"]').click();
    });

    // all button click, reinject
    $('.next-btn').click(function(){
        console.log("button click");
        setTimeout(function(){
            inject();
        }, 3000);
    });
    
    $( "input[name=title]" ).blur(function() {
        console.log("blur input");
        setTimeout(function(){
            inject();
        }, 3000);
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // tablesorter for picklist
    var config = {
        childList: true, 
        subtree: false
    };
    var observerCallbackTimer = null;
    var observer = new MutationObserver(function(mutations) {
        // if many changes occur continuously, 
        // only handle the last change
        if(observerCallbackTimer) {
            clearTimeout(observerCallbackTimer);
        }
        observerCallbackTimer = setTimeout(function(){
            $('.print-pick-list table tbody td').html(function(index,html){
                return  html.replace('Ốp lưng','Ốp')    // xóa chữ 'lưng' trong tên SP
                            .replace('[HCM]','');       // xóa [HCM] trong tên SP
            });
            $(".print-pick-list table").tablesorter();
        }, 1000);
    });
    observer.observe(document.body, config);
    ////////////////////////////////////////////////////////////////////////////////////////////////

}, 3000);
