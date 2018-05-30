/*
 * @Author: Sommer 
 * @Date: 2018-05-30 17:13:09 
 * @Last Modified by: Sommer
 * @Last Modified time: 2018-05-30 18:44:32
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
            frag.append(child);    //append进文档片段之后，dom中的该节点会自动删除，所以child永远都是第一个子节点，直到子节点劫持完成为止
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