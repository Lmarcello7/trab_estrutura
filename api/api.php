<?php
session_start();

// unset($_SESSION['arrProd']);

$function = $_REQUEST['function'];

if(isset($_REQUEST['arrData'])) {
	$arrayData = json_decode($_REQUEST['arrData'], true);
}

if (!isset($_SESSION['arrProd'])) {
	$_SESSION['arrProd'] = [];
}

$arrProd = &$_SESSION['arrProd'];

$return = call_user_func($function, $arrayData ?? '');

echo json_encode($return);

function cadProd($params)
{
	global $arrProd;

	$arrProd[] = [
		'cod' => (int) $params['cod'],
		'prod' => $params['prod'],
		'qtd' => (int) $params['qtd']
	];

	return $arrProd;
}

function getCodProd()
{
	global $arrProd;
	return count($arrProd) + 1;
}

function getProdCadastrado()
{
	global $arrProd;
	return $arrProd;
}

function deletProd($params)
{
	global $arrProd;

	unset($_SESSION['arrProd'][$params['rec']]);
	$arrProd = array_values($_SESSION['arrProd']);
	$_SESSION['arrProd'] = $arrProd;

	return;
}

function getItensProd($params)
{
	global $arrProd;
	return $arrProd[$params];
}

function editProd($params)
{
	global $arrProd;
	
	$index = (int) $params['rec'];
	$arrProd[$index]['prod'] = $params['prod'];
	$arrProd[$index]['qtd'] = (int) $params['qtd'];
	
	return;
}

function criarNo($produto, $codigo) {
    return [
        'produto' => $produto,
        'codigo' => $codigo,
        'esquerda' => null,
        'direita' => null
    ];
}

function inserirNo(&$raiz, $produto, $codigo) {
    if ($raiz === null) {
        $raiz = criarNo($produto, $codigo);
    } else {
        if ($codigo < $raiz['codigo']) {
            inserirNo($raiz['esquerda'], $produto, $codigo);
        } else {
            inserirNo($raiz['direita'], $produto, $codigo);
        }
    }
}

function buscarPorNomeProduto($raiz, $termoBusca, &$resultados = []) {
    if ($raiz !== null) {
        // Verifica se o nome do produto contém a substring
        if (stripos($raiz['produto'], $termoBusca) !== false) {
            $resultados[] = $raiz;
        }
        
        // Continua a busca na subárvore esquerda e direita
        buscarPorNomeProduto($raiz['esquerda'], $termoBusca, $resultados);
        buscarPorNomeProduto($raiz['direita'], $termoBusca, $resultados);
    }
    return $resultados;
}


function buscaProd($params)
{
	global $arrProd;

	$raiz = null;
	foreach ($arrProd as $item) {
		inserirNo($raiz, $item['prod'], $item['prod']);
	}

	$termoBusca = $params['prod'];
	$resultados = buscarPorNomeProduto($raiz, $termoBusca);

	return $resultados;
}