document.addEventListener('DOMContentLoaded', function() {
	initRangeSlider();
	initButtonsForm();
});


function initButtonsForm() {
	let buttonNovaTarefa = document.getElementById('btn-nova-tarefa');
	let buttonCancelar = document.getElementById('btn-cancelar');
	
	buttonNovaTarefa.addEventListener('click', function() {
		document.getElementById('form').classList.add('form-container--open');
	});
	
	buttonCancelar.addEventListener('click', function() {
		let form = document.forms['tarefa-form'];
		form["id"].value = "";
		form["descricao"].value = "";
		document.getElementById('form').classList.remove('form-container--open');
	});
}

function editarTarefa(event) {
	let dataset = event.target.dataset;
	
	let form = document.forms['tarefa-form'];
	form["id"].value = dataset.tarefaId;
	form["descricao"].value = dataset.tarefaDescricao;
	document.getElementById('form').classList.add('form-container--open');
}

function initRangeSlider() {
	var $element = $('input[type="range"]');

	$element
	  .rangeslider({
		 polyfill: false,
		 onInit: function() {
			var $handle = $('.rangeslider__handle', this.$range);
			updateHandle($handle[0], this.value);
		 }
	  })
	  .on('input', function(e) {
		 var $handle = $('.rangeslider__handle', e.target.nextSibling);
		 updateHandle($handle[0], this.value);
	  });

	function updateHandle(el, val) {
	  el.textContent = val + '%';
	}
}