/*
 * @Author: Sommer 
 * @Date: 2018-05-30 17:45:38 
 * @Last Modified by:   Sommer 
 * @Last Modified time: 2018-05-30 17:45:38 
 */

//监控Sommer中data的变化
function observe (data) {
    Object.keys(data).forEach(function(key) {
        definePro(data, key, data[key]);
    });
}

function definePro (data, key, val) {

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            return val;
        },
        set: function(newVal) {
            val = newVal;
            console.log('属性' + key + '已经被监听了，现在值为：' + newVal);
        }
    });
}