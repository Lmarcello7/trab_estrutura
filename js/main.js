$(document).ready(function () {
	addRows();

	$('#busca').on('input', debounce(buscar, 300));

	$('#btnCadProd').click(function () {
		BootstrapDialog.show({
			title: '<h4 class="text-dark">Cadastro de Produtos</h4>',
			message: function (dialog) {
				return $('<div></div>').load('modalCadEdit.php')
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
						cod: $('#cod').val(),
						prod: $('#prod').val().trim(),
						qtd: $('#qtd').val()
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
							alert('Produto Cadastrado com Sucesso!');
							addRows();
						},
					});
				}
			}]
		});
	});
});

function addRows() {
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
}

function delRow(key) {
	if (confirm('Deseja Apagar o produto Selecionado? Essa ação não poderá ser desfeita!')) {
		$.ajax({
			url: '../trab/api/api.php',
			type: 'POST',
			dataType: 'json',
			data: {
				function: 'deletProd',
				arrData: JSON.stringify({ rec: key })
			},
			success: function () {
				alert('Produto Apagado com Sucesso!');
				addRows();
			},
		});
	}
}

function editRow(key) {
	BootstrapDialog.show({
		title: '<h4 class="text-dark">Editar Produto</h4>',
		message: function (dialog) {
			return $('<div></div>').load('modalCadEdit.php', { rec: key })
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
						alert('Produto Editado com Sucesso!');
						addRows();
					},
				});
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
	var params = {
        prod: $('#busca').val()
    };

	$.ajax({
		url: '../trab/api/api.php',
		type: 'POST',
		dataType: 'json',
		data: {
			function: 'buscaProd',
			arrData: JSON.stringify(params)
		},
		success: function (data) {
			console.log(data);
		},
	});
}