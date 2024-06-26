<?php

//Inicia a sessão
session_start();

// Inicia a sessão e define uma variável de função com base no pedido do cliente
$function = $_REQUEST['function'];

// Decodifica dados JSON recebidos e armazena em um array associativo
if (isset($_REQUEST['arrData'])) {
    $arrayData = json_decode($_REQUEST['arrData'], true);
}

// Inicializa o array de produtos na sessão, se não estiver definido
if (!isset($_SESSION['arrProd'])) {
    $_SESSION['arrProd'] = [];
}

// Referência ao array de produtos da sessão
$arrProd = &$_SESSION['arrProd'];

// Chama a função correspondente à ação solicitada e armazena o resultado
$return = call_user_func($function, $arrayData ?? '');

// Retorna o resultado como um JSON
echo json_encode($return);

/**
 * Adiciona um novo produto ao array de produtos.
 * 
 * @param array $params Dados do produto (código, nome e quantidade).
 * @return array Array atualizado de produtos.
 */
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

/**
 * Retorna o próximo código de produto disponível.
 * 
 * @return int Código do próximo produto.
 */
function getCodProd()
{
    global $arrProd;
    return count($arrProd) + 1;
}

/**
 * Retorna o array de produtos cadastrados.
 * 
 * @return array Array de produtos.
 */
function getProdCadastrado()
{
    global $arrProd;
    return $arrProd;
}

/**
 * Deleta um produto do array de produtos com base no índice fornecido.
 * 
 * @param array $params Índice do produto a ser deletado.
 */
function deletProd($params)
{
    global $arrProd;

    unset($_SESSION['arrProd'][$params['rec']]);
    $arrProd = array_values($_SESSION['arrProd']);
    $_SESSION['arrProd'] = $arrProd;
}

/**
 * Retorna os itens de um produto específico.
 * 
 * @param int $params Índice do produto.
 * @return array Dados do produto.
 */
function getItensProd($params)
{
    global $arrProd;
    return $arrProd[$params];
}

/**
 * Edita os dados de um produto existente.
 * 
 * @param array $params Índice e novos dados do produto (nome e quantidade).
 */
function editProd($params)
{
    global $arrProd;
    
    $index = (int) $params['rec'];
    $arrProd[$index]['prod'] = $params['prod'];
    $arrProd[$index]['qtd'] = (int) $params['qtd'];
}

/**
 * Cria um novo nó para a árvore binária de busca.
 * 
 * @param string $produto Nome do produto.
 * @param int $codigo Código do produto.
 * @param array $item Dados do produto.
 * @return array Nó da árvore.
 */
function criarNo($produto, $codigo, $item) {
    return [
        'produto' => $produto,
        'codigo' => $codigo,
        'itens' => $item,
        'esquerda' => null,
        'direita' => null
    ];
}

/**
 * Insere um novo nó na árvore binária de busca.
 * 
 * @param array &$raiz Referência à raiz da árvore.
 * @param string $produto Nome do produto.
 * @param int $codigo Código do produto.
 * @param array $item Dados do produto.
 */
function inserirNo(&$raiz, $produto, $codigo, $item) {
    if ($raiz === null) {
        $raiz = criarNo($produto, $codigo, $item);
    } else {
        if ($codigo < $raiz['codigo']) {
            inserirNo($raiz['esquerda'], $produto, $codigo, $item);
        } else {
            inserirNo($raiz['direita'], $produto, $codigo, $item);
        }
    }
}

/**
 * Busca produtos pelo nome na árvore binária de busca.
 * 
 * @param array $raiz Raiz da árvore.
 * @param string $termoBusca Termo de busca.
 * @param array &$resultados Referência ao array de resultados.
 * @return array Produtos que correspondem ao termo de busca.
 */
function buscarPorNomeProduto($raiz, $termoBusca, &$resultados = []) {
    if ($raiz !== null) {
        if (stripos($raiz['produto'], $termoBusca) !== false) {
            $resultados[] = $raiz;
        }
        
        buscarPorNomeProduto($raiz['esquerda'], $termoBusca, $resultados);
        buscarPorNomeProduto($raiz['direita'], $termoBusca, $resultados);
    }
    return $resultados;
}

/**
 * Realiza a busca de produtos pelo nome.
 * 
 * @param array $params Parâmetros de busca (nome do produto).
 * @return array Produtos que correspondem ao termo de busca.
 */
function buscaProd($params)
{
    global $arrProd;

    $raiz = null;
    foreach ($arrProd as $item) {
        inserirNo($raiz, $item['prod'], $item['prod'], $item);
    }

    $termoBusca = $params['prod'];
    $resultados = buscarPorNomeProduto($raiz, $termoBusca);

	foreach($resultados as $k1 => $v1) {
		foreach($arrProd as $k2 => $v2) {
			if($v1['produto'] == $v2['prod']) {
				$resultados[$k1]['itens']['key'] = $k2;
			}
		}
	}

	$arrReturn = [];
	foreach($resultados as $item) {
        $arrReturn[] = $item['itens'];
    }
    return $arrReturn;
}
