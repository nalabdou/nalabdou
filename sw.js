const progressier = new function(){
	let that = this;
	this.domain = window.location.origin;
	this.cookies = new ProgressierCookies(that);
	this.theme = new ProgressierTheme(that);
	this.utils = new ProgressierUtils(that);
	this.sw = new ProgressierSw(that);
	this.data = new ProgressierData(that);
	this.app = new ProgressierApp(that);
	this.install = that.app.install;
	this.prompt = new ProgressierPrompt(that);
	this.push = new ProgressierPush(that);
	this.user = new ProgressierUser(that);
}

function ProgressierUtils(){
	let that = this;
	
	this.urlBase64ToUint8Array = function(base64String) {
		let padding = '='.repeat((4 - base64String.length % 4) % 4);
		let base64 = (base64String + padding) .replace(/\-/g, '+') .replace(/_/g, '/');
		let rawData = window.atob(base64);
		let outputArray = new Uint8Array(rawData.length);
		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

	
	this.randomId = function(){
		let characters =  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; 
		let id = "";
		for (let i=0;i<15;i++) { id += characters.substr(Math.floor((Math.random() * characters.length)), 1)}
		return id;
	}

	this.styling = function(content, id){
		let styleNode = document.getElementById(id) || that.node('style', {id: id, parent: document.querySelector('body')});
		styleNode.innerHTML = content;
	}
	
	this.lets = async function (method, route, data, additionalHeaders){
		if (method !== "GET"&&method !== "POST"){throw "the type should be GET or POST"};
		let headers = { 'Content-Type': 'application/json'};
		if (additionalHeaders){for (let x in additionalHeaders){headers[x] = additionalHeaders[x];}}
		let config = { method: method, headers: headers}
		if (data){ config.body = data ? JSON.stringify(data) : {}; }
			
		let response = await fetch(route, config);
		if (response.status !== 200 && response.status !== 201){ throw response.statusText};
		let body = await response.text();	
		let res = null;
		if (body){
			try {	res = JSON.parse(body) } catch(error){}
		}
		return res;
	};
	
	this.node = function(type, classes, attributes){
		let node = document.createElement(type);
		//@CLASSES
		//string: "cool-class"
		//array: ['cool-class', 'cool-class-2']
		//space separated string: 'cool-class cool-class-2'
		//object: you can also pass an object, and in this case it will be processed as attributes instead
		if (classes && typeof classes === "object" && Array.isArray(classes) && classes.length > 0){
			classes.forEach(function(c){ node.classList.add(c)})
		}
		else if (classes && typeof classes === "string"){
			let split = classes.split(" ");
			split.forEach(function(c){
				node.classList.add(c);
			})
		}
		else if (classes &&typeof classes === "object"){
			attributes = classes;
		}
	
		//pass objects as attributes. If you pass class or classes as attributes, it will be processed as class above
		if (attributes && typeof attributes === "object"){
			for (let x in attributes){
				switch (x){
					case "text": node.textContent = attributes[x]; break;
					case "html": node.innerHTML = attributes[x]; break;
					case "classes": attributes[x].forEach(function(c){ node.classList.add(c)}); break;
					case "class": node.classList.add(c); break;
					case "background": node.style.background = attributes[x]; break;
					case "color": node.style.color = attributes[x]; break;
					case "parent": attributes[x].appendChild(node); break;
					case "click": node.addEventListener('click', attributes[x]); break;
					case "touchstart": node.addEventListener('touchstart', attributes[x]); break;
					case "hover": node.addEventListener('hover', attributes[x]); break;
					case "change": node.addEventListener('change', attributes[x]); break;
					case "focus": node.addEventListener('focus', attributes[x]); break;
					case "mouseenter": node.addEventListener('mouseenter', attributes[x]); break;
					case "scroll": node.addEventListener('scroll', attributes[x]); break;
					case "input": node.addEventListener('input', attributes[x]); break;
					case "value": node.value = attributes[x]; break;
					case "animate": setTimeout(function(){   for (let z in attributes[x]){ if (z === "ms"){continue};  node.style[z] = attributes[x][z];  } }, attributes[x].ms); break;
					default: node.setAttribute(x, attributes[x]);
				}
			}
		}
	
		return node;
		
	}
	
}

function ProgressierData(parent){
	let that = this;
	this.id = null;
	this.params = {};
	this.parent = parent;
	this.version = 1;
	this.getId = function(){
		let tag = 'data-progressier-id';
		let script = document.querySelector('*['+tag+']');
		if (!script){throw "Invalid script"};
		let appId = script.getAttribute(tag);
		if (!appId){throw "No appId specified"};
		that.id = appId;
	}
	
	this.promptHeader = async function(){
		await that.downloadDetails();
		return that.params&&that.params.promptHeader ? that.params.promptHeader : "Stay updated using our web app";
	}
	
	this.themeColor = async function(){
		await that.downloadDetails();
		return that.params&&that.params.themeColor ? that.params.themeColor : "#000";
	}
	
	this.downloadDetails = async function(){ 
		if (that.params.name){return};
		let data = await parent.utils.lets('GET', '/get-app-details?version='+that.version+'&id='+that.id);
		that.params = data;
	}
	
	this.init = async function(){
		try {
			that.getId();
			await that.downloadDetails();
		} 
		catch(error){
			console.log(error);
			throw error;
		}
	}
	
	this.init();
}

function ProgressierTheme(){
	this.main = "#ff416c";	
	this.transparent = 'transparent';
	this.white = '#fff';
	this.text = '#565656';
	this.hover = "rgba(255, 255, 255, 0.4)";
	this.boxShadow = `0 1px 3px 0 rgba(0,0,0,.25)`;
	this.fontFamily = `"Roboto", "Helvetica Neue", Arial, sans-serif`;
	this.transition = `all 0.3s ease-in-out`;
}

function ProgressierCookies(){
	let that = this;

	this.set = function(name, value, days){
		let d = new Date();
		d.setTime(d.getTime() + (days*24*60*60*1000));
		let expires = "expires="+ d.toUTCString();
		document.cookie = name + "=" + value + ";" + expires + ";path=/";
	}
	
	this.get = function(cname){
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i <ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
};

function ProgressierUser(parent){
	let that = this;
	this.id = null;
	this.parent = parent;
	this.appId = function(){return that.parent.data.id};
	this.cookieName = '_'+that.appId();
	
	this.retrieve = function(){
		let id = that.parent.cookies.get(that.cookieName);
		if (!id){return};
		that.id = id;
	}
	
	this.saveId = function(id){
		that.id = id;
		parent.cookies.set(that.cookieName, that.id, 8000);
	}
	
	this.save = async function(data){
		data.appId = that.appId();
		if (that.id){data.id = that.id};
		let res = await progressier.utils.lets('POST', '/save-user', data);
		if (!that.id && res.id){
			that.saveId(res.id);
		}
	}
	
	that.retrieve();
}

function ProgressierPush(parent){
	let that = this;
	this.denied = false;
	this.allowed = false;
	this.subscription = null;
	this.compatible = true;
	this.parent = parent;
	this.serverKey = "BMgdnVPoufKLyzqer3aIea4xPFPupfeH2ijPBT6we2Wl18wgH82geOPMBWP5QBxn-MEX7MeTfQ6FCE20pn5qxwQ";
	this.config = { userVisibleOnly: true, applicationServerKey: that.parent.utils.urlBase64ToUint8Array(that.serverKey) };
	
	this.pushManager = function(){
		if (!progressier||!progressier.sw||!progressier.sw.reg||!progressier.sw.reg.pushManager){return};
		return progressier.sw.reg.pushManager;
	}
	
	this.isDenied = async function(){
		let pM = that.pushManager()
		if (!pM){return false};
		let status = await pM.permissionState(that.config);
		if (status === "denied"){return true}
		else {return false};
	}
	
	this.save = async function(sub){
		progressier.user.save({pushSubscription: sub, pushIsActive: true});
	}
	
	this.prompt = async function(){
		await that.getSubscription();
		if (that.subscription){return that.subscription};
		if (!that.allowed){return null};	
		try {
			let pM = that.pushManager();
			if (!pM){return null};
			let sub = await pM.subscribe(that.config)
			if (sub){ that.save(sub); return sub; }
			else { that.denied = true; return null; }
		} catch(error){
			that.denied = true;
			return null;
		}
	}
	
	this.getSubscription = async function(){
		try {
			if (await that.isDenied()){ that.compatible = false; that.allowed = false; return}  //denied permission before
			let pM = that.pushManager();
			if (!pM){  that.compatible = false; that.allowed =  false; return } //random error	
			let sub = await pM.getSubscription()
			if (sub){    that.compatible = true; that.subscription = sub; that.allowed =  false; return } //we are already subscribed
			that.compatible = true; that.allowed =  true; return ; //we are not subscribed
		} 
		catch(error){
			that.compatible = false;  that.allowed =  false; return ; //we cannot subscribe because of an error
		}
	}

}

function ProgressierPrompt(parent){
	//https://web.dev/promote-install/
	let that = this;
	this.timer = null;
	this.element = null;
	this.parent = parent;
	this.className = "progressier-prompt";
	this.animationClass = "animated";
	this.theme = that.parent.theme;
	this.styling = async function(){
		let themeColor = await that.parent.data.themeColor();
		return `.`+that.className+`{
			display:flex;
			box-shadow: `+that.theme.boxShadow+`;
			flex-direction: column;
			opacity:0.9;
			position: fixed;
			top: -400px;
			right: -400px;
			width: 250px;
			height:220px;
			z-index: 9999999999;
			font-family: `+that.theme.fontFamily+`;
			justify-content: center;
			align-items: center;
			background: `+themeColor+`;
			border-bottom-left-radius: 100px;
			transition: `+that.theme.transition+`;		
		}
		.`+that.className+`.`+that.animationClass+`{
			top:0px;
			right:0px;
		}
		@media (max-width:991px){
			.`+that.className+`{
				border-bottom-left-radius: 0px;
				border-top-right-radius:10px;
				border-top-left-radius:10px;
				top:unset;
				bottom:-500px;
				left:0px;
				right:unset;
				height:200px;
				width:100vw;
				max-width:100vw;
			}
			.`+that.className+`.`+that.animationClass+`{
				top:unset;
				right:unset;
				bottom:0px;
				left:0px;
			}
		}
		.`+that.className+` h3{
			color: `+that.theme.white+`;
			text-align: center;
			padding:10px;
			margin-top:0px;
			white-space: pre-wrap;
		}
		.`+that.className+ ` > div{
			display:flex;
			flex-direction:column;
		}
		.`+that.className+ ` button:first-child{
			outline: 0px;
			border: 0px;
			padding: 10px 20px;
			border-radius: 20px;
			font-weight:600;
			margin:0px 10px;
			width:100%;
			color::`+that.theme.text+`;
			background: `+that.theme.white+`;
			cursor:pointer;
			box-shadow:none;
			transition: `+that.theme.transition+`;	
		}
		.`+that.className+ ` button:first-child:hover{
			transform:scale(1.1);
			-webkit-transform:scale(1.1);
		}
		.`+that.className+ ` button:nth-child(2){
			outline: 0px;
			border: 0px;
			padding: 10px 20px;
			border-radius: 20px;
			color:#fff;
			margin:5px 10px 5px 10px;
			width:100%;
			background:`+that.theme.transparent+`;
			cursor:pointer;
			box-shadow:none;
		}
		.`+that.className+ ` button:nth-child(2):hover{
			background: `+that.theme.hover+`;
		}
		.`+that.className+ ` a{
			font-size: 10px;
			display:none;
			font-weight: 500;
			text-decoration: none;
			position: absolute;
			bottom: 10px;
			right: 5px;
			z-index: 99999;
			color: rgba(0, 0, 0, 0.26);
		} `;
	}
	
	this.wait = function(){
		return;
		that.timer = setInterval(that.create, 50);
	}

	
	this.install = async function(){
		that.remove();
		await progressier.app.install();
		await progressier.push.prompt();
	}
	
	this.cancel = async function(){
		await progressier.push.prompt();
		that.remove();
	}
	
	this.header = async function(){
		return await parent.data.promptHeader();
	}
		
	this.remove = function(){
		if (!that.element){return};
		that.element.classList.remove(that.animationClass);
		setTimeout(function(){
			that.element.remove();
		}, 500);
	}

	this.create = async function(){
		let body = document.querySelector('body');
		if (!body){return};
		if (!progressier.app.installable){return};
		clearInterval(that.timer);
		let exists = document.querySelector('.'+that.className);
		if (exists){return};
		let promptHeader = await that.header();
		let styling = await that.styling();
		progressier.utils.styling(styling, that.className);
		that.element = progressier.utils.node('div', that.className, {parent: body});
		progressier.utils.node('h3', {parent: that.element, text: promptHeader});
		let buttons = progressier.utils.node('div', {parent: that.element});
		progressier.utils.node('button', {text: "Install", click: that.install, parent: buttons});
		progressier.utils.node('button', {text: "Now now", click: that.cancel, parent: buttons});
	//	progressier.utils.node('a', {target: '_blank', href: "https://progressier.com", text: "powered by Progressier", parent: that.element, });
		
		setTimeout(function(){
			that.element.classList.add(that.animationClass);
		})
	}

	this.wait();
	
}

function ProgressierApp(){
	
	let that = this;
	this.installable = false;
	this.prompt = null;
	this.compatible = false;
	this.isStandalone = false;
	
	this.removeButton = function(){
		progressier.prompt.remove();
	}
	
	this.markStandlone = function(){
		that.isStandalone = true;
		that.installable = false;
		that.removeButton();
	}
	
	this.checkIfStandalone = function(){
		window.addEventListener('DOMContentLoaded', () => {
		  if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
			 that.markStandlone();
		  }
		});
		
		window.addEventListener('DOMContentLoaded', () => {
			 window.matchMedia('(display-mode: standalone)').addListener((e) => {
				if (e.matches) {
					that.markStandlone();
				}
				else {
					that.isStandalone = false;
				}
			});
		});
	}
	
	this.detectInstallPrompt = function(){
		//beforeinstallprompt fires when the app is ready to be installed
		window.addEventListener('beforeinstallprompt', (e) => {
			that.compatible = true;
			that.installable = true; //the app is ready to be installed. 
			that.prompt = e;
		});	
	}
	
	this.listenToAppInstallSuccess = function(){
		//this fires after the app has been installed either via our UI or the browser's UI
		window.addEventListener('appinstalled', async function(e) {
			that.installable = false; //the app is installed already
			that.prompt = null;
			progressier.prompt.remove();
			await that.save();
		});
	}
	
	this.register = function(){
		that.checkIfStandalone();
		that.detectInstallPrompt();
		that.listenToAppInstallSuccess();
	}
		
	this.install = function(){
		return new Promise(function(resolve, reject){
			if (!that.installable){
				return reject("The app may already be installed or your browser may not support this function");
			};
			let body = document.querySelector('body');
			body.addEventListener('click', async function(){
				let installed = await that.oninstall();
				return resolve(installed);
			}, {once: true});
		})
	}
	
	this.save = async function(){
		await progressier.user.save({appInstalled: true});
	}
	
	this.oninstall = async function(e){
		if (!that.prompt){return false};
		that.prompt.prompt();
		let result = await that.prompt.userChoice;
	    if (result&&result.outcome === 'accepted') {
			return true;
		}
		else {
			that.installable = true; //the app is not installed
			return false;
		}
	}
	
	this.register();
}

function ProgressierSw(parent){
	let that = this;
	this.version = 1;
	this.parent = parent;
	this.reg = null;
	
	this.sw = function(){
		return window.location.origin+"/progressier.js?v="+that.version;
	}

	this.init = async function(){
		if ('serviceWorker' in navigator !== true){return};
		navigator.serviceWorker.register(that.sw())
		.then(function(reg){
			that.reg = reg;
		})
		.catch(function(error){
			console.log(error);
		})
	}
	
	this.init();
}
