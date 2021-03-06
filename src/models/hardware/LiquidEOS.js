import {ExternalWalletInterface} from '../ExternalWallet'
import * as Http from '../../util/Http'
import PopupService from '../../services/PopupService';
import {Popup} from '../popups/Popup';

export default class LiquidEOS {

    constructor(){

    }

    static typeToInterface(){
        const url = 'http://raspberrypi.local:3000';
        return new ExternalWalletInterface({
            sign(publicKey, trx, abi){
                const popup = Popup.checkHardwareWalletScreen();
                PopupService.push(popup);
                return Http.post(url, {publicKey, trx, abi}).then(res => {
                    PopupService.remove(popup);
                    if(!res || !res.hasOwnProperty('signature')) return null;
                    return res.signature;
                }).catch(err => {
                    PopupService.remove(popup);
                    return err;
                })
            },
            getPublicKey(){ return Http.get(url).then(res => {
                if(!res) return null;
                return res.key
            })},
            async canConnect(){
                return true;
            },
        });
    };

}