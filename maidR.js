/*
 *  maid-system  Ver.1.21
 *  Copyright (C)2004.5.22 by �݂Ȃ݂��� (http://ig.sakura.ne.jp/~sei/)
 */
/*
 *  maid-systemR
 *  2006.12.02 Modified		+:vGrp,tGrp,name=_
 *  2006.12.09 Modified2	+:sOpc -:,a
 *  2006.12.27 Modified3	vGrp,tGrp�����g�p���̉���
 */
var IDhead_img	= "img-";
var IDhead_sw	= "sw-";
var IDhead_swnm	= "swnm-";

var nowImgNo;
var preImgNo;
var oplist;
var imgs = [];

/*
 *  ���̑��̊֐�
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
 *  Img�I�u�W�F�N�g
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
			enabled = true;	// ��ɗL���ɂ���
			opacity = suu;
		}
	}
}

Img.prototype.fixup = function(no)
{
	this._eOpacity = this._eImg = document.getElementById(IDhead_img + no);

	if ("SPAN" == this._eOpacity.tagName) {
		this._eOpacity = this._eOpacity.parentNode;  // AlphaImageLoader���g�p���Ă���ꍇ
	}

}


/*
 *  Effect�I�u�W�F�N�g
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
 *  �摜�̓ǂݍ���
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
	name = (wk = arg.name1) ? wk : ("�摜" + no);

	vGname = (wk = arg.vGrp1) ? wk : ("�摜" + no);
	tGname = (wk = arg.tGrp1) ? wk : "";
	sOpnum = (wk = arg.sOpc1) ? wk : "100";


	if (ua.WINIE55 /*&& ("a" == arg.src2)*/) {
		/*
		 *  WinIE5.5�ȍ~��p 24bit�A���t�@�`���l��PNG �摜�̕\��
		 *  ����ɕ\������Ȃ��Ȃ�̂ŁA�O���̗v�f��opacity��ݒ�
		 *  �ő�\���T�C�Y�� 480x640 �s�N�Z���܂� (����style����ύX�\)
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
 *  �C�x���g����
 */
function swnmFocus(mode) //���O���I�����F�ς�
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


function swnmPressed(e) //���O���I�����\��ON+�`�F�b�N
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


function swChanged(e) //�`�F�b�N�{�b�N�X�g�O��
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


function opacitySelected(e) //�s�����x�I��
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


function setSelected(e) //�Z�b�g�I��
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
		if ((imgs[i].tGname != "") && (imgs[i].vGname != "�摜" + i)){
			for (k = 0; k < imgs.length; k++) {
				if (imgs[k].vGname == imgs[i].vGname){
					imgs[k].vtF = imgs[i].tGname;
				}
			}
		}
	}
}

function swnmPressedtg(e) //���O���I�����\��ON+�`�F�b�N �g�O��
{
	swnmFocus("off");
	nowImgNo = this.id.substr(IDhead_swnm.length);
	swnmFocus("on");

	imgs[nowImgNo].eff.setVisibility(true);
	document.getElementById(IDhead_sw + nowImgNo).checked = true;

	var vnv = imgs[nowImgNo].vGname;
	var vn = imgs[nowImgNo].tGname;

if (preImgNo != nowImgNo){ //�O�ɑI�񂾂̂ƈႤ�ꍇ
	for (var i = 0; i < imgs.length; i++) {
		if (i != nowImgNo){ //���݂̂ƕʂ̂�
			if (imgs[i].tGname == vn){	//���݂̂Ɠ����g�O���l�[���̑��̉摜��
				imgs[i].eff.setVisibility(false); //����
				document.getElementById(IDhead_sw + i).checked = false; //�`�F�b�N���O��
			}
			if (imgs[i].vtF == vn){	//���݂̂Ɠ����g�O���ŕ`�����ꂽ�摜��
				imgs[i].vtF = ""; //�ǂ̃g�O���l�[���ŕ`�����ꂽ����������
				imgs[i].eff.setVisibility(false); //����
				if ((imgs[i].name != "@") && (imgs[i].name != "_")){�@//����Ŗ����Ȃ�
						document.getElementById(IDhead_sw + i).checked = false; //�`�F�b�N���O��
				}
			}
			if (imgs[i].vGname == vnv){	//���݂̂Ɠ����O���[�v�l�[���̉摜��
				imgs[i].vtF = vn; //�ǂ̃g�O���l�[���ŕ`�����ꂽ������Ƃ�
				imgs[i].eff.setVisibility(true); //�`��
				if ((imgs[i].name != "@") && (imgs[i].name != "_")){�@//����Ŗ����Ȃ�
						document.getElementById(IDhead_sw + i).checked = true; //�`�F�b�N������Ƃ�
				}
			}
		}
	}
	preImgNo = nowImgNo;
}

	oplist.selectedIndex = imgs[nowImgNo].opacityListIndex;

}


function swChangedtg(e) //���W�I�{�^���g�O��
{
	swnmFocus("off");
	nowImgNo = this.id.substr(IDhead_sw.length);
	swnmFocus("on");

	imgs[nowImgNo].eff.setVisibility(true);
	document.getElementById(IDhead_sw + nowImgNo).checked = true;

	var vnv = imgs[nowImgNo].vGname;
	var vn = imgs[nowImgNo].tGname;

if (preImgNo != nowImgNo){ //�O�ɑI�񂾂̂ƈႤ�ꍇ
	for (var i = 0; i < imgs.length; i++) {
		if (i != nowImgNo){ //���݂̂ƕʂ̂�
			if (imgs[i].tGname == vn){	//���݂̂Ɠ����g�O���l�[���̑��̉摜��
				imgs[i].eff.setVisibility(false); //����
				document.getElementById(IDhead_sw + i).checked = false; //�`�F�b�N���O��
			}
			if (imgs[i].vtF == vn){	//���݂̂Ɠ����g�O���ŕ`�����ꂽ�摜��
				imgs[i].vtF = ""; //�ǂ̃g�O���l�[���ŕ`�����ꂽ����������
				imgs[i].eff.setVisibility(false); //����
				if ((imgs[i].name != "@") && (imgs[i].name != "_")){�@//����Ŗ����Ȃ�
						document.getElementById(IDhead_sw + i).checked = false; //�`�F�b�N���O��
				}
			}
			if (imgs[i].vGname == vnv){	//���݂̂Ɠ����O���[�v�l�[���̉摜��
				imgs[i].vtF = vn; //�ǂ̃g�O���l�[���ŕ`�����ꂽ������Ƃ�
				imgs[i].eff.setVisibility(true); //�`��
				if ((imgs[i].name != "@") && (imgs[i].name != "_")){�@//����Ŗ����Ȃ�
						document.getElementById(IDhead_sw + i).checked = true; //�`�F�b�N������Ƃ�
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
		if ((imgs[i].tGname != "") && (imgs[i].vGname != "�摜" + i)){
			for (k = 0; k < imgs.length; k++) {
				if (imgs[k].vGname == imgs[i].vGname){
					imgs[k].vtF = imgs[i].tGname;
				}
			}
		}
	}
}