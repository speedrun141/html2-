/*
 *  maid-system  Ver.1.21
 *  Copyright (C)2004.5.22 by みなみせい (http://ig.sakura.ne.jp/~sei/)
 */
/*
 *  maid-systemR
 *  2006.12.02 Modified		+:vGrp,tGrp,name=_
 *  2006.12.09 Modified2	+:sOpc -:,a
 *  2006.12.27 Modified3	vGrp,tGrp同時使用時の改良
 */
var IDhead_img	= "img-";
var IDhead_sw	= "sw-";
var IDhead_swnm	= "swnm-";

var nowImgNo;
var preImgNo;
var oplist;
var imgs = [];

/*
 *  その他の関数
 */
var ua = new function()
{
	if (document.getElementById) {
		var test = document.getElementsByTagName("body")[0];

		if (this.GENERIC	= ("undefined" != typeof test.innerHTML)) {
			this.STDCSS		= ("undefined" != typeof test.style.opacity);
			this.MOZ		= ("undefined" != typeof test.style.MozOpacity);
			this.IE5		= ("undefined" != typeof test.filters);
			this.WINIE55	= ("undefined" != typeof [].push && this.IE5);
		}
	}
}


function parseParam(arg)
{
	var		i, j, wk, wklist = [], arglist = [];

	wk = arg.replace(/\s/g, "").split(";");
	for (i = 0; i < wk.length; i++) {
		wklist[i] = wk[i].replace(/:/, ",").split(",");
	}

	for (i = 0; i < wklist.length; i++) {
		for (j = 1; j < wklist[i].length; j++) {
			arglist[wklist[i][0] + j] = wklist[i][j];
		}
	}

	return arglist;
}

/*
 *  Imgオブジェクト
 */
function Img(name, set, vGname, tGname, sOpnum)
{
	this.name = name;
	
	this.vGname = vGname;
	this.tGname = tGname;
	this.sOpnum = sOpnum;
	this.vtF = "";
	
	this.opacityListIndex = 0;
	this.visible = [];
	this.eff = new Effect(this);

	this._eImg;
	this._eOpacity;

	for (var i = 0; i < set.length; i++) {
		this.visible[i] = ('1' == set.charAt(i));
	}
}

Img.prototype.setVisibility = function(sts)
{
	this._eImg.style.visibility = (sts) ? "visible" : "hidden";
}

Img.prototype.setOpacity = function(suu)
{
	if (ua.STDCSS) {
		this._eOpacity.style.opacity = suu / 100;
	}
	else if (ua.MOZ) {
		this._eOpacity.style.MozOpacity = suu / 100;
	}
	else if (ua.IE5) {
		with (this._eOpacity.filters.alpha) {
			enabled = true;	// 常に有効にする
			opacity = suu;
		}
	}
}

Img.prototype.fixup = function(no)
{
	this._eOpacity = this._eImg = document.getElementById(IDhead_img + no);

	if ("SPAN" == this._eOpacity.tagName) {
		this._eOpacity = this._eOpacity.parentNode;  // AlphaImageLoaderを使用している場合
	}

}


/*
 *  Effectオブジェクト
 */
function Effect(obj)
{
	this._super = obj;
}

Effect.prototype.setVisibility = function(sts)
{
	with (this._super) {
		setVisibility(sts);
	}
}

Effect.prototype.setOpacity = function(suu)
{
	with (this._super) {
		setOpacity(suu);
	}
}


/*
 *  画像の読み込み
 */
function baseimg(src)
{
	if (ua.GENERIC) {
		document.write('<img src="' + src + '" alt="" id="baseimg" style="position:absolute; left:0; top:0; visibility:hidden">\n');
	}
}


function img()
{
	var		wk, x, y, name, vGname, tGname, sOpnum, arg = [];
	var		no = imgs.length;

	if (!ua.GENERIC) {
		return;
	}

	arg = parseParam(arguments[0]);

	x = (wk = arg.pos1) ? wk : 0;
	y = (wk = arg.pos2) ? wk : 0;
	name = (wk = arg.name1) ? wk : ("画像" + no);

	vGname = (wk = arg.vGrp1) ? wk : ("画像" + no);
	tGname = (wk = arg.tGrp1) ? wk : "";
	sOpnum = (wk = arg.sOpc1) ? wk : "100";


	if (ua.WINIE55 /*&& ("a" == arg.src2)*/) {
		/*
		 *  WinIE5.5以降専用 24bitアルファチャネルPNG 画像の表示
		 *  正常に表示されなくなるので、外側の要素でopacityを設定
		 *  最大表示サイズは 480x640 ピクセルまで (下のstyleから変更可能)
		 */
		document.write(
			'<span style="position:absolute; left:0; top:0; width:480px; height:640px; z-index:' + no +
			'; filter:alpha(opacity=100, enabled=0)"><span id="' + IDhead_img + no +
			'" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + arg.src1 +
			'); position:absolute; left:' + x +
			'px; top:' + y +
			'px; visibility:hidden">&nbsp;</span></span>\n');
	}
	else {
		document.write(
			'<img src="' + arg.src1 +
			'" id="' + IDhead_img + no +
			'" alt="' + name +
			'" style="position:absolute; left:' + x +
			'px; top:' + y +
			'px; z-index:' + no +
			'; opacity:1.0; visibility:hidden">\n');
	}



	imgs[imgs.length] = new Img(name, (wk = arg.set1) ? wk : "1", vGname, tGname, sOpnum);

}


/*
 *  イベント処理
 */
function swnmFocus(mode) //名前欄選択時色変え
{
	var vn = imgs[nowImgNo].vGname;

	for (var i = 0; i < imgs.length; i++) {
		if (imgs[i].vGname == vn){
			if ((imgs[i].name != "@") && (imgs[i].name != "_")){
				with (document.getElementById(IDhead_swnm + i).style) {
					backgroundColor = ("on" == mode) ? "#3060FF" : "#DBE4FA";
					color = ("on" == mode) ? "#FFFFFF" : "#444488";
				}
			}
		}
	}
}


function swnmPressed(e) //名前欄選択時表示ON+チェック
{
	swnmFocus("off");
	nowImgNo = this.id.substr(IDhead_swnm.length);
	swnmFocus("on");

	var vn = imgs[nowImgNo].vGname;

	for (var i = 0; i < imgs.length; i++) {
		if (imgs[i].vGname == vn){
			imgs[i].eff.setVisibility(true);
			if ((imgs[i].name != "@") && (imgs[i].name != "_")){
				document.getElementById(IDhead_sw + i).checked = true;
			}
		}
	}

	oplist.selectedIndex = imgs[nowImgNo].opacityListIndex;

}


function swChanged(e) //チェックボックストグル
{
	var	no = this.id.substr(IDhead_sw.length);

	imgs[no].eff.setVisibility(document.getElementById(IDhead_sw + no).checked);

	var vn = imgs[no].vGname;

	for (var i = 0; i < imgs.length; i++) {
		if (i != no){
			if (imgs[i].vGname == vn){
				imgs[i].eff.setVisibility(document.getElementById(IDhead_sw + no).checked);
				if ((imgs[i].name != "@") && (imgs[i].name != "_")){
					if (document.getElementById(IDhead_sw + i).checked != true){
						document.getElementById(IDhead_sw + i).checked = true;
					} else {
						document.getElementById(IDhead_sw + i).checked = false;
					}
				}
			}
		}
	}
}


function opacitySelected(e) //不透明度選択
{
	if (!imgs.length) {
		return;
	}

	var vn = imgs[nowImgNo].vGname;

	for (var i = 0; i < imgs.length; i++) {
		if (imgs[i].vGname == vn){
			imgs[i].opacityListIndex = oplist.selectedIndex;
			imgs[i].eff.setOpacity(oplist.options[oplist.selectedIndex].value);
		}
	}
}


function setSelected(e) //セット選択
{
	var		i, t, setno, k;

	if (!imgs.length) {
		return;
	}

	oplist.selectedIndex = 0;
	setno = document.getElementById("set-list").selectedIndex;

	for (i = 0; i < imgs.length; i++) {
		imgs[i].opacityListIndex = Math.round(10 - imgs[i].sOpnum / 10);
		imgs[i].eff.setOpacity(imgs[i].sOpnum);

		imgs[i].setVisibility(imgs[i].visible[setno]);

		if ((imgs[i].name != "@") && (imgs[i].name != "_")){
			document.getElementById(IDhead_sw + i).checked = imgs[i].visible[setno];
		}											//
		if ((imgs[i].tGname != "") && (imgs[i].vGname != "画像" + i)){
			for (k = 0; k < imgs.length; k++) {
				if (imgs[k].vGname == imgs[i].vGname){
					imgs[k].vtF = imgs[i].tGname;
				}
			}
		}
	}
}

function swnmPressedtg(e) //名前欄選択時表示ON+チェック トグル
{
	swnmFocus("off");
	nowImgNo = this.id.substr(IDhead_swnm.length);
	swnmFocus("on");

	imgs[nowImgNo].eff.setVisibility(true);
	document.getElementById(IDhead_sw + nowImgNo).checked = true;

	var vnv = imgs[nowImgNo].vGname;
	var vn = imgs[nowImgNo].tGname;

if (preImgNo != nowImgNo){ //前に選んだのと違う場合
	for (var i = 0; i < imgs.length; i++) {
		if (i != nowImgNo){ //現在のと別ので
			if (imgs[i].tGname == vn){	//現在のと同じトグルネームの他の画像は
				imgs[i].eff.setVisibility(false); //消せ
				document.getElementById(IDhead_sw + i).checked = false; //チェックも外せ
			}
			if (imgs[i].vtF == vn){	//現在のと同じトグルで描かされた画像は
				imgs[i].vtF = ""; //どのトグルネームで描かされたか消去して
				imgs[i].eff.setVisibility(false); //消せ
				if ((imgs[i].name != "@") && (imgs[i].name != "_")){　//特殊で無いなら
						document.getElementById(IDhead_sw + i).checked = false; //チェックも外せ
				}
			}
			if (imgs[i].vGname == vnv){	//現在のと同じグループネームの画像は
				imgs[i].vtF = vn; //どのトグルネームで描かされたか入れとけ
				imgs[i].eff.setVisibility(true); //描け
				if ((imgs[i].name != "@") && (imgs[i].name != "_")){　//特殊で無いなら
						document.getElementById(IDhead_sw + i).checked = true; //チェックも入れとけ
				}
			}
		}
	}
	preImgNo = nowImgNo;
}

	oplist.selectedIndex = imgs[nowImgNo].opacityListIndex;

}


function swChangedtg(e) //ラジオボタントグル
{
	swnmFocus("off");
	nowImgNo = this.id.substr(IDhead_sw.length);
	swnmFocus("on");

	imgs[nowImgNo].eff.setVisibility(true);
	document.getElementById(IDhead_sw + nowImgNo).checked = true;

	var vnv = imgs[nowImgNo].vGname;
	var vn = imgs[nowImgNo].tGname;

if (preImgNo != nowImgNo){ //前に選んだのと違う場合
	for (var i = 0; i < imgs.length; i++) {
		if (i != nowImgNo){ //現在のと別ので
			if (imgs[i].tGname == vn){	//現在のと同じトグルネームの他の画像は
				imgs[i].eff.setVisibility(false); //消せ
				document.getElementById(IDhead_sw + i).checked = false; //チェックも外せ
			}
			if (imgs[i].vtF == vn){	//現在のと同じトグルで描かされた画像は
				imgs[i].vtF = ""; //どのトグルネームで描かされたか消去して
				imgs[i].eff.setVisibility(false); //消せ
				if ((imgs[i].name != "@") && (imgs[i].name != "_")){　//特殊で無いなら
						document.getElementById(IDhead_sw + i).checked = false; //チェックも外せ
				}
			}
			if (imgs[i].vGname == vnv){	//現在のと同じグループネームの画像は
				imgs[i].vtF = vn; //どのトグルネームで描かされたか入れとけ
				imgs[i].eff.setVisibility(true); //描け
				if ((imgs[i].name != "@") && (imgs[i].name != "_")){　//特殊で無いなら
						document.getElementById(IDhead_sw + i).checked = true; //チェックも入れとけ
				}
			}
		}
	}
	preImgNo = nowImgNo;
}

	oplist.selectedIndex = imgs[nowImgNo].opacityListIndex;

}

function init()
{
	var		i, t, wk;
	var		gn = [];

	if (!imgs.length) {
		return;
	}

	wk = '<table>\n';
	for (i = imgs.length -1; i >= 0; i--) {

		if (imgs[i].name == "@"){
		} else if (imgs[i].name == "_"){
			wk += '<tr><td></td><td><br></td></tr>\n';
		} else if (imgs[i].tGname == ""){
			wk += '<tr><td><input id="' + IDhead_sw + i +
				'" type="checkbox"' + ((imgs[i].visible[0]) ? " checked" : "") +
				'></td><td class="swnm" id="' + IDhead_swnm + i +
				'">' + imgs[i].name +
				'</td></tr>\n';
		} else {
			wk += '<tr><td bgcolor="#eed8e8"><input id="' + IDhead_sw + i +
				'" type="radio"' + ((imgs[i].visible[0]) ? " checked" : "") +
				'></td><td class="swnm" id="' + IDhead_swnm + i +
				'">' + imgs[i].name +
				'</td></tr>\n';
		}

	}
	wk += '</table>\n';
	document.getElementById("img-list").innerHTML = wk;

	nowImgNo = imgs.length -1;
	preImgNo = nowImgNo;

	swnmFocus("on");

	oplist = document.getElementById("opacity-list");
	document.getElementById("baseimg").style.visibility = "visible";

	vtFset();

	for (i = 0; i < imgs.length; i++) {


		if ((imgs[i].name != "_") && (imgs[i].name != "@")){						//
				if (imgs[i].tGname == ""){							//
					document.getElementById(IDhead_sw + i).onclick = swChanged;
					document.getElementById(IDhead_swnm + i).onmousedown = swnmPressed;
				} else {									//
					document.getElementById(IDhead_sw + i).onclick = swChangedtg;		//
					document.getElementById(IDhead_swnm + i).onmousedown = swnmPressedtg;	//
				}										//
		}												//

		imgs[i].fixup(i);

		imgs[i].opacityListIndex = Math.round(10 - imgs[i].sOpnum / 10);			//
		imgs[i].eff.setOpacity(imgs[i].sOpnum);							//

		imgs[i].setVisibility(imgs[i].visible[0]);

	}
}

function vtFset()
{

	var i, k;

	for (i = 0; i < imgs.length; i++) {
		if ((imgs[i].tGname != "") && (imgs[i].vGname != "画像" + i)){
			for (k = 0; k < imgs.length; k++) {
				if (imgs[k].vGname == imgs[i].vGname){
					imgs[k].vtF = imgs[i].tGname;
				}
			}
		}
	}
}