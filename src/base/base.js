/*
* @Author: yanghcc
* @Date:   2017-03-14 13:22:02
* @Last Modified by:   yanghcc
* @Last Modified time: 2017-03-14 15:06:00
*/

window.addEventListener('resize', infinite);
		function infinite() {
		    const html = document.getElementsByTagName('html')[0];
		    const htmlWidth = document.body.clientWidth
		    if (htmlWidth >= 1080) {
		        html.style.fontSize = '42px';
		    } else {
		        html.style.fontSize = (42/ 1080 * htmlWidth) + 'px';
		    }
		}infinite();