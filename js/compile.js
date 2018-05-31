/*
 * @Author: Sommer 
 * @Date: 2018-05-30 17:13:09 
 * @Last Modified by: Sommer
 * @Last Modified time: 2018-05-31 18:37:59
 */

function Compile (node, sommer) {
    return this.node2Fragment(node, sommer);
}

Compile.prototype = {
    //编译dom流程：
    // 1.将挂载目标的所有子节点劫持到DocumentFragment
    // 2.然后针对不同的节点类型进行解析数据绑定的处理

    node2Fragment: function (node, sommer) {
        var _this = this,
            child,
            frag = document.createDocumentFragment();

        while(child = node.firstChild) {
            _this.handleBind(child, sommer);
            //将所有子节点添加到fragment中，child是指向元素首个子节点的引用。将child引用指向的对象append到父对象的末尾，原来child引用的对象就跳到了frag对象的末尾，而child就指向了本来是排在第二个的元素对象。如此循环下去，链接就逐个往后跳了
            frag.append(child);    
        }

        return frag;
    },
    handleBind: function (node, sommer) {
        var reg = /\{\{(.*)\}\}/;   //文本插入分隔符正则匹配，vue可以通过delimiters:['${', '}']进行配置

        //根据节点类型进行分别处理，1----元素节点，3----文本节点
        if (node.nodeType === 1) {
            var attr = node.attributes,
                attrLen = attr.length;
            
            for (var i = 0; i < attrLen; i++) {
                //解析s-model属性
                if (attr[i].nodeName == "s-model") {
                    var modelName = attr[i].nodeValue;  //获取s-model绑定的属性名

                    node.addEventListener("input", function (e) {
                        //更改data中的相应属性，触发这个属性的set方法
                        sommer.data[modelName] = e.target.value;
                    });

                    //node.value = sommer.data[modelName];    //将数据赋值给节点
                    node.removeAttribute("s-model");    //移除节点上的s-model属性
                    new Watcher(sommer, node, modelName, "value");
                }
            }
            
        }

        if (node.nodeType === 3) {
            if (reg.test(node.nodeValue)) {
                var name = RegExp.$1.trim();  //匹配到的分隔符里的字符串
                //node.nodeValue = sommer.data[name];    //将数据模型中的该属性值赋值给这个节点
                new Watcher(sommer, node, name, "nodeValue");
            }
        }
    }
};