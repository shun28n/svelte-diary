import { writable } from 'svelte/store';
import Cookies from 'js-cookie';

const cookie = Cookies.get('uid');
console.log('Console in uid :' + cookie);
// CookienにuidがあればCookieのuidを使う
export const userId = writable(cookie ? cookie : null);

