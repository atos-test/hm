var fs = null;
var Firma= {
	self: this,
	signatureInit: false,
	
    load: function () {
    	console.log("=============== Page Firma ===============");
    	console.log("URL: => ",window.location.toString(),"\nLocation: => ",window.location);
		
		var height = $(document).height() - ($("#header").height() + 8);
		$("#areaFirma").height(height);
		
		var width = $(document).width() - 6;
		$("#areaFirma").width(width);
		
		self = Firma;
    	self.bindEvents();
		self.refreshView();
    },
	onDeviceReady: function() {
		
	},
    exit: function () {
    	
    },
    refreshView: function (){
    	self.initSignature();
    },
	initSignature: function(){
		if (!self.signatureInit){
			self.signatureInit=true;
			$("#areaFirma").jSignature('init',
					{'height':'100%','width':'100%', 
					'UndoButton':false,'color':"#000000",'lineWidth':3
					});
		}
		$("#areaFirma").jSignature("reset");
	},
    bindEvents: function (){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, self.onFileSystemSuccess, self.onFail);
		
    	$("#btnBorrar").on( "vclick", self.initSignature);

    	$("#btnSalir").off("vclick").on("vclick",function(){
			navigator.app.exitApp();
    	});

    	$("#btnAceptar").off("vclick").on("vclick",function(){
    		self.saveSignPad();
    	});
		
		document.addEventListener("backbutton", function(e){e.preventDefault();navigator.app.exitApp();}, false);
    },
	saveSignPad: function () {
		var signExport = $("#areaFirma").jSignature("getData", "image");
		var signExportArray = Base64Binary.decodeArrayBuffer(signExport[1]);
		
		fs.root.getDirectory("Hartmann",{create: true, exclusive: false},function(parent){
			parent.getFile("test.png",{create:true},function(file){
				file.createWriter(function(writer){
					writer.write(signExportArray);
					window.location.href = "codOperacion.html";
					//$.mobile.changePage("codOperacion.html");
				}, function(){self.onFail("createWriter");});
			}, function(){self.onFail("getFile");});
		},function(){self.onFail("getDirectory");});
	},
	onFileSystemSuccess: function (fileSystem) {
		fs = fileSystem;
	},
	onFail: function (error){
		console.log(error);
	}
};