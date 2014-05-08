
var app = {
    alturaHeader: 0,
    alturaFooter: 0,
    alturaContent: 0,
    alturaGrid: 0,
    alturaGridB: 0,
    alturaDocument: 0,
    nBloques: 4,
    huecoMax: 30,
    extension: ".png",

    initialize: function() {
        app.refreshView();
        app.bindEvents();
    },

    refreshView: function(){
        var self = app;
        self.cambioDimensiones();
    },

    cambioDimensiones: function(){
        var self = app;

        /*Calculamos y adaptamos la altura de los bloques, en funcion de la altura de la pantalla*/

        self.alturaHeader = $("#header").outerHeight();
        self.alturaFooter = $("#footer").outerHeight();
        self.alturaDocument = $(document).height();
        self.alturaGrid = $("#gridA").outerHeight();
        self.alturaContent = $("#content").outerHeight();
        self.alturaGridB = $("#bloqueB").outerHeight();

        self.alturaContent = self.alturaDocument - self.alturaHeader;
        self.alturaGrid = self.alturaContent/self.nBloques;

        $("#content").height(self.alturaContent);
        $("#gridA").height(self.alturaContent);
        $("#bloqueA").height(self.alturaContent); 
        $(".ui-grid-b").height(self.alturaGrid); 

        $("#bloqueB").css({ 'paddingTop': (self.alturaContent - self.alturaGridB)/2}); 


        /*Adaptamos las dimensiones de los botones en funcion del tamaño de la pantalla*/
        var alturaBtn = (self.alturaGrid/4) + "px";

        $(".btnDig").css({ 'padding': alturaBtn});
        $(".btnBorrar").css({ 'paddingTop': alturaBtn});
        $(".btnBorrar").css({ 'paddingBottom': alturaBtn});


        /*Adaptamos el ancho del boton "Borrar", al ancho de 2 botones*/
        var widthButton = $("#btn8").outerWidth() + 10;
        var widthBloqueBtn = $("#bloqueBtn").outerWidth();
        var widthBloque = $(".ui-block-c").outerWidth();
        var hueco = widthBloque - widthButton;
        var anchoBtnBorrar = widthBloqueBtn-hueco-5; //5 de margin

        $(".btnBorrar").css({ 'width': anchoBtnBorrar});

        /*Adaptamos el ancho del boton Aceptar-Cancelar al tamaño de la pantalla*/
        var widthBloqueB = $("#bloqueB").outerWidth();
        var widthAceptar = $("#btnAceptar").outerWidth();
        var huecoAceptarCancelar = widthBloqueB - widthAceptar*2;

        console.log("Bloque B: ", widthBloqueB);
        console.log("btnAceptar: ", widthAceptar);
        console.log("hueco: ", huecoAceptarCancelar);

        /*Si hay un hueco menor de 30, no aplicamos ningun cambio
        * En caso contrario, añadimos la mitad de la diferencia al ancho de cada boton
        */
        if(huecoAceptarCancelar < self.huecoMax){
            console.log("No hago cambios");
        }
        else{
            var diferenciaHuecoMax = huecoAceptarCancelar - self.huecoMax;

            console.log("diferencia: ", diferenciaHuecoMax);
            var anchoExtra = $("#btnAceptar").width() + diferenciaHuecoMax/2;
            $("#btnAceptar").width(anchoExtra);
            $("#btnCancelar").width(anchoExtra);
        }

        
    },

    bindEvents: function() {
        var self = app;
        
        var valor = document.getElementsByName("btnDigito");

        /*Cada vez que pulsemos un número, lo mostramos en el input, y se muestra el boton de clear*/
        $(valor).on("vclick",function(){

            $(".ui-input-clear").removeClass("ui-input-clear-hidden");
            $("#inputCodigo").val($("#inputCodigo").val()+this.text);
        });

        /*Al pulsar el boton de borrar, quitamos el ultimo digito escrito en el input
        * además, si al borrar, se vacia el input, se vuelve a ocultar el boton de limpiar
        */
        $("#btnBorrar").on('vclick', function() {     
            $("#inputCodigo").val( $("#inputCodigo").val().substring(0, $("#inputCodigo").val().length - 1) );
            if($("#inputCodigo").val() == ""){
                $(".ui-input-clear").addClass("ui-input-clear-hidden");
            } 
        });

        //Aqui se incluye toda la lógica de guardar la imagen, cuyo nombre de archivo será $("#inputCodigo").val().jpg
        $("#btnAceptar").on("vclick", function(){
			if($("#inputCodigo").val() == ""){
				alert("Debe escribir el número de orden");
				return;
			}
            var nombreArchivo = $("#inputCodigo").val() + self.extension;
            console.log("Nombre archivo: " + nombreArchivo);
			self.renameFile("test.png", "Hartmann/", nombreArchivo, self.renameSuccess);
        });

        $("#btnCancelar").on("vclick", function(){
            window.location.href = "index.html";
        });

        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("backbutton", function(e){e.preventDefault();navigator.app.exitApp();}, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
	renameFile: function(currentName, currentDir, newName, successFunction) {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
			fileSystem.root.getFile(currentDir + currentName, null, function (fileEntry) {
				fileSystem.root.getDirectory(currentDir, {create: true}, function (dirEntry) {
					parentEntry = new DirectoryEntry(currentName, currentDir + currentName);
					fileEntry.moveTo(dirEntry, newName, function () {
						successFunction();
					}, self.renameFail);
				}, self.renameFail);
			}, self.renameFail);
		}, self.renameFail);
	},
	renameSuccess: function(){
		window.location.href = "index.html";
	},
	renameFail: function(){
		alert('failed');
	}
};