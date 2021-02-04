const axios = require('axios');
const crypto = require('crypto');
// const data = JSON.stringify({ sn: 'IEBEXB', cmd: 1000, data: { digital: 2, msg: 'run' }, nonceStr: Date.now() });

const key  = "33964CC86982625588cc4d2B717527B0"
const chan = 'bee-CHHSQT'
const key_token = "token"
const key_chan  = "chan"

axios.defaults.baseURL = "http://mqtt.ibeelink.com/api/ext/tissue";
axios.interceptors.request.use(config => {
    config.headers.chan = "bee-CHHSQT"
    return config;
});

/**
 * 控制出货
 * @param {} sn 
 * @param {*} digital 
 */
async function setDeliver(sn, digital) {
    const data = JSON.stringify({ sn, cmd: 1000, data: { digital, msg: 'run' }, nonceStr: Date.now() })
    const md5 = crypto.createHash("md5");
    const token = md5.update(data + key).digest('hex');
    const resp = await axios.post('/pub-cmd', { data }, {
        headers: {
            token
        }
    })
    console.log(resp.data)
    return resp.data
}

/**
 * 获取设备信息
 * @param String sn 
 */
async function getDeviceInfo(sn) {
    const params = JSON.stringify({nonceStr: Date.now(), sn})
    const md5 = crypto.createHash("md5");
    const token = md5.update(params + key).digest('hex');
    const resp = await axios.get(`/device/info?data=${encodeURI(params)}`, {
        headers: {
            token
        }
    })
    return resp.data
}



module.exports = {
    setDeliver,
    getDeviceInfo
}