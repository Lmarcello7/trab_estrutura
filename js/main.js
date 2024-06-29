$(document).ready(function () {
	addRows();
	
	$('#busca').on('input', debounce(buscar, 300));

	$('#btnCadProd').click(function () {
		BootstrapDialog.show({
			title: '<h4 class="text-dark">Cadastro de Produtos</h4>',
			message: function (dialog) {
				var loading = '<div id="divLoad" class="text-center"><i class="fa fa-spinner fa-spin fa-3x" aria-hidden="true"></i><br><b>Carregando</b></div>';
				return $(`<div>${loading}</div>`).load('modalCadEdit.php')
			},
			buttons: [{
				label: 'Fechar',
				cssClass: 'btn-light btn-size-4 mr-02 text-center',
				action: function (dialog) {
					dialog.close();
				}
			},
			{
				label: 'Salvar',
				cssClass: 'btn-success btn-size-4 mr-02 text-center',
				action: function (dialog) {
					let prod = $('#prod').val().trim(),
						qtd = $('#qtd').val();

					if(prod == '' || qtd == '') {
						alertModal('Preencha todos os campos!');
                        return false;
					}

					var params = {
						cod: $('#cod').val(),
						prod: prod,
						qtd: qtd
					};

					$.ajax({
						url: '../trab/api/api.php',
						type: 'POST',
						dataType: 'json',
						data: {
							function: 'cadProd',
							arrData: JSON.stringify(params)
						},
						success: function () {
							dialog.close();
							addRows();
							alertModal('Produto Cadastrado com Sucesso!');
						},
					});
				}
			}]
		});
	});
});

function addRows() {
	let busca = $('#busca').val().trim();

	if(busca == '') {
		$.ajax({
			url: '../trab/api/api.php',
			type: 'POST',
			dataType: 'json',
			data: { function: 'getProdCadastrado' },
			success: function (data) {
				let alert = $('#alert');
				if (data.length > 0) {
					let table = $('#tableProd > tbody'),
						tr = '';
					$.each(data, function (index, valor) {
						tr += `<tr>`;
						tr += `<td>${valor.cod}</td>`;
						tr += `<td>${valor.prod}</td>`;
						tr += `<td>${valor.qtd}</td>`;
						tr += `<td class="align-middle text-center"><button type="button" class="btn btn-sm alert-warning" onclick="editRow(${index})"><i class="fa fa-pencil-square-o"></i></button><button type="button" class="btn btn-sm alert-danger ml-1" onclick="delRow(${index})"><i class="fa fa-trash"></i></i></button></td>`;
						tr += `</tr>`;
					});
	
					if (table.find('tr').length > 0) {
						table.find('tr').remove();
					}
	
					if($('#tableProd').hasClass('d-none')) {
						$('#tableProd').removeClass('d-none');
						alert.addClass('d-none');
					}
	
					table.append(tr);
				} else {
					alert.removeClass('d-none');
					$('#tableProd').addClass('d-none');
				}
			}
		});
	} else {
		buscar();
	}
}

function delRow(key) {
	confirmModal('Deseja Apagar o produto Selecionado? Essa ação não poderá ser desfeita!', delRowAjax, key);
}

function delRowAjax(rec) {
	$.ajax({
		url: '../trab/api/api.php',
		type: 'POST',
		dataType: 'json',
		data: {
			function: 'deletProd',
			arrData: JSON.stringify({ rec: rec })
		},
		success: function () {
			var table = $('#tableProd > tbody > tr');
			alertModal('Produto Deletado com Sucesso!');
			addRows();

			if(table.length == 1) {
				$('#tableProd').addClass('d-none');
				$('#alert').removeClass('d-none');
			} else {
				$('#tableProd').removeClass('d-none');
				$('#alert').addClass('d-none');
			}
		},
	});
}
 
function editRow(key) {
	BootstrapDialog.show({
		title: '<h4 class="text-dark">Editar Produto</h4>',
		message: function (dialog) {
			var loading = '<div id="divLoad" class="text-center"><i class="fa fa-spinner fa-spin fa-3x" aria-hidden="true"></i><br><b>Carregando</b></div>';
			return $(`<div>${loading}</div>`).load('modalCadEdit.php', { rec: key })
		},
		buttons: [{
			label: 'Fechar',
			cssClass: 'btn-light btn-size-4 mr-02 text-center',
			action: function (dialog) {
				dialog.close();
			}
		},
		{
			label: 'Salvar',
			cssClass: 'btn-success btn-size-4 mr-02 text-center',
			action: function (dialog) {
				var params = {
					prod: $('#prod').val().trim(),
					qtd: $('#qtd').val(),
					rec: rec.replaceAll('"','')
				};

				$.ajax({
					url: '../trab/api/api.php',
					type: 'POST',
					dataType: 'json',
					data: {
						function: 'editProd',
						arrData: JSON.stringify(params)
					},
					success: function () {
						dialog.close();
						alertModal('Produto Editado com Sucesso!');
						addRows();
					},
				});
			}
		}]
	});
}
function alertModal(message){
	BootstrapDialog.show({
		title: 'ATENÇÃO!',
		id: 'alertModal',
		type: BootstrapDialog.TYPE_DEFAULT,
		closable: false,
		message: function(dialog) {
			var $content = $('<div><b>'+message+'</b></div>');
			return $content;
		},
		buttons: [{
			id: 'btn-confirm',
			label: 'Ok',
			cssClass: 'btn-primary btn-size-3',
			autospin: false,
			action: function(dialog) {
				dialog.close();
			}
		}]
	});
}

function confirmModal(message, functionY = '', paramsY = '', functionN = '', paramsN = '') {
	BootstrapDialog.show({
		title: 'ATENÇÃO!',
		id: 'confirmModal',
		type: BootstrapDialog.TYPE_DEFAULT,
		closable: false,
		message: function(dialog) {
			var $content = $('<div><b>'+message+'</b></div>');
			return $content;
		},
		buttons: [{
			id: 'btn-yes',
			icon: 'fa fa-check-circle',
			label: ' Sim',
			cssClass: 'btn-success btn-size-3 mr-2',
			autospin: false,
			action: function(dialog) {
				$(this).prop('disabled', true);

				if ($.trim(functionY) != '') {
					functionY.call(this, paramsY);
				}
				dialog.close();
			}
		},{
			id: 'btn-no',
			icon: 'fa fa-ban',
			label: ' Não',
			cssClass: 'btn-danger btn-size-3',
			autospin: false,
			action: function(dialog) {
				if ($.trim(functionN) != '') {
					functionN.call(this, paramsN);
				}
				dialog.close();
			}
		}]
	});
}

function debounce(func, wait) {
	let timeout;
	return function(...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}

function buscar() {
	var busca = $('#busca').val().trim();

	var params = {
        prod: busca
    };

	if(busca == '') {
		addRows();
		return;
	}

	$.ajax({
		url: '../trab/api/api.php',
		type: 'POST',
		dataType: 'json',
		data: {
			function: 'buscaProd',
			arrData: JSON.stringify(params)
		},
		success: function (data) {
			if(data.length > 0) {
				let table = $('#tableProd > tbody'),
                    tr = '';
                $.each(data, function (index, valor) {
                    tr += `<tr>`;
                    tr += `<td>${valor.cod}</td>`;
                    tr += `<td>${valor.prod}</td>`;
                    tr += `<td>${valor.qtd}</td>`;
                    tr += `<td class="align-middle text-center"><button type="button" class="btn btn-sm alert-warning" onclick="editRow(${valor.key})"><i class="fa fa-pencil-square-o"></i></button><button type="button" class="btn btn-sm alert-danger ml-1" onclick="delRow(${valor.key})"><i class="fa fa-trash"></i></button></td>`;
                    tr += `</tr>`;
                });

				if (table.find('tr').length > 0) {
					table.find('tr').remove();
				}
				
				table.append(tr);
			}
		},
	});
}