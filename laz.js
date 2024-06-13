// https://www.toptal.com/developers/javascript-minifier/

//console.log("3");
var lazUrl = "https://www.lazada.vn/"; //-i1358457802.html
var toyProductsUrl = "https://toy1.phukiensh.com/lazop/products.php";
var toyProductUpdateUrl = "https://toy1.phukiensh.com/lazop/update_gui.php";
var toyProductDel = "https://toy1.phukiensh.com/lazop/del.php";
var toyProductUpdateApiUrl = "https://toy1.phukiensh.com/lazop/api_update.php";

function copyToClipBoard(text) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

function injectToys(canDel = 0) {
    console.log("inject toys");
    $(".toy").remove();
    
    // find link "Chỉnh sửa", extract itemID
    $("a[data-spm='d_action_edit']").each(function(index) {
        var words = $(this).attr('href').split('productId=');
        var itemId = words[words.length - 1];
        var productNode = $(this).closest("tr");
        productNode.attr("item_id", itemId);
        var nextNode = productNode.next(".next-table-expanded-row");
        if(nextNode) {
            nextNode.find("tr").each(function(){
                $(this).attr("item_id", itemId);
            });
        }
    });
    
    // find SKU node, extract SKU
    $("span.item-id .safe-html-text.high-light-word").each(function() {
        var rowNode = $(this).closest("tr");
        var priceCell = rowNode.find("td[data-next-table-col=2] div").first();
        var qtyCell = rowNode.find("td[data-next-table-col=3] div").first();
        var itemId = rowNode.attr("item_id");
        
        var sku = $(this).text().trim();
        var href = toyProductUpdateUrl + `?sku=${sku}~~${itemId}`;
        var ulink = $('<a class="toy" href="' + href + '" target="_blank">Update</a>');
        ulink.appendTo(priceCell);

        //## can not change qty and delete product anymore because the API need SKUid, but we don't have it
    });
}

function expandSKUs(){
    // show all SKUs
    $("button[data-spm=d_sku_expand]").click();    
}

function createControlDialog(){
    var body = $("body");
    var container = $('<div class="dialog"></div>');

    var btn = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Inject toys"/>');
    btn.appendTo(container);
    btn.click(function() {
        injectToys();
    });
    
    btn = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Expand SKUs"/>');
    btn.appendTo(container);
    btn.click(function() {
        expandSKUs();
    });
    
    btn = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Copy ID sản phẩm"/>');
    btn.appendTo(container);
    btn.click(function() {
        let txt = $(".order-field-order-line-id .order-field-value").append(",").text();
        copyToClipBoard(txt);
        alert(txt);
    });

    // show button copy URL
    var btn1 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Copy URLs"/>');
    btn1.appendTo(container);
    btn1.click(function() {
        var text = "";
        $(".laz-link").each(function() {
            text = text + $(this).attr('href') + "\n";
        });
        console.log("copy text : " + text);
        copyToClipBoard(text);
    });

    // show button DEL
    var btn11 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="DEL"/>');
    btn11.appendTo(container);
    btn11.click(function() {
        injectToys(1);
    });

    var btn2 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Hiện tất cả"/>');
    btn2.appendTo(container);
    btn2.click(function() {
        $('span.next-pagination-size-selector-dropdown').click();
        setTimeout(function(){
            $('.next-overlay-wrapper.opened li:last-child').click();
        },100);
    });

    var btn3_1 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Chọn các đơn hàng không tô màu"/>');
    btn3_1.appendTo(container);
    btn3_1.click(function() {
        // select all
        console.log("select orders");
        $('.list-toolbar-head input[type="checkbox"]').click();

        var flagList = [];
        // unselect highlighted
        setTimeout(function() {
            console.log("unselect highlighted");
            $(".chrome-extension-highlight").each(function() {
                var cbContainer = $(this).closest(".list-item");
                var header = cbContainer.find(".list-item-header");
                var orderNumber = header.find(".order-field-value").text();
                
                if(!flagList[orderNumber]) { // only click once every order row
                    var cb = header.find("input[type=checkbox]:first");
                    cb.click();
                    flagList[orderNumber] = 1;
                }
            });
        }, 500);
    });

    // button print MaVanChuyen
    var btn4 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In mã vận chuyển"/>');
    btn4.appendTo(container);
    btn4.click(function() {
        $('.order-toolbar-actions-left button[data-spm^="d_button_batch_print"]').click();
    });

    // button print HoaDon
    var btn5 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In hóa đơn"/>');
    btn5.appendTo(container);
    btn5.click(function() {
        $('.order-toolbar-actions-left button.next-split-btn-trigger').click();
        setTimeout(function() {
            $('.next-overlay-wrapper.opened li[title="In hóa đơn"]').click();
        }, 200);
    });

    // button print DanhSachSP
    var btn6 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In danh sách SP"/>');
    btn6.appendTo(container);
    btn6.click(function() {
        $('.order-toolbar-actions-left button.next-split-btn-trigger').click();
        setTimeout(function() {
            $('.next-overlay-wrapper.opened li[title="In danh sách chọn"]').click();
        }, 200);
    });

    // button close dialog
    var btn7 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Close"/>');
    btn7.appendTo(container);
    btn7.click(function() {
       container.remove();
    });
    
    if(window.location.href.includes("print")) {
        //do nothing
    } else {
        container.prependTo(body);
        container.dialog({
            position: { my: "left bottom", at: "left bottom", width: 270}
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////
// auto inject script when product list change
function observeProductListChange(){
    console.log("observing product list change");
    var config = {
        childList: true,
        subtree: true
    };
    var callbackTimer = null;

    var observer = new MutationObserver(function(mutationRecords) {
        mutationRecords.some(function(record) {
            // log all records to debug
            // if(record.addedNodes.length){
            //     console.log(record);
            // }

            // detect product list tab changes: div.next-tabs-tabpane.active
            if (record.addedNodes.length && $(record.target).hasClass("next-tabs-tabpane")) {
                console.log("changes detected");
                if (callbackTimer) {
                    clearTimeout(callbackTimer);
                }
                callbackTimer = setTimeout(injectToys, 1000);
                return true; // break loop
            }
            // detect product expand: tbody.next-table-body
            if (record.addedNodes.length && $(record.target).hasClass("next-table-body")) {
                console.log("changes detected");
                if (callbackTimer) {
                    clearTimeout(callbackTimer);
                }
                callbackTimer = setTimeout(injectToys, 300);
                return true; // break loop
            }
        });
    });
    observer.observe(document.body, config);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// handle printing pick list
function sortPickListPrintPage(){
    var shadowRoot = $(".la-print-page")[0].shadowRoot;
    var sheet = new CSSStyleSheet();
    sheet.replaceSync('.la-print-page { width: auto !important; }');
    sheet.insertRule('.print-pick-list { width: auto !important; }');
    //sheet.insertRule('.la-print-page th:nth-child(3) { min-width: 500px!important; }');
    shadowRoot.adoptedStyleSheets = [sheet];
    
    var tb = shadowRoot.querySelector('.print-pick-list table');

    // convert DOM tb to jquery $(tb)
    $(tb).find('td').html(function(index, html) {
        return html.replace('Ốp lưng', 'Ốp') // xóa chữ 'lưng' trong tên SP
            .replace('[HCM]', '') // xóa [HCM] trong tên SP
            .replace(/Nhóm Màu:([^,-]+)/, '<br>Màu:<font color="red">$1</font>')
            .replace(/Dòng sản phẩm tương thích:([^,-]+)/, '<br>Dòng:<font color="red">$1</font>')
            .replace(/(chống sốc)/, '<font color="red">$1</font>');

    });
    $(tb).tablesorter();
}

var urlregex = /chat/i;
if(urlregex.test(window.location.href)) {
    console.log("no script for CHAT page");
    exit();
}

urlregex = /print/i;
if(urlregex.test(window.location.href)) {
    console.log("detected print page");
    setTimeout(sortPickListPrintPage, 3000);
    exit();
}

window.addEventListener("load", (event) => {    
    console.log("window loaded");
    setTimeout(injectToys, 2000);
    setTimeout(createControlDialog, 1000);
    observeProductListChange();
});


