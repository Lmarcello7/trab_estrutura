<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loja do Seu Zé</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="https://cdn.jsdelivr.net/gh/GedMarc/bootstrap4-dialog/dist/css/bootstrap-dialog.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="style/style.css">
</head>
<body>
    <div class="container mt-3">
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-3">
                        <!-- <img src="img/logo.jpg" width="50px" height="40px"> -->
                    </div>
                    <div class="col-6 text-center">
                        <h5 class="mt-2">Loja do Seu Zé</h5>
                    </div>
                    <div class="col-3"></div>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-10">
                        <input type="text" name="busca" id="busca" class="form-control form-control-sm" placeholder="Pesquise por Código ou Produtos">
                    </div>
                    <!-- <div class="col-3"></div> -->
                    <div class="col-2 text-right">
                        <button type="button" class="btn btn-sm alert-success" id="btnCadProd">
                            <i class="fa fa-plus" aria-hidden="true"></i> Cadastrar Produto
                        </button>
                    </div>
                </div>
                <hr>
                <div class="table-responsive">
                    <table id="tableProd" class="table table-sm table-striped table-hover table-bordered">
                        <thead class="thead-dark">
                            <tr>
                                <th width="10%">Código</th>
                                <th width="70%">Produto</th>
                                <th width="10%">Qtd. Disp.</th>
                                <th width="10%">Ações</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div id="alert" class="alert rounded alert-danger d-none text-center">
                    <i class="fa fa-info-circle"></i> Nenhum Produto Cadastrado!
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/GedMarc/bootstrap4-dialog/dist/js/bootstrap-dialog.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
