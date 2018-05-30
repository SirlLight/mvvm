/*
 * @Author: Sommer 
 * @Date: 2018-05-30 17:45:38 
 * @Last Modified by: Sommer
 * @Last Modified time: 2018-05-30 18:35:13
 */

//监控Sommer中data的变化
function observe (data) {
    Object.keys(data).forEach(function(key) {
        definePro(data, key, data[key]);
    });
}

function definePro (data, key, val) {
    var dep = new Dep();
    
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            //添加订阅者watcher到订阅者集合中
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return val;
        },
        set: function(newVal) {
            val = newVal;
            console.log('属性' + key + '已经被监听了，现在值为：' + newVal);
            //触发set函数后，发布者发出通知
            dep.notify();
        }
    });
}